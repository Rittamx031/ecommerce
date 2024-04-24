'use strict';
const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.service.levelxx')

const { CREATE,SuccessResponse } = require('../core/success.response');

class ProductController{
    createProduct = async (req, res, next) => {
        console.log(req.body);
        // new SuccessResponse({
        //     message: 'Success Created Product',
        //     metadata: await ProductService.createProduct(req.body.product_type,
        //          {...req.body,
        //             product_shop: req.user.userId
        //         })
        // }).send(res);

        new SuccessResponse({
            message: 'Success Created Product',
            metadata: await ProductServiceV2.createProduct(req.body.product_type,
                 {...req.body,
                    product_shop: req.user.userId
                })
        }).send(res);

    };
}

module.exports = new ProductController();