import { container } from 'tsyringe';

import { CheckCouponValidityService } from '../../services/coupons/checkCouponValidity.service';

container.register('CheckCouponValidityService', {
  useClass: CheckCouponValidityService,
});

export { container as checkCouponValidity };
