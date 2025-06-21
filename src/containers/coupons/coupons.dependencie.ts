import { container } from 'tsyringe';

import { CouponsController } from '../../controllers/coupons/coupons.controller';
import { CouponsRepository } from '../../repositories/coupons/coupons.repository';
import { CouponsService } from '../../services/coupons/coupons.service';

container.register('CouponsController', {
  useClass: CouponsController,
});
container.register('CouponsRepository', {
  useClass: CouponsRepository,
});
container.register('CouponsService', {
  useClass: CouponsService,
});

export { container as coupons };
