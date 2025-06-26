import { inject, injectable } from 'tsyringe';
import IProductsService, { ICheckStockProps, IPaginatedProducts, IProductsDataProps, IProductsProps, IProductUpdateProps } from '../../interfaces/services/products/products.interface';
import ITimeService from '../../interfaces/services/time/time.interface';
import { ErrorMiddleware } from '../../middlewares/error.middleware';
import IValidateStringRegexService from '../../interfaces/services/validateStringRegex/validateStringRegex.interface';
import IProductsRepository, { IProductQuery } from '../../interfaces/repositories/products/products.interface';
import ICalculateValueAppliedCouponService from '../../interfaces/services/applyCoupons/calculateValueAppliedCoupon.interface';

@injectable()
export class ProductsService implements IProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('TimeService')
    private timeService: ITimeService,
    @inject('ValidateStringRegexService')
    private validateStringRegexService: IValidateStringRegexService,
    @inject('CalculateValueAppliedCouponService')
    private calculateValueAppliedCouponService: ICalculateValueAppliedCouponService,
  ) {}

  async addProducts(data: IProductsProps): Promise<number> {
    const regex = /^[\p{L}0-9\s\-_,.]+$/u;
    const validateName = this.validateStringRegexService.validadeStringRegex(data.name, regex, 3, 100)

    if (data.description?.length && data.description.length >= 300) {
      throw new ErrorMiddleware(400, 'Description must have a maximum of 300 characters');
    }

    if (data.stock < 0 && data.stock > 999999) {
      throw new ErrorMiddleware(400, 'Stock must be greater than or equal to 0 and less than or equal to 999999.');
    }

    if (data.price < 0.01 && data.price > 1000000.00) {
      throw new ErrorMiddleware(422, 'Unprocessable Entity. Price must be between 0.01 and 1000000.00.');
    }

    const existingProduct = await this.productsRepository.checkNameProductExistsOnDB(validateName);
    
    if (existingProduct) {
      throw new ErrorMiddleware(409, 'Product name already exists');
    }
    
    const createdAt = new Date();
    
    const responseDB = await this.productsRepository.addProductsFromDB(
      {
        ...data,
        name: validateName,
      },
      createdAt,
    );

    return responseDB;
  }

  async getProducts(query: IProductQuery): Promise<IPaginatedProducts> {
    const responseDB = await this.productsRepository.getProductsFromDB(query);
    
    const productList = await Promise.all(
      responseDB.data.map(async (product) => {
        const appliedCouponCalculation = await this.calculateValueAppliedCouponService.calculateValueAppliedCoupon(product.id);
        
        const createdAt = this.timeService.dateFormatted(new Date(product.created_at));

        const updatedAt = product.updated_at 
          ? this.timeService.dateFormatted(new Date(product.updated_at)) 
          : null;

        let stockProduct;
        if (product.stock === 0) {
          stockProduct = await this.productsRepository.inactivateProductFromDB(product.id, { is_out_of_stock: true })
        } else {
          stockProduct = await this.productsRepository.reactivateProductFromDB(product.id, { is_out_of_stock: false })
        }

        return {
          id: product.id,
          name: product.name, 
          description: product.description,
          stock: product.stock,
          price: product.price,
          createdAt: createdAt,
          updatedAt: updatedAt,
          isOutOfStock: stockProduct,
          activeCoupon: appliedCouponCalculation
            ? {
                finalPrice: appliedCouponCalculation.finalPrice,
                discount: {
                  type: appliedCouponCalculation.discount.type,
                  value: appliedCouponCalculation.discount.value,
                  appliedAt: appliedCouponCalculation.discount.appliedAt,
                },
              }
            : null,
        };
      })
    ) 
    
    return {
      data: productList,
      meta: {
        page: responseDB.meta.page,
        limit: responseDB.meta.limit,
        totalItems: responseDB.meta.totalItems,
        totalPages: responseDB.meta.totalPages,
      },
    };
  }

  async getProductById(id: number): Promise<IProductsDataProps> {
    const responseDB = await this.productsRepository.getProductByIdFromDB(id);

    const appliedCouponCalculation = await this.calculateValueAppliedCouponService.calculateValueAppliedCoupon(responseDB.id);
    
    const createdAt = this.timeService.dateFormatted(new Date(responseDB.created_at));
    const updatedAt = responseDB.updated_at 
      ? this.timeService.dateFormatted(new Date(responseDB.updated_at))
      : null;

    return {
      id: responseDB.id, 
      name: responseDB.name, 
      description: responseDB.description, 
      price: responseDB.price,
      stock: responseDB.stock,
      createdAt: createdAt,
      updatedAt: updatedAt,
      isOutOfStock: Boolean(responseDB.is_out_of_stock),
      activeCoupon: appliedCouponCalculation
        ? {
            finalPrice: appliedCouponCalculation.finalPrice,
            discount: {
              type: appliedCouponCalculation.discount.type,
              value: appliedCouponCalculation.discount.value,
              appliedAt: appliedCouponCalculation.discount.appliedAt,
            },
          }
        : null,
    };
  }

  async updateProduct(id: number, data: IProductUpdateProps): Promise<IProductUpdateProps> {
    const currentUpdateDate = new Date();
    const currentFormattedUpdateDate = this.timeService.dateFormatted(currentUpdateDate)

    const responseDB = await this.productsRepository.updateProductFromDB(id, {
      ...data,
      updated_at: currentUpdateDate,
    });

    return {
      stock: responseDB.stock,
      price: responseDB.price,
      updatedAt: currentFormattedUpdateDate,
    };
  }

  async inactivateProduct(id: number, data: ICheckStockProps): Promise<boolean> {
    const responseDB = await this.productsRepository.inactivateProductFromDB(id, {
      is_out_of_stock: data.isOutOfStock,
    });

    return responseDB;
  }

  async reactivateProduct(id: number, data: ICheckStockProps): Promise<boolean> {
    const responseDB = await this.productsRepository.reactivateProductFromDB(id, {
      is_out_of_stock: data.isOutOfStock,
    });

    return responseDB;
  }
}
