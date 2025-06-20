import { injectable } from 'tsyringe';
import IProductsRepository, {
  ICheckStockProps,
  IProductsDataDBProps,
  IProductsProps,
  IProductUpdateProps,
} from '../../interfaces/repositories/products.interface';
import { connection } from '../../database/databaseConnection';
import { ResultSetHeader } from 'mysql2';
import { ErrorMiddleware } from '../../middlewares/error.middleware';

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

  async updateProductFromDB(id: number, data: IProductUpdateProps, updatedAtt: Date): Promise<IProductUpdateProps> {
    const [columns] = await connection.execute(
    `SELECT COLUMN_NAME 
     FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = ?
     AND TABLE_NAME = 'products' 
     AND COLUMN_NAME = 'updated_at'`,
     [this.database]
  );

    const columnExists = (columns as any[]).length > 0;

    if (!columnExists) {
      await connection.execute(
        `ALTER TABLE products 
         ADD COLUMN updated_at DATETIME NOT NULL 
         DEFAULT CURRENT_TIMESTAMP`
      );
    }

    const { stock, price } = data;

    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE products 
      SET stock = ?, price = ?, updated_at = ? 
      WHERE id = ?`,
      [stock, price, updatedAtt, id],
    );

    if (result.affectedRows === 0) {
      throw new ErrorMiddleware(404, 'Product not found!');
    }

    const [searchProduct] = await connection.execute(
      'SELECT stock, price FROM products WHERE id = ?',
      [id]
    );

    const dataProduct = (searchProduct as IProductUpdateProps[])[0];

    if (!dataProduct) {
      throw new ErrorMiddleware(404, 'Product not found!');
    }

    return dataProduct;
  }

  async inactivateProductFromDB(id: number, data: ICheckStockProps): Promise<boolean> {
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ?
       AND TABLE_NAME = 'products' 
       AND COLUMN_NAME = 'is_out_of_stock'`,
      [this.database]
    );

    const columnExists = (columns as any[]).length > 0;

    if (!columnExists) {
      await connection.execute(
        `ALTER TABLE products 
         ADD COLUMN is_out_of_stock BOOL`
      );
    }

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

  async reactivateProductFromDB(id: number, data: ICheckStockProps): Promise<boolean> {
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
