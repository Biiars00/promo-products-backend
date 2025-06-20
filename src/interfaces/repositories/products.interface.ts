export interface IProductsProps {
  name: string;
  description?: string;
  stock: number;
  price: number;
}

export interface IProductsDataDBProps {
  id: number;
  name: string;
  description?: string;
  stock: number;
  price: number;
  created_at: Date;
  updated_at: Date;
  is_out_of_stock: boolean;
}

export interface IProductUpdateProps {
  stock?: number;
  price?: number;
}

export interface ICheckStockProps {
  is_out_of_stock: boolean;
}

interface IProductsRepository {
  addProductsFromDB(data: IProductsProps, createdAt: Date): Promise<number>;
  checkNameProductExistsOnDB(name: string): Promise<boolean>;
  getProductsFromDB(): Promise<IProductsDataDBProps[]>;
  getProductByIdFromDB(id: number): Promise<IProductsDataDBProps>;
  updateProductFromDB(id: number, data: IProductUpdateProps, updatedAtt: Date): Promise<IProductUpdateProps>;
  reactivateProductFromDB(id: number, data: ICheckStockProps): Promise<boolean>;
  inactivateProductFromDB(id: number, data: ICheckStockProps): Promise<boolean>;
}

export default IProductsRepository;
