import { injectable } from 'tsyringe';
import pool from '../../database/databaseConnection';
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

    const activeCoupon = await pool.query(
      `
      SELECT * 
      FROM product_coupon_applications 
      WHERE product_id = $1
        AND removed_at IS NULL
      `,
      [product_id]
    );

    if (activeCoupon.rows.length > 0) {
      throw new ErrorMiddleware(409, 'There is already an active coupon for this product')
    }

    const insertResult = await pool.query(
      `INSERT INTO product_coupon_applications (product_id, coupon_id, applied_at)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
      [product_id, coupon_id, applied_at],
    ); 

    return insertResult.rows[0] as IApplyCouponIDProps;
  }

  async removeCouponFromDB(data: Omit<IApplyCouponProps, 'coupon_id'>): Promise<boolean> {
    const { product_id, removed_at } = data;

    const result = await pool.query(
      `UPDATE product_coupon_applications 
      SET removed_at = $1 
      WHERE product_id = $2 AND removed_at IS NULL;`,
      [removed_at, product_id],
    );

    const couponRemoved = (result.rowCount ?? 0) > 0;

    return couponRemoved;
  }

  async getActiveCouponApplication(productId: number): Promise<IActiveCouponDB> {
    const product_id = productId;

    const result = await pool.query(
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

    return result.rows[0] || null;
  }

  async increaseCouponApplication(couponId: number): Promise<void> {
    await pool.query(
      `UPDATE coupons SET uses_count = uses_count + 1 WHERE id = $1`,
      [couponId]
    );;
  }
}
