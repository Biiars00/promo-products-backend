import { applyCoupon } from './applyCoupons/applyCoupons.dependencie';
import { calculateValueAppliedCoupon } from './applyCoupons/calculateValueAppliedCoupon.dependencie';
import { checkCouponValidity } from './coupons/checkCouponValidity.dependencie';
import { coupons } from './coupons/coupons.dependencie';
import { products } from './products/products.dependencie';
import { time } from './time/time.dependencie';
import { validateStringRegex } from './validateStringRegex/validateStringRegex.dependencie';

export { 
    products, 
    time, 
    coupons, 
    validateStringRegex, 
    checkCouponValidity, 
    applyCoupon, 
    calculateValueAppliedCoupon as container 
};
