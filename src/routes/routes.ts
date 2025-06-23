/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import 'reflect-metadata';
import { container } from 'tsyringe';
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ProductsController } from './../controllers/products/products.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CouponsController } from './../controllers/coupons/coupons.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ApplyCouponController } from './../controllers/applyCoupon/applyCoupons.controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "IProductsProps": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "stock": {"dataType":"double","required":true},
            "price": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICalculateApplyCouponProps": {
        "dataType": "refObject",
        "properties": {
            "finalPrice": {"dataType":"double","required":true},
            "discount": {"dataType":"nestedObjectLiteral","nestedProperties":{"appliedAt":{"dataType":"string","required":true},"value":{"dataType":"double","required":true},"type":{"dataType":"string","required":true}},"required":true},
            "hasCouponApplied": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IProductsDataProps": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "stock": {"dataType":"double","required":true},
            "price": {"dataType":"double","required":true},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "isOutOfStock": {"dataType":"boolean","required":true},
            "activeCoupon": {"dataType":"union","subSchemas":[{"ref":"ICalculateApplyCouponProps"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPaginatedProducts": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"IProductsDataProps"},"required":true},
            "meta": {"dataType":"nestedObjectLiteral","nestedProperties":{"totalPages":{"dataType":"double","required":true},"totalItems":{"dataType":"double","required":true},"limit":{"dataType":"double","required":true},"page":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IProductUpdateProps": {
        "dataType": "refObject",
        "properties": {
            "stock": {"dataType":"double"},
            "price": {"dataType":"double"},
            "updatedAt": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICheckStockProps": {
        "dataType": "refObject",
        "properties": {
            "isOutOfStock": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICouponProps": {
        "dataType": "refObject",
        "properties": {
            "code": {"dataType":"string","required":true},
            "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["percent"]},{"dataType":"enum","enums":["fixed"]}],"required":true},
            "value": {"dataType":"double","required":true},
            "oneShot": {"dataType":"union","subSchemas":[{"dataType":"boolean"},{"dataType":"enum","enums":[null]}],"required":true},
            "validFrom": {"dataType":"string","required":true},
            "validUntil": {"dataType":"string","required":true},
            "createdAt": {"dataType":"string"},
            "updatedAt": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "deletedAt": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICouponUpdateProps": {
        "dataType": "refObject",
        "properties": {
            "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["percent"]},{"dataType":"enum","enums":["fixed"]}],"required":true},
            "value": {"dataType":"double","required":true},
            "oneShot": {"dataType":"union","subSchemas":[{"dataType":"boolean"},{"dataType":"enum","enums":[null]}],"required":true},
            "validFrom": {"dataType":"string","required":true},
            "validUntil": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsProductsController_addProducts: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"IProductsProps"},
                setStatus: {"in":"res","name":"201","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"location":{"dataType":"string","required":true},"message":{"dataType":"string","required":true}}},
        };
        app.post('/products',
            ...(fetchMiddlewares<RequestHandler>(ProductsController)),
            ...(fetchMiddlewares<RequestHandler>(ProductsController.prototype.addProducts)),

            async function ProductsController_addProducts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductsController_addProducts, request, response });

                const controller = container.resolve(ProductsController);

              await templateService.apiHandler({
                methodName: 'addProducts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductsController_getProducts: Record<string, TsoaRoute.ParameterSchema> = {
                setStatus: {"in":"res","name":"200","required":true,"ref":"IPaginatedProducts"},
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
                search: {"in":"query","name":"search","dataType":"string"},
                minPrice: {"in":"query","name":"minPrice","dataType":"double"},
                maxPrice: {"in":"query","name":"maxPrice","dataType":"double"},
                hasDiscount: {"in":"query","name":"hasDiscount","dataType":"boolean"},
                sortBy: {"in":"query","name":"sortBy","dataType":"union","subSchemas":[{"dataType":"enum","enums":["name"]},{"dataType":"enum","enums":["price"]},{"dataType":"enum","enums":["created_at"]},{"dataType":"enum","enums":["stock"]}]},
                sortOrder: {"in":"query","name":"sortOrder","dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
                includeDeleted: {"in":"query","name":"includeDeleted","dataType":"boolean"},
                onlyOutOfStock: {"in":"query","name":"onlyOutOfStock","dataType":"boolean"},
                withCouponApplied: {"in":"query","name":"withCouponApplied","dataType":"boolean"},
        };
        app.get('/products',
            ...(fetchMiddlewares<RequestHandler>(ProductsController)),
            ...(fetchMiddlewares<RequestHandler>(ProductsController.prototype.getProducts)),

            async function ProductsController_getProducts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductsController_getProducts, request, response });

                const controller = container.resolve(ProductsController);

              await templateService.apiHandler({
                methodName: 'getProducts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductsController_getProductById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                setStatus: {"in":"res","name":"200","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"ref":"IProductsDataProps","required":true}}},
        };
        app.get('/products/:id',
            ...(fetchMiddlewares<RequestHandler>(ProductsController)),
            ...(fetchMiddlewares<RequestHandler>(ProductsController.prototype.getProductById)),

            async function ProductsController_getProductById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductsController_getProductById, request, response });

                const controller = container.resolve(ProductsController);

              await templateService.apiHandler({
                methodName: 'getProductById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductsController_updateProduct: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                body: {"in":"body","name":"body","required":true,"ref":"IProductUpdateProps"},
                setStatus: {"in":"res","name":"200","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"ref":"IProductUpdateProps","required":true}}},
        };
        app.patch('/products/:id',
            ...(fetchMiddlewares<RequestHandler>(ProductsController)),
            ...(fetchMiddlewares<RequestHandler>(ProductsController.prototype.updateProduct)),

            async function ProductsController_updateProduct(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductsController_updateProduct, request, response });

                const controller = container.resolve(ProductsController);

              await templateService.apiHandler({
                methodName: 'updateProduct',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductsController_inactivateProduct: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                body: {"in":"body","name":"body","required":true,"ref":"ICheckStockProps"},
                setStatus: {"in":"res","name":"204","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"boolean","required":true}}},
        };
        app.delete('/products/:id',
            ...(fetchMiddlewares<RequestHandler>(ProductsController)),
            ...(fetchMiddlewares<RequestHandler>(ProductsController.prototype.inactivateProduct)),

            async function ProductsController_inactivateProduct(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductsController_inactivateProduct, request, response });

                const controller = container.resolve(ProductsController);

              await templateService.apiHandler({
                methodName: 'inactivateProduct',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductsController_reactivateProduct: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                body: {"in":"body","name":"body","required":true,"ref":"ICheckStockProps"},
                setStatus: {"in":"res","name":"204","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"boolean","required":true}}},
        };
        app.post('/products/:id/restore',
            ...(fetchMiddlewares<RequestHandler>(ProductsController)),
            ...(fetchMiddlewares<RequestHandler>(ProductsController.prototype.reactivateProduct)),

            async function ProductsController_reactivateProduct(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductsController_reactivateProduct, request, response });

                const controller = container.resolve(ProductsController);

              await templateService.apiHandler({
                methodName: 'reactivateProduct',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCouponsController_addCoupons: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"ICouponProps"},
                setStatus: {"in":"res","name":"201","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"string","required":true}}},
        };
        app.post('/coupons',
            ...(fetchMiddlewares<RequestHandler>(CouponsController)),
            ...(fetchMiddlewares<RequestHandler>(CouponsController.prototype.addCoupons)),

            async function CouponsController_addCoupons(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCouponsController_addCoupons, request, response });

                const controller = container.resolve(CouponsController);

              await templateService.apiHandler({
                methodName: 'addCoupons',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCouponsController_getCoupons: Record<string, TsoaRoute.ParameterSchema> = {
                setStatus: {"in":"res","name":"200","required":true,"dataType":"array","array":{"dataType":"refObject","ref":"ICouponProps"}},
        };
        app.get('/coupons',
            ...(fetchMiddlewares<RequestHandler>(CouponsController)),
            ...(fetchMiddlewares<RequestHandler>(CouponsController.prototype.getCoupons)),

            async function CouponsController_getCoupons(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCouponsController_getCoupons, request, response });

                const controller = container.resolve(CouponsController);

              await templateService.apiHandler({
                methodName: 'getCoupons',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCouponsController_getCouponById: Record<string, TsoaRoute.ParameterSchema> = {
                code: {"in":"path","name":"code","required":true,"dataType":"string"},
                setStatus: {"in":"res","name":"200","required":true,"ref":"ICouponProps"},
        };
        app.get('/coupons/:code',
            ...(fetchMiddlewares<RequestHandler>(CouponsController)),
            ...(fetchMiddlewares<RequestHandler>(CouponsController.prototype.getCouponById)),

            async function CouponsController_getCouponById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCouponsController_getCouponById, request, response });

                const controller = container.resolve(CouponsController);

              await templateService.apiHandler({
                methodName: 'getCouponById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCouponsController_updateCoupon: Record<string, TsoaRoute.ParameterSchema> = {
                code: {"in":"path","name":"code","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"ICouponUpdateProps"},
                setStatus: {"in":"res","name":"200","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"string","required":true}}},
        };
        app.patch('/coupons/:code',
            ...(fetchMiddlewares<RequestHandler>(CouponsController)),
            ...(fetchMiddlewares<RequestHandler>(CouponsController.prototype.updateCoupon)),

            async function CouponsController_updateCoupon(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCouponsController_updateCoupon, request, response });

                const controller = container.resolve(CouponsController);

              await templateService.apiHandler({
                methodName: 'updateCoupon',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCouponsController_inactivateCoupon: Record<string, TsoaRoute.ParameterSchema> = {
                code: {"in":"path","name":"code","required":true,"dataType":"string"},
                setStatus: {"in":"res","name":"204","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"string","required":true}}},
        };
        app.delete('/coupons/:code',
            ...(fetchMiddlewares<RequestHandler>(CouponsController)),
            ...(fetchMiddlewares<RequestHandler>(CouponsController.prototype.inactivateCoupon)),

            async function CouponsController_inactivateCoupon(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCouponsController_inactivateCoupon, request, response });

                const controller = container.resolve(CouponsController);

              await templateService.apiHandler({
                methodName: 'inactivateCoupon',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsApplyCouponController_applyCoupon: Record<string, TsoaRoute.ParameterSchema> = {
                productId: {"in":"path","name":"productId","required":true,"dataType":"double"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"couponId":{"dataType":"double","required":true}}},
                setStatus: {"in":"res","name":"201","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"string","required":true}}},
        };
        app.post('/products/:productId/discount',
            ...(fetchMiddlewares<RequestHandler>(ApplyCouponController)),
            ...(fetchMiddlewares<RequestHandler>(ApplyCouponController.prototype.applyCoupon)),

            async function ApplyCouponController_applyCoupon(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsApplyCouponController_applyCoupon, request, response });

                const controller = container.resolve(ApplyCouponController);

              await templateService.apiHandler({
                methodName: 'applyCoupon',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsApplyCouponController_inactivateCoupon: Record<string, TsoaRoute.ParameterSchema> = {
                productId: {"in":"path","name":"productId","required":true,"dataType":"double"},
                setStatus: {"in":"res","name":"204","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"string","required":true}}},
        };
        app.delete('/products/:productId/undoDiscount',
            ...(fetchMiddlewares<RequestHandler>(ApplyCouponController)),
            ...(fetchMiddlewares<RequestHandler>(ApplyCouponController.prototype.inactivateCoupon)),

            async function ApplyCouponController_inactivateCoupon(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsApplyCouponController_inactivateCoupon, request, response });

                const controller = container.resolve(ApplyCouponController);

              await templateService.apiHandler({
                methodName: 'inactivateCoupon',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
