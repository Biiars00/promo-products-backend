export interface ICouponDBProps {
  code: string,
  type: 'percent' | 'fixed',
  value: number,
  one_shot: boolean | null,
  valid_from: Date,
  valid_until: Date,
  created_at?: Date,
  updated_at?: Date | null
  deleted_at?: Date | null
}

export interface ICouponUpdateDBProps {
  type: 'percent' | 'fixed',
  value: number,
  one_shot: boolean | null,
  valid_from: Date,
  valid_until: Date,
  updated_at?: Date | null
}

interface ICouponsRepository {
  addCouponsFromDB(data: ICouponDBProps): Promise<string>;
  checkCodeExistsOnDB(code: string): Promise<boolean>;
  getCouponsFromDB(): Promise<ICouponDBProps[]>;
  getCouponByIdFromDB(code: string): Promise<ICouponDBProps>;
  updateCouponFromDB(code: string, data: ICouponUpdateDBProps): Promise<string>;
  inactivateCouponFromDB(code: string,  date: Date): Promise<string>;
}

export default ICouponsRepository;
