import { injectable } from 'tsyringe';
import { connection } from '../../database/databaseConnection';
import { ResultSetHeader } from 'mysql2';
import IApplyCouponRepository, { IActiveCouponDB, IApplyCouponIDProps, IApplyCouponProps } from '../../interfaces/repositories/applyCoupons/applyCoupon.interface';
import { ErrorMiddleware } from '../../middlewares/error.middleware';

@injectable()
export class ApplyCouponRepository implements IApplyCouponRepository {
  private database = process.env.DB_DATABASE;

  constructor() {
    this.database
  }

  async applyCouponFromDB(data: IApplyCouponProps): Promise<IApplyCouponIDProps> {
    const { product_id, coupon_id, applied_at } = data;

    const [activeCoupon] = await connection.execute(
      `
      SELECT * 
      FROM product_coupon_applications 
      WHERE product_id = ?
        AND removed_at IS NULL
      `,
      [product_id]
    );

    if ((activeCoupon as any[]).length > 0) {
      throw new ErrorMiddleware(409, 'There is already an active coupon for this product')
    }

    const [insertResult] = await connection.execute<ResultSetHeader>(
      `INSERT INTO product_coupon_applications (product_id, coupon_id, applied_at)
        VALUES (?, ?, ?)`,
      [product_id, coupon_id, applied_at],
    ); 

    const [rows] = await connection.execute(
      `SELECT * FROM product_coupon_applications WHERE id = ?`,
      [insertResult.insertId]
    );

    return (rows as any[])[0];
  }

  async removeCouponFromDB(data: Omit<IApplyCouponProps, 'coupon_id'>): Promise<boolean> {
    const { product_id, removed_at } = data;

    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE product_coupon_applications 
      SET removed_at = ? 
      WHERE product_id = ? AND removed_at IS NULL;`,
      [removed_at, product_id],
    );

    const couponRemoved = (result as ResultSetHeader).affectedRows > 0;

    return couponRemoved;
  }

  async getActiveCouponApplication(productId: number): Promise<IActiveCouponDB> {
    const product_id = productId;

    const [rows] = await connection.execute(
    `
      SELECT c.type,
             c.value,
             p.id,
             p.price,
             pca.applied_at
      FROM coupons c, 
           products p,
           product_coupon_applications pca
      WHERE 
            p.id = ?
        AND pca.product_id = p.id
        AND pca.coupon_id  = c.id
        AND c.deleted_at IS NULL;
    `, [product_id]
    );

    const result = (rows as IActiveCouponDB[])[0];

    return result || null;
  }

  async increaseCouponApplication(couponId: number): Promise<void> {
    await connection.execute(
      `UPDATE coupons SET uses_count = uses_count + 1 WHERE id = ?`,
      [couponId]
    );;
  }
}
