export interface IApplyCouponProps {
  product_id: number;
  coupon_id: number;
  applied_at?: Date;
  removed_at?: Date;
}

export interface IActiveCouponDB {
  type: string,
  value: number,
  id: number,
  price: number,
  applied_at: Date
}

export interface IApplyCouponIDProps extends IApplyCouponProps {
  id: number,
}

interface IApplyCouponRepository {
  applyCouponFromDB(data: IApplyCouponProps): Promise<IApplyCouponIDProps>;
  removeCouponFromDB(data: Omit<IApplyCouponProps, 'coupon_id'>): Promise<boolean>;
  getActiveCouponApplication(product_id: number): Promise<IActiveCouponDB>;
  increaseCouponApplication(couponId: number): Promise<void>;
}

export default IApplyCouponRepository;