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
import { ErrorMiddleware } from '../../middlewares/error.middleware';
import { ApplyCouponService } from '../../services/applyCoupons/applyCoupon.service';

@injectable()
@Route('products')
@Tags('Aplicação de Cupons')
export class ApplyCouponController {
  constructor(
    @inject('ApplyCouponService')
    private applyCouponService: ApplyCouponService,
  ) {}

  @Post('/:productId/discount')
  async applyCoupon(
    @Path() productId: number,
    @Body() body: { couponId: number },
    @Res() setStatus: TsoaResponse<201, { data: string }>
  ): Promise<string> {
    try {
        const { couponId } = body;

        if (!productId || !couponId) {
            throw new ErrorMiddleware(400, 'Missing required data');
        }

        const response = await this.applyCouponService.applyCoupon(productId, couponId);

        if (!response) {
            throw new ErrorMiddleware(500, 'Failed to apply coupon');
        }

        return setStatus(201, {
            data: response,
        });
        } catch (error) {
            throw new Error(`Internal server error - ${error}`);
        }
    }

    @Delete('/:productId/undoDiscount')
    async inactivateCoupon(
        @Path() productId: number,
        @Res() setStatus: TsoaResponse<204, { message: string }>
    ): Promise<string> {
        try {
            if (!productId) {
                throw new ErrorMiddleware(400, 'Missing required data');
            }

            const response = await this.applyCouponService.removeCoupon(productId);

            return setStatus(204, {
                message: response,
            });
        } catch (error) {
            throw new Error(`Internal server error - ${error}`);
        }
    }
}
