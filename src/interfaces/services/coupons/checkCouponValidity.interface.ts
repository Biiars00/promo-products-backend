export interface IValidateCuponProps {
    currentDate: Date;
    validFrom: Date;
    validUntil: Date;
}

interface ICheckCouponValidityService {
  checkCouponValidity(data: IValidateCuponProps): Promise<void>;
}

export default ICheckCouponValidityService;
