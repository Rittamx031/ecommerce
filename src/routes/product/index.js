'use strict';
const express = require('express');
const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationv2 } = require('../../auth/authUtils');
const route = express.Router();
// no authentication
route.post('/search/:key_search', asyncHandler(productController.getListSeacrhProduct));
route.get('', asyncHandler(productController.findAllProducts));
route.get('/:id', asyncHandler(productController.findProduct));
// authentication
route.use(authenticationv2)
route.post('', asyncHandler(productController.createProduct));
route.patch('', asyncHandler(productController.updateProduct));
route.post('/public/:id', asyncHandler(productController.publicProduct));
route.post('/unpublic/:id', asyncHandler(productController.unPublicProduct));

//Query//
route.post('/drafts/all', asyncHandler(productController.getAllDraftForShop));
route.post('/publiced/all', asyncHandler(productController.getAllPublicForShop));
//End Query//
module.exports = route