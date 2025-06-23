interface IApplyCouponService {
  applyCoupon(productId: number, couponId: number): Promise<string>;
  removeCoupon(productId: number): Promise<string>;
}

export default IApplyCouponService;