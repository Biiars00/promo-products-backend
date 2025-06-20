import { container } from 'tsyringe';
import { ProductsController } from '../../controllers/products/products.controller';
import { ProductsRepository } from '../../repositories/products/products.repository';
import { ProductsService } from '../../services/products/products.service';

container.register('ProductsController', {
  useClass: ProductsController,
});
container.register('ProductsRepository', {
  useClass: ProductsRepository,
});
container.register('ProductsService', {
  useClass: ProductsService,
});

export { container as products };
