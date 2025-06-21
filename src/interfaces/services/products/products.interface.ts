export interface IProductsProps {
  name: string,
  description?: string,
  stock: number,
  price: number
}

export interface IProductsDataProps {
  id: number,
  name: string,
  description?: string,
  stock: number,
  price: number,
  createdAt: string,
  updatedAt: string | null,
  isOutOfStock: boolean
}

export interface IProductUpdateProps {
  stock?: number,
  price?: number,
  updatedAt?: string | null
}

export interface ICheckStockProps {
  isOutOfStock: boolean
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
