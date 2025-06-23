import { IProductsProps } from "../../services/products/products.interface";

export interface IProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  hasDiscount?: boolean;
  sortBy?: 'name' | 'price' | 'created_at' | 'stock';
  sortOrder?: 'asc' | 'desc';
  includeDeleted?: boolean;
  onlyOutOfStock?: boolean;
  withCouponApplied?: boolean;
}

export interface IProductQuerySql {
  whereClause: string;
  params: any[];
  orderByClause: string;
}

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

export interface IPaginatedDBProducts {
  data: IProductsDataDBProps[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
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
  getProductQuery(query: IProductQuery): Promise<IProductQuerySql>;
  addProductsFromDB(data: IProductsProps, createdAt: Date): Promise<number>;
  checkNameProductExistsOnDB(name: string): Promise<boolean>;
  getProductsFromDB(query: IProductQuery): Promise<IPaginatedDBProducts>;
  getProductByIdFromDB(id: number): Promise<IProductsDataDBProps>;
  updateProductFromDB(id: number, data: IProductUpdateDBProps): Promise<IProductUpdateDBProps>;
  reactivateProductFromDB(id: number, data: ICheckStockDBProps): Promise<boolean>;
  inactivateProductFromDB(id: number, data: ICheckStockDBProps): Promise<boolean>;
}

export default IProductsRepository;
