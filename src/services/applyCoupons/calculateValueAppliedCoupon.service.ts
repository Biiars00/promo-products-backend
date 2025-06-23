import { inject, injectable } from 'tsyringe';
import IApplyCouponRepository from '../../interfaces/repositories/applyCoupons/applyCoupon.interface';
import ICalculateValueAppliedCouponService, { ICalculateApplyCouponProps } from '../../interfaces/services/applyCoupons/calculateValueAppliedCoupon.interface';
import ITimeService from '../../interfaces/services/time/time.interface';
import { ErrorMiddleware } from '../../middlewares/error.middleware';

@injectable()
export class CalculateValueAppliedCouponService implements ICalculateValueAppliedCouponService {
  constructor(
    @inject('ApplyCouponRepository')
    private applyCouponRepository: IApplyCouponRepository,
    @inject('TimeService')
    private timeService: ITimeService,
  ) {}
  
  async calculateValueAppliedCoupon(productId: number): Promise<ICalculateApplyCouponProps | null> {
    const activeCoupon = await this.applyCouponRepository.getActiveCouponApplication(productId);

    if (activeCoupon) {
      const originalPrice = activeCoupon.price;
  
      let discountValue = 0;
  
      if (activeCoupon.type === 'percent') {
        discountValue = (originalPrice * activeCoupon.value) / 100;
      } else if (activeCoupon.type === 'fixed') {
        discountValue = activeCoupon.value;
      }
  
      const calculateFinalPrice = Math.max(originalPrice - discountValue, 0).toFixed(2);
      const finalPrice = Number(calculateFinalPrice)

      if (finalPrice <= 0.1) {
        throw new ErrorMiddleware(400, 'The final value of the product cannot be less than 0.1')
      }
  
      const formattedApplicationDate = this.timeService.dateFormatted(activeCoupon.applied_at);
  
      return {
        finalPrice,
        discount: {
          type: activeCoupon.type,
          value: discountValue,
          appliedAt: formattedApplicationDate,
        },
      };
    } else {
      return null;
    }
  }
}
