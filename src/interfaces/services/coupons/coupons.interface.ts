export interface ICouponProps {
  code: string,
  type: 'percent' | 'fixed',
  value: number,
  oneShot: boolean | null,
  validFrom: string,
  validUntil: string,
  createdAt?: string,
  updatedAt?: string | null,
  deleted_at?: string | null,
}

export interface ICouponUpdateProps {
  type: 'percent' | 'fixed',
  value: number,
  oneShot: boolean | null,
  validFrom: string,
  validUntil: string
  updatedAt?: string | null
}

interface ICouponsService {
  addCoupons(data: ICouponProps): Promise<string>;
  getCoupons(): Promise<ICouponProps[]>;
  getCouponById(code: string): Promise<ICouponProps>;
  updateCoupon(code: string, data: ICouponUpdateProps): Promise<string>;
  inactivateCoupon(code: string): Promise<string>;
}

export default ICouponsService;
