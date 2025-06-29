import { injectable } from 'tsyringe';
import pool from '../../database/databaseConnection';
import { ErrorMiddleware } from '../../middlewares/error.middleware';
import ICouponsRepository, { ICouponDBProps, ICouponUpdateDBProps } from '../../interfaces/repositories/coupons/coupons.interface';

@injectable()
export class CouponsRepository implements ICouponsRepository {
  private database = process.env.DB_DATABASE;

  constructor() {
    this.database
  }

  async addCouponsFromDB(data: ICouponDBProps): Promise<string> {
    const { code, type, value, one_shot, valid_from, valid_until, created_at } = data;

    const result = await pool.query(
      `INSERT INTO coupons (code, type, value, one_shot, valid_from, valid_until, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [code, type, value, one_shot, valid_from, valid_until, created_at],
    ); result.rows as ICouponDBProps[];

    return 'Coupon created successfully';
  }

  async checkCodeExistsOnDB(code: string): Promise<boolean> {
    const checkCode = await pool.query('SELECT code FROM coupons WHERE code = $1', [
      code,
    ]);

    return checkCode.rows.length > 0;
  }

  async getCouponsFromDB(): Promise<ICouponDBProps[]> {
    const result = await pool.query('SELECT * FROM coupons');

    const couponList = result.rows as ICouponDBProps[];

    return couponList || [];
  }

  async getCouponByIdFromDB(code: string): Promise<ICouponDBProps> {
    const result = await pool.query('SELECT * FROM coupons WHERE code = $1', [
      code,
    ]);

    if (!result) {
      throw new ErrorMiddleware(404, 'Coupon not found!')
    }

    return result.rows[0] as ICouponDBProps;
  }

  async updateCouponFromDB(code: string, data: ICouponUpdateDBProps): Promise<string> {
    const { type, value, one_shot, valid_from, valid_until, updated_at } = data;

    const result = await pool.query(
        `UPDATE coupons 
        SET type = $1, value = $2, one_shot = $3, valid_from = $4, valid_until = $5, updated_at = $6
        WHERE code = $7`,
        [type, value, one_shot, valid_from, valid_until, updated_at, code],
    );

    if (result.rowCount === 0) {
        throw new ErrorMiddleware(404, 'Coupon not found');
    }

    return 'Coupon updated successfully';
  }

  async inactivateCouponFromDB(code: string, date: Date): Promise<string> {
    const result = await pool.query(
      `UPDATE coupons 
      SET deleted_at  = $1 
      WHERE code = $2`,
      [date, code],
    );

    if (result.rowCount === 0) {
      throw new ErrorMiddleware(404, 'Coupon not found!');
    }

    return 'Coupon inactivated successfully';
  }
}
