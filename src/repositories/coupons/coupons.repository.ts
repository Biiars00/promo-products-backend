import { injectable } from 'tsyringe';
import { connection } from '../../database/databaseConnection';
import { ResultSetHeader } from 'mysql2';
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

    const [rows] = await connection.execute(
      `INSERT INTO coupons (code, type, value, one_shot, valid_from, valid_until, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [code, type, value, one_shot, valid_from, valid_until, created_at],
    ); rows as ICouponDBProps[];

    return 'Coupon created successfully';
  }

  async checkCodeExistsOnDB(code: string): Promise<boolean> {
    const [checkCode] = await connection.execute('SELECT code FROM coupons WHERE code = ?', [
      code,
    ]);

    return Array.isArray(checkCode) && checkCode.length > 0;
  }

  async getCouponsFromDB(): Promise<ICouponDBProps[]> {
    const [rows] = await connection.execute('SELECT * FROM coupons');

    const couponList = (rows as ICouponDBProps[]);

    return couponList || [];
  }

  async getCouponByIdFromDB(code: string): Promise<ICouponDBProps> {
    const [rows] = await connection.execute('SELECT * FROM coupons WHERE code = ?', [
      code,
    ]);

    const dataCoupon = (rows as ICouponDBProps[])[0];

    if (!dataCoupon) {
      throw new ErrorMiddleware(404, 'Coupon not found!')
    }

    return dataCoupon;
  }

  async updateCouponFromDB(code: string, data: ICouponUpdateDBProps): Promise<string> {
    const { type, value, one_shot, valid_from, valid_until, updated_at } = data;

    const [result] = await connection.execute<ResultSetHeader>(
        `UPDATE coupons 
        SET type = ?, value = ?, one_shot = ?, valid_from = ?, valid_until = ?, updated_at = ?
        WHERE code = ?`,
        [type, value, one_shot, valid_from, valid_until, updated_at, code],
    );

    if (result.affectedRows === 0) {
        throw new ErrorMiddleware(404, 'Coupon not found');
    }

    return 'Coupon updated successfully';
  }

  async inactivateCouponFromDB(code: string, date: Date): Promise<string> {
    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE coupons 
      SET deleted_at  = ? 
      WHERE code = ?`,
      [date, code],
    );

    if (result.affectedRows === 0) {
      throw new ErrorMiddleware(404, 'Coupon not found!');
    }

    return 'Coupon inactivated successfully';
  }
}
