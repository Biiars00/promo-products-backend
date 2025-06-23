import { inject, injectable } from 'tsyringe';
import ITimeService from '../../interfaces/services/time/time.interface';
import { ErrorMiddleware } from '../../middlewares/error.middleware';
import ICouponsRepository from '../../interfaces/repositories/coupons/coupons.interface';
import ICouponsService, { ICouponProps, ICouponUpdateProps } from '../../interfaces/services/coupons/coupons.interface';
import IValidateStringRegexService from '../../interfaces/services/validateStringRegex/validateStringRegex.interface';
import ICheckCouponValidityService from '../../interfaces/services/coupons/checkCouponValidity.interface';

@injectable()
export class CouponsService implements ICouponsService {
  constructor(
    @inject('CouponsRepository')
    private couponsRepository: ICouponsRepository,
    @inject('TimeService')
    private timeService: ITimeService,
    @inject('ValidateStringRegexService')
    private validateStringRegexService: IValidateStringRegexService,
    @inject('CheckCouponValidityService')
    private checkCouponValidityService: ICheckCouponValidityService,
  ) {}

  async addCoupons(data: ICouponProps): Promise<string> {
    const createdAt = new Date();
    const validFrom = new Date(data.validFrom);
    const validUntil = new Date(data.validUntil);

    const regex = /^[a-z0-9]+$/;
    const normalizedCode = this.validateStringRegexService.validadeStringRegex(data.code, regex, 4, 20).toLowerCase()
  
    const existingProduct = await this.couponsRepository.checkCodeExistsOnDB(normalizedCode);

    if (existingProduct) {
      throw new ErrorMiddleware(409, 'Code name already exists');
    }

    await this.checkCouponValidityService.checkCouponValidity({
      currentDate: createdAt,
      validFrom: validFrom,
      validUntil: validUntil,
    });

    const responseDB = await this.couponsRepository.addCouponsFromDB({
      code: normalizedCode,
      type: data.type,
      value: Number(data.value),
      one_shot: data.oneShot,
      valid_from: validFrom,
      valid_until: validUntil,
      created_at: createdAt,
    });

    return responseDB;
  }

  async getCoupons(): Promise<ICouponProps[]> {
    const responseDB = await this.couponsRepository.getCouponsFromDB();

    const couponList = responseDB.map((coupon) => {
      const validFrom = this.timeService.dateFormatted(coupon.valid_from);
      const validUntil = this.timeService.dateFormatted(coupon.valid_until);
      const createdAt = this.timeService.dateFormatted(coupon.created_at!);
      
      const updatedAt = coupon.updated_at
        ? this.timeService.dateFormatted(coupon.updated_at)
        : null;

      const deletedAt = coupon.deleted_at
        ? this.timeService.dateFormatted(coupon.deleted_at)
        : null;

      let formatValue: string;
      if (coupon.type === 'percent') {
        formatValue = `${Math.floor(coupon.value).toString()}%`;
      } else {
        formatValue = `R$ ${coupon.value.toString()}`
      }

      return {
            code: coupon.code,
            type: coupon.type,
            value: formatValue,
            oneShot: Boolean(coupon.one_shot),
            validFrom: validFrom,
            validUntil: validUntil,
            createdAt: createdAt,
            updatedAt: updatedAt,
            deletedAt: deletedAt,
        };
    })
    
    return couponList || [];
  }

  async getCouponById(code: string): Promise<ICouponProps> {
    const responseDB = await this.couponsRepository.getCouponByIdFromDB(code);

    let formatValue: string;
    if (responseDB.type === 'percent') {
      formatValue = `${Math.floor(responseDB.value).toString()}%`;
    } else {
      formatValue = `R$ ${responseDB.value.toString()}`
    }

    if (!responseDB) {
      throw new ErrorMiddleware(404, 'Coupon not found');
    }

    const validFrom = this.timeService.dateFormatted(new Date(responseDB.valid_from));
    const validUntil = this.timeService.dateFormatted(new Date(responseDB.valid_until));
    const createdAt = this.timeService.dateFormatted(new Date(responseDB.created_at!));

    const updatedAt = responseDB.updated_at
      ? this.timeService.dateFormatted(responseDB.updated_at)
      : null;

    const deletedAt = responseDB.deleted_at
      ? this.timeService.dateFormatted(responseDB.deleted_at)
      : null;

    return {
      code: responseDB.code,
      type: responseDB.type,
      value: formatValue,
      oneShot: Boolean(responseDB.one_shot),
      validFrom: validFrom,
      validUntil: validUntil,
      createdAt: createdAt,
      updatedAt: updatedAt,
      deletedAt: deletedAt,
    }
  }

  async updateCoupon(code: string, data: ICouponUpdateProps): Promise<string> {
    const updatedAt = new Date();
    const validFrom = new Date(data.validFrom);
    const validUntil = new Date(data.validUntil);

    await this.checkCouponValidityService.checkCouponValidity({
      currentDate: updatedAt,
      validFrom: validFrom,
      validUntil: validUntil,
    });

    const responseDB = await this.couponsRepository.updateCouponFromDB(code, {
      type: data.type,
      value: data.value,
      one_shot: data.oneShot,
      valid_from: validFrom,
      valid_until: validUntil,
      updated_at: updatedAt,
    });

    if (!responseDB) {
      throw new ErrorMiddleware(404, 'Coupon not found');
    }

    return responseDB;
  }

  async inactivateCoupon(code: string): Promise<string> {
    const deletedAt = new Date();
    const responseDB = await this.couponsRepository.inactivateCouponFromDB(code, deletedAt);

    if (!responseDB) {
      throw new ErrorMiddleware(404, 'Coupon not found');
    }

    return responseDB;
  }
}
