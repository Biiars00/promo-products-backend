import { injectable } from 'tsyringe';
import IProductsRepository, {
  ICheckStockDBProps,
  IPaginatedDBProducts,
  IProductQuery,
  IProductQuerySql,
  IProductsDataDBProps,
  IProductUpdateDBProps,
} from '../../interfaces/repositories/products/products.interface';
import { connection } from '../../database/databaseConnection';
import { ResultSetHeader } from 'mysql2';
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

    if (query.search) {
      where.push('(name LIKE ? OR description LIKE ?)');
      params.push(`%${query.search}%`, `%${query.search}%`);
    }

    if (query.minPrice !== undefined) {
      where.push('price >= ?');
      params.push(query.minPrice);
    }

    if (query.maxPrice !== undefined) {
      where.push('price <= ?');
      params.push(query.maxPrice);
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

    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO products (name, description, stock, price, created_at)
        VALUES (?, ?, ?, ?, ?)`,
      [name, description, stock, price, createdAt],
    );

    return result.insertId;
  }

  async checkNameProductExistsOnDB(name: string): Promise<boolean> {
    const [checkName] = await connection.execute('SELECT name FROM products WHERE name = ?', [
      name,
    ]);

    return Array.isArray(checkName) && checkName.length > 0;
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

    const [rows] = await connection.execute(sql, params);

    const sqlCount = `
      SELECT COUNT(*) as total FROM products
      ${whereClause}
    `.trim();

    const [countResult] = await connection.execute(sqlCount, params);

    const totalItems = (countResult as any[])[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: rows as IProductsDataDBProps[],
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
      }
    }
  }

  async getProductByIdFromDB(id: number): Promise<IProductsDataDBProps> {
    const [rows] = await connection.execute('SELECT * FROM products WHERE id = ?', [
      id,
    ]);

    const dataProduct = (rows as IProductsDataDBProps[])[0];

    if (!dataProduct) {
      throw new ErrorMiddleware(404, 'Product not found!')
    }

    return dataProduct;
  }

  async updateProductFromDB(id: number, data: IProductUpdateDBProps): Promise<IProductUpdateDBProps> {
    const { stock, price, updated_at } = data;

    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE products 
      SET stock = ?, price = ?, updated_at = ? 
      WHERE id = ?`,
      [stock, price, updated_at, id],
    );

    if (result.affectedRows === 0) {
      throw new ErrorMiddleware(404, 'Product not found!');
    }

    const [rows] = await connection.execute(
      `SELECT stock, price, updated_at 
       FROM products 
       WHERE id = ?`,
      [id],
    );

    const dataProduct = (rows as IProductUpdateDBProps[])[0];

    return dataProduct;
  }

  async inactivateProductFromDB(id: number, data: ICheckStockDBProps): Promise<boolean> {
    const { is_out_of_stock } = data;

    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE products 
       SET is_out_of_stock = ? 
       WHERE id = ?`,
      [is_out_of_stock, id],
    );

    if (result.affectedRows === 0) {
      throw new ErrorMiddleware(404, 'Product not found!');
    } 

    return true;
  }

  async reactivateProductFromDB(id: number, data: ICheckStockDBProps): Promise<boolean> {
    const { is_out_of_stock } = data;

    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE products 
       SET is_out_of_stock = ? 
       WHERE id = ?`,
      [is_out_of_stock, id],
    );

    if (result.affectedRows === 0) {
      throw new ErrorMiddleware(404, 'Product not found!');
    } 

    return false;
  }
}
