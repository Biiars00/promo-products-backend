import { IProductQuery } from "../../repositories/products/products.interface";
import { ICalculateApplyCouponProps } from "../applyCoupons/calculateValueAppliedCoupon.interface";

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
  isOutOfStock: boolean,
  activeCoupon: ICalculateApplyCouponProps | null
}

export interface IPaginatedProducts {
  data: IProductsDataProps[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
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
  getProducts(query: IProductQuery): Promise<IPaginatedProducts>;
  getProductById(id: number): Promise<IProductsDataProps>;
  updateProduct(id: number, data: IProductUpdateProps): Promise<IProductUpdateProps>;
  inactivateProduct(id: number, data: ICheckStockProps): Promise<boolean>;
  reactivateProduct(id: number, data: ICheckStockProps): Promise<boolean>;
}

export default IProductsService;
