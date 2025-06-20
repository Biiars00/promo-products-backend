import { inject, injectable } from 'tsyringe';
import IProductsService, { IProductsDataProps } from '../../interfaces/services/products.interface';
import IProductsRepository, { ICheckStockProps, IProductsProps, IProductUpdateProps } from '../../interfaces/repositories/products.interface';
import ITimeService from '../../interfaces/services/time.interface';
import { ErrorMiddleware } from '../../middlewares/error.middleware';

@injectable()
export class ProductsService implements IProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('TimeService')
    private timeService: ITimeService,
  ) {}

  async addProducts(data: IProductsProps): Promise<number> {
    const validateName = data.name.trim().replace(/\s+/g, ' ');
    const nameRegex = /^[\p{L}0-9\s\-_,.]+$/u;

    if (validateName.length < 3 || validateName.length > 100) {
      throw new ErrorMiddleware(400, 'Name must be between 3 and 100 characters');
    }

    if (!data.description || data.description.length >= 300) {
      throw new ErrorMiddleware(400, 'Description must have a maximum of 300 characters');
    }

    if (!nameRegex.test(validateName)) {
      throw new ErrorMiddleware(400, 'Name contains invalid characters');
    }

    if (data.stock >= 0 || data.stock <= 999999) {
      throw new ErrorMiddleware(400, 'Stock must be greater than or equal to 0 and less than or equal to 999999.');
    }

    if (data.price >= 0.01 || data.price <= 1000000.00) {
      throw new ErrorMiddleware(400, 'Stock must be greater than or equal to 0 and less than or equal to 999999.');
    }

    const createdAt = new Date();

    const existingProduct = await this.productsRepository.checkNameProductExistsOnDB(validateName);

    if (existingProduct) {
      throw new ErrorMiddleware(409, 'Product name already exists');
    }

    const responseDB = await this.productsRepository.addProductsFromDB(
      {
        ...data,
        name: validateName,
      },
      createdAt,
    );

    return responseDB;
  }

  async getProducts(): Promise<IProductsDataProps[]> {
    const responseDB = await this.productsRepository.getProductsFromDB();

    const productList = responseDB.map((product) => {
      const createdAt = this.timeService.dateFormatted(new Date(product.created_at));
      const updatedAt = this.timeService.dateFormatted(new Date(product.updated_at));

      return {
        ...product,
        created_at: createdAt,
        updated_at: updatedAt,
        is_out_of_stock: Boolean(product.is_out_of_stock)
      };
    })
    
    return productList;
  }

  async getProductById(id: number): Promise<IProductsDataProps> {
    const responseDB = await this.productsRepository.getProductByIdFromDB(id);
    
    const createdAt = this.timeService.dateFormatted(new Date(responseDB.created_at));
    const updatedAt = this.timeService.dateFormatted(new Date(responseDB.updated_at));

    return {
      ...responseDB, 
      created_at: createdAt, 
      updated_at: updatedAt, 
      is_out_of_stock: Boolean(responseDB.is_out_of_stock) 
    };
  }

  async updateProduct(id: number, data: IProductUpdateProps): Promise<IProductUpdateProps> {
    const updatedAt = new Date();

    const responseDB = await this.productsRepository.updateProductFromDB(id, data, updatedAt);

    return responseDB;
  }

  async inactivateProduct(id: number, data: ICheckStockProps): Promise<boolean> {
    const responseDB = await this.productsRepository.inactivateProductFromDB(id, data);

    return responseDB;
  }

  async reactivateProduct(id: number, data: ICheckStockProps): Promise<boolean> {
    const responseDB = await this.productsRepository.reactivateProductFromDB(id, data);

    return responseDB;
  }
}
