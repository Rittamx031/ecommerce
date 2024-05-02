'use strict';
const discountService = require('../services/discount.service');
const { CREATE,SuccessResponse } = require('../core/success.response');

class DiscountController{
    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success Created Discount Code',
            metadata: await discountService.createDiscountCode({
                ...req.body,
                    shopId: req.user.userId
                })
        }).send(res);
    };
    getDiscountCodes = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success Codes fount',
            metadata: await discountService.getAllDiscountCodesByShop({
                ...req.query,
                    shopId: req.user.userId
                })
        }).send(res);
    };

    getDiscountAmout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success Get Discout Amont',
            metadata: await discountService.getDiscountAmount({
                ...req.body
            })
        }).send(res);
    };

    deleteDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success delete discout code',
            metadata: await discountService.deleteDiscountCode({
                ...req.body,
                    shopId: req.user.userId
                })
        }).send(res);
    };

    cancelDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success cancel discount code',
            metadata: await discountService.cancelDiscountCode({
                ...req.body,
                    shopId: req.user.userId
                })
        }).send(res);
    };

    getAllDiscountCodesWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success get codes for product',
            metadata: await discountService.getAllDiscountCodesWithProduct({
                ...req.query
                })
        }).send(res);
    };
}

module.exports = new DiscountController();