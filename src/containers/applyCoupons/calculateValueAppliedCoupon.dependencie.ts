import { container } from 'tsyringe';

import { CalculateValueAppliedCouponService } from '../../services/applyCoupons/calculateValueAppliedCoupon.service';

container.register('CalculateValueAppliedCouponService', {
  useClass: CalculateValueAppliedCouponService,
});

export { container as calculateValueAppliedCoupon };