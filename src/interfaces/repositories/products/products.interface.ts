import { IProductsProps } from "../../services/products/products.interface";

export interface IProductsDataDBProps {
  id: number,
  name: string,
  description?: string,
  stock: number,
  price: number,
  created_at: Date,
  updated_at: Date | null,
  is_out_of_stock: boolean
}

export interface IProductUpdateDBProps {
  stock?: number,
  price?: number,
  updated_at?: Date | null
}

export interface ICheckStockDBProps {
  is_out_of_stock: boolean
}

interface IProductsRepository {
  addProductsFromDB(data: IProductsProps, createdAt: Date): Promise<number>;
  checkNameProductExistsOnDB(name: string): Promise<boolean>;
  getProductsFromDB(): Promise<IProductsDataDBProps[]>;
  getProductByIdFromDB(id: number): Promise<IProductsDataDBProps>;
  updateProductFromDB(id: number, data: IProductUpdateDBProps): Promise<IProductUpdateDBProps>;
  reactivateProductFromDB(id: number, data: ICheckStockDBProps): Promise<boolean>;
  inactivateProductFromDB(id: number, data: ICheckStockDBProps): Promise<boolean>;
}

export default IProductsRepository;
