import { inject, injectable } from 'tsyringe';
import { ErrorMiddleware } from '../../middlewares/error.middleware';
import IApplyCouponService from '../../interfaces/services/applyCoupons/applyCoupon.interface';
import IApplyCouponRepository from '../../interfaces/repositories/applyCoupons/applyCoupon.interface';

@injectable()
export class ApplyCouponService implements IApplyCouponService {
  constructor(
    @inject('ApplyCouponRepository')
    private applyCouponRepository: IApplyCouponRepository,
  ) {}
  
  async applyCoupon(productId: number, couponId: number): Promise<string> {
    const appliedAt = new Date();

    await this.applyCouponRepository.applyCouponFromDB({
      product_id: productId,
      coupon_id: couponId,
      applied_at: appliedAt,
    });

    return 'Coupon applied successfully';
  }

  async removeCoupon(productId: number): Promise<string> {
    const removedAt = new Date();

    const responseDB = await this.applyCouponRepository.removeCouponFromDB({
      product_id: productId,
      removed_at: removedAt,
    });

    if (!responseDB) {
      throw new ErrorMiddleware(404, 'Coupon not found');
    }

    return 'Coupon removed successfully!';
  }
}
