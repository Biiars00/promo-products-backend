import { injectable } from 'tsyringe';
import IProductsRepository, {
  ICheckStockDBProps,
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

  async getProductsFromDB(): Promise<IProductsDataDBProps[]> {
    const [rows] = await connection.execute('SELECT * FROM products');

    const products = (rows as IProductsDataDBProps[]);

    return products || [];
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
