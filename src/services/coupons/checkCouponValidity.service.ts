import { injectable } from 'tsyringe';
import { ErrorMiddleware } from '../../middlewares/error.middleware';
import ICheckCouponValidityService, { IValidateCuponProps } from '../../interfaces/services/coupons/checkCouponValidity.interface';

@injectable()
export class CheckCouponValidityService implements ICheckCouponValidityService  {
    async checkCouponValidity(data: IValidateCuponProps): Promise<void> {
        if (data.currentDate > data.validFrom)  {
            throw new ErrorMiddleware(400, 'The initial expiration date of the coupon must be greater than or equal to the current date.');
        }

        if (data.validFrom >= data.validUntil) {
            throw new ErrorMiddleware(400, 'The coupon end expiration date must be greater than the start date.');
        }

        const maxValidUntil = data.validFrom;
        maxValidUntil.setFullYear(maxValidUntil.getFullYear() + 5);

        if (data.validUntil > maxValidUntil) {
        throw new ErrorMiddleware(400, 'The final validity of the coupon cannot exceed 5 years from the initial validity.');
        }

        if (data.validUntil < data.currentDate) {
            throw new ErrorMiddleware(400, 'The coupon is expired.');
        }
    }
}
