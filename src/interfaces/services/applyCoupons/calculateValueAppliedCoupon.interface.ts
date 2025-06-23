export interface ICalculateApplyCouponProps {
    finalPrice: number,
    discount: {
        type: string,
        value: number,
        appliedAt: string,
    },
}

interface ICalculateValueAppliedCouponService {
  calculateValueAppliedCoupon(
        productId: number, 
    ): Promise<ICalculateApplyCouponProps | null>;
}

export default ICalculateValueAppliedCouponService;