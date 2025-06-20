import { inject, injectable } from 'tsyringe';
import {
  Body,
  Delete,
  Get,
  Path,
  Post,
  Route,
  Tags,
  Res,
  TsoaResponse,
  Patch,
} from 'tsoa';
import { ProductsService } from '../../services/products/products.service';
import { ErrorMiddleware } from '../../middlewares/error.middleware';
import { ICheckStockProps, IProductsProps, IProductUpdateProps } from '../../interfaces/repositories/products.interface';
import { IProductsDataProps } from '../../interfaces/services/products.interface';

@injectable()
@Route('products')
@Tags('Produtos')
export class ProductsController {
  constructor(
    @inject('ProductsService')
    private productsService: ProductsService,
  ) {}

  @Post('/')
  async addProducts(
    @Body() body: IProductsProps, 
    @Res() setStatus: TsoaResponse<201, { message: string; location: string }>,
  ): Promise<void> {
    try {
      const { name, description, stock, price } = body;

      if (!name || !description || !stock || !price) {
        throw new ErrorMiddleware(400, 'Missing required data');
      }

      if (typeof stock !== 'number' || typeof price !== 'number') {
        throw new ErrorMiddleware(400, 'Stock and price must be numeric values');
      }

      const response = await this.productsService.addProducts(body);

      if (!response) {
        throw new ErrorMiddleware(500, 'Failed to create product');
      }

      return setStatus(201, {
        message: 'Product created successfully!',
        location: `/api/v1/products/${response}`,
      });
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }

  @Get('/')
  async getProducts(): Promise<IProductsDataProps[]> {
    try {
      const response = await this.productsService.getProducts();

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }

  @Get('/:id')
  async getProductById(@Path() id: number): Promise<IProductsDataProps> {
    try {
      if (!id) {
        throw new ErrorMiddleware(400, 'Missing required data');
      }

      const response = await this.productsService.getProductById(id);

      if (!response) {
        throw new ErrorMiddleware(500, 'Failed to fetch product');
      }

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }

  @Patch('/:id')
  async updateProduct(@Path() id: number, @Body() body: IProductUpdateProps): Promise<IProductUpdateProps> {
    try {
      const { stock, price } = body;

      if (!id || !stock || !price) {
        throw new ErrorMiddleware(400, 'Missing required data');
      }

      const response = await this.productsService.updateProduct(id, body);

      if (!response) {
        throw new ErrorMiddleware(500, 'Failed to fetch product');
      }
      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }

  @Delete('/:id')
  async inactivateProduct(@Path() id: number, @Body() body: ICheckStockProps): Promise<boolean> {
    try {
      if (!id) {
        throw new ErrorMiddleware(400, 'Missing required data');
      }

      const response = await this.productsService.inactivateProduct(id, body);

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }

  @Post('/:id/restore')
  async reactivateProduct(@Path() id: number, @Body() body: ICheckStockProps): Promise<boolean> {
    try {
      if (!id) {
        throw new ErrorMiddleware(400, 'Missing required data');
      }

      const response = await this.productsService.reactivateProduct(id, body);

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }
}
