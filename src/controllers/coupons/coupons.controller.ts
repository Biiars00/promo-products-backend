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
import { CouponsService } from '../../services/coupons/coupons.service';
import { ICouponProps, ICouponUpdateProps } from '../../interfaces/services/coupons/coupons.interface';

@injectable()
@Route('coupons')
@Tags('Cupons')
export class CouponsController {
  constructor(
    @inject('CouponsService')
    private couponsService: CouponsService,
  ) {}

  @Post('/')
  async addCoupons(
    @Body() body: ICouponProps,
    @Res() setStatus: TsoaResponse<201, { message: string }>
  ): Promise<string> {
    try {
      const { code, type, value, oneShot, validFrom, validUntil } = body;
      const valueNumber = Number(value);

        if (!code || !type || !valueNumber || !validFrom || !validUntil) {
            throw new ErrorMiddleware(400, 'Missing required data');
        }

        if (type !== 'percent' && type !== 'fixed') {
            throw new ErrorMiddleware(400, 'Type must be "percent" or "fixed"');
        }

        if (type === 'percent') {
            if (valueNumber < 1 || valueNumber > 80) {
                throw new ErrorMiddleware(400, 'Percent discount must be between 1 and 80' );
            }
        } else {
            if (valueNumber < 0) {
                throw new ErrorMiddleware(400, 'Fixed discount must be between 1 and 1000');
            }
        }

        const response = await this.couponsService.addCoupons(body);

        if (!response) {
            throw new ErrorMiddleware(500, 'Failed to create coupon');
        }

        return setStatus(201, {
            message: response,
        });
        } catch (error) {
        throw new Error(`Internal server error - ${error}`);
        }
    }

    @Get('/')
    async getCoupons(
        @Res() setStatus: TsoaResponse<200, ICouponProps[]>
    ): Promise<{ message: string; data: ICouponProps[] }> {
        try {
            const response = await this.couponsService.getCoupons();

            return setStatus(200, response );
        } catch (error) {
            throw new Error(`Internal server error - ${error}`);
        }
    }

    @Get('/:code')
    async getCouponById(
        @Path() code: string,
        @Res() setStatus: TsoaResponse<200, ICouponProps >
    ): Promise<ICouponProps> {
        try {
            if (!code) {
                throw new ErrorMiddleware(400, 'Missing required data');
            }

            const response = await this.couponsService.getCouponById(code);

            if (!response) {
                throw new ErrorMiddleware(500, 'Failed to fetch coupon');
            }

            return setStatus(200, response );
        } catch (error) {
            throw new Error(`Internal server error - ${error}`);
        }
    }

    @Patch('/:code')
    async updateCoupon(
        @Path() code: string, @Body() body: ICouponUpdateProps,
        @Res() setStatus: TsoaResponse<200, { message: string }>
    ): Promise<any> {
        try {
            const { type, value, oneShot, validFrom, validUntil } = body;

            if (!type || !value || !oneShot || !validFrom || !validUntil) {
                throw new ErrorMiddleware(400, 'Missing required data');
            }

            const response = await this.couponsService.updateCoupon(code, body);

            if (!response) {
                throw new ErrorMiddleware(500, 'Failed to fetch coupon');
            }
            
            return setStatus(200, {
                message: response });
        } catch (error) {
            throw new Error(`Internal server error - ${error}`);
        }
    }

    @Delete('/:code')
    async inactivateCoupon(
        @Path() code: string,
        @Res() setStatus: TsoaResponse<204, { message: string }>
    ): Promise<string> {
        try {
            if (!code) {
                throw new ErrorMiddleware(400, 'Missing required data');
            }

            const response = await this.couponsService.inactivateCoupon(code);

            return setStatus(204, {
                message: response,
            });
        } catch (error) {
            throw new Error(`Internal server error - ${error}`);
        }
    }
}
