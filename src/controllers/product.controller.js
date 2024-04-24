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

    publicProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success Public Product',
            metadata: await ProductServiceV2.publicProductByShop(
                 {  product_id: req.params.id,
                    product_shop: req.user.userId
                })
        }).send(res);
    };

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success find Products Public ',
            metadata: await ProductServiceV2.findAllProducts(req.query)
        }).send(res);
    };
    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success find Product by id ',
            metadata: await ProductServiceV2.findProduct({
                product_id: req.params.id})
        }).send(res);
    };
    unPublicProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success unPublic Product',
            metadata: await ProductServiceV2.unPublicProductByShop(
                 {  product_id: req.params.id,
                    product_shop: req.user.userId
                })
        }).send(res);
    };
    //Query//

    
    getListSeacrhProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success Public Product',
            metadata: await ProductServiceV2.seacrhProduct(
                 {key_search: req.params.key_search
                })
        }).send(res);
    };
    /**
     * @desc Get Draft products
     * @param {number}
     * 
     * @param {*} req 
     * @return {JSON} 
     */
    getAllDraftForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list of all draft products for you',
            metadata: await ProductServiceV2.findAllDraftForShop(
                 {...req.body,
                    product_shop: req.user.userId
                })
        }).send(res);
    }

    getAllPublicForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list of all draft products for you',
            metadata: await ProductServiceV2.findAllPublicForShop({
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }
    //End Query//
}

module.exports = new ProductController();