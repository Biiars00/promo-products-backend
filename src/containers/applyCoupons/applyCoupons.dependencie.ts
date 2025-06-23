import { container } from 'tsyringe';

import { ApplyCouponController } from '../../controllers/applyCoupon/applyCoupons.controller';
import { ApplyCouponService } from '../../services/applyCoupons/applyCoupon.service';
import { ApplyCouponRepository } from '../../repositories/applyCoupon/applyCoupon.repository';

container.register('ApplyCouponController', {
  useClass: ApplyCouponController,
});
container.register('ApplyCouponService', {
  useClass: ApplyCouponService,
});
container.register('ApplyCouponRepository', {
  useClass: ApplyCouponRepository,
});

export { container as applyCoupon };
