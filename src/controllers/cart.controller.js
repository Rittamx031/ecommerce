'use strict';

const CartService = require("../services/cart.service");
const { CREATE,SuccessResponse } = require('../core/success.response');

class CartController{
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success add Product To Cart V2 ',
            metadata: await CartService.addToCart({...req.body})
        }).send(res);
    };
    update= async (req, res, next) => {
        new SuccessResponse({
            message: 'Success update Product ',
            metadata: await CartService.addToCartV2({...req.body})
        }).send(res);
    };

    deleteProductInCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success Delete Product In Cart Product',
            metadata: await CartService.DeleteProductInCart({...req.body})
        }).send(res);
    };

    list = async (req, res,next) => {
        new SuccessResponse({
            message: 'Success Get Cart In Cart Product',
            metadata: await CartService.getListUserCart({...req.query})
        }).send(res);
    };
}

module.exports = new CartController();