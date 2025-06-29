import { injectable } from 'tsyringe';
import IProductsRepository, {
  ICheckStockDBProps,
  IPaginatedDBProducts,
  IProductQuery,
  IProductQuerySql,
  IProductsDataDBProps,
  IProductUpdateDBProps,
} from '../../interfaces/repositories/products/products.interface';
import pool from '../../database/databaseConnection';
import { ErrorMiddleware } from '../../middlewares/error.middleware';
import { IProductsProps } from '../../interfaces/services/products/products.interface';

@injectable()
export class ProductsRepository implements IProductsRepository {
  private database = process.env.DB_DATABASE;

  constructor() {
    this.database
  }

  async getProductQuery(query: IProductQuery): Promise<IProductQuerySql> {
    const where: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (query.search) {
      where.push(`name LIKE $${paramIndex} OR description ILIKE $${paramIndex + 1}`);
      params.push(`%${query.search}%`, `%${query.search}%`);
      paramIndex += 2;
    }

    if (query.minPrice !== undefined) {
      where.push(`price >= $${paramIndex}`);
      params.push(query.minPrice);
      paramIndex++;
    }

    if (query.maxPrice !== undefined) {
      where.push(`price <= $${paramIndex}`);
      params.push(query.maxPrice);
      paramIndex++;
    }

    if (query.hasDiscount) {
      where.push(`EXISTS (
        SELECT 1 FROM product_coupon_applications pca
        INNER JOIN coupons c ON pca.coupon_id = c.id
        WHERE pca.product_id = products.id 
          AND pca.removed_at IS NULL
          AND c.deleted_at IS NULL
          AND NOW() BETWEEN c.valid_from AND c.valid_until
      )`);
    }

    if (query.onlyOutOfStock) {
      where.push('stock = 0');
    }

    if (query.withCouponApplied) {
      where.push(`EXISTS (
        SELECT 1 FROM product_coupon_applications pca 
        WHERE pca.product_id = products.id AND pca.removed_at IS NULL
      )`);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const orderByClause = query.sortBy 
      ? `ORDER BY ${query.sortBy} ${(query.sortOrder || 'asc').toUpperCase()}`
      : '';

    return { whereClause, params, orderByClause };
  }

  async addProductsFromDB(data: IProductsProps, createdAt: Date): Promise<number> {
    const { name, description, stock, price } = data;

    const result = await pool.query(
      `INSERT INTO products (name, description, stock, price, created_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `,
      [name, description, stock, price, createdAt],
    );

    return result.rows[0].id;
  }

  async checkNameProductExistsOnDB(name: string): Promise<boolean> {
    const checkName = await pool.query('SELECT name FROM products WHERE name = $1', [name]);

    return checkName.rows.length > 0;;
  }

  async getProductsFromDB(query: IProductQuery): Promise<IPaginatedDBProducts> {
    const page = query.page && query.page >= 1 ? query.page : 1;
    const limit = query.limit && query.limit >= 1 && query.limit <= 50 ? query.limit : 10;
    const offset = (page - 1) * limit;

    const { whereClause, params, orderByClause } = await this.getProductQuery(query);

    const sql = `
      SELECT * FROM products
      ${whereClause}
      ${orderByClause}
      LIMIT ${limit} OFFSET ${offset}
    `.trim();

    const dataResult  = await pool.query(sql, params);

    const sqlCount = `
      SELECT COUNT(*)::int as total FROM products
      ${whereClause}
    `.trim();

    const countResult = await pool.query(sqlCount, params);
    const totalItems = countResult.rows[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: dataResult.rows as IProductsDataDBProps[],
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
      }
    }
  }

  async getProductByIdFromDB(id: number): Promise<IProductsDataDBProps> {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [
      id,
    ]);

    const dataProduct = result.rows[0] as IProductsDataDBProps;

    if (!dataProduct) {
      throw new ErrorMiddleware(404, 'Product not found!')
    }

    return dataProduct;
  }

  async updateProductFromDB(id: number, data: IProductUpdateDBProps): Promise<IProductUpdateDBProps> {
    const { stock, price, updated_at } = data;

    const updateResult = await pool.query(
      `UPDATE products 
      SET stock = $1, price = $2, updated_at = $3 
      WHERE id = $4`,
      [stock, price, updated_at, id],
    );

    if (updateResult.rowCount === 0) {
      throw new ErrorMiddleware(404, 'Product not found!');
    }

    const result = await pool.query(
      `SELECT stock, price, updated_at 
       FROM products 
       WHERE id = $1`,
      [id],
    );

    return result.rows[0] as IProductUpdateDBProps;
  }

  async inactivateProductFromDB(id: number, data: ICheckStockDBProps): Promise<boolean> {
    const { is_out_of_stock } = data;

    const result = await pool.query(
      `UPDATE products 
       SET is_out_of_stock = $1 
       WHERE id = $2`,
      [is_out_of_stock, id],
    );

    if (result.rowCount === 0) {
      throw new ErrorMiddleware(404, 'Product not found!');
    } 

    return true;
  }

  async reactivateProductFromDB(id: number, data: ICheckStockDBProps): Promise<boolean> {
    const { is_out_of_stock } = data;

    const result = await pool.query(
      `UPDATE products 
       SET is_out_of_stock = $1
       WHERE id = $2`,
      [is_out_of_stock, id],
    );

    if (result.rowCount === 0) {
      throw new ErrorMiddleware(404, 'Product not found!');
    } 

    return false;
  }
}
