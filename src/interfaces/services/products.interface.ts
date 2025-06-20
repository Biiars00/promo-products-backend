import { ICheckStockProps, IProductsProps, IProductUpdateProps } from "../repositories/products.interface";

export interface IProductsDataProps {
  id: number;
  name: string;
  description?: string;
  stock: number;
  price: number;
  created_at: string;
  updated_at: string;
  is_out_of_stock: boolean;
}

interface IProductsService {
  addProducts(data: IProductsProps): Promise<number>;
  getProducts(): Promise<IProductsDataProps[]>;
  getProductById(id: number): Promise<IProductsDataProps>;
  updateProduct(id: number, data: IProductUpdateProps): Promise<IProductUpdateProps>;
  inactivateProduct(id: number, data: ICheckStockProps): Promise<boolean>;
  reactivateProduct(id: number, data: ICheckStockProps): Promise<boolean>;
}

export default IProductsService;
