'use strict';

const CheckoutService = require('../services/checkout.service');
const { SuccessResponse } = require('../core/success.response')


class CheckoutController{
    getCheckoutList = async (req,res,next) =>{
        new SuccessResponse({
            message: 'get Checkout List Successfully',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res);
    }
}



module.exports = new CheckoutController();