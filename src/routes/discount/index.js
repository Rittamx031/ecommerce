'use strict';
const express = require('express');
const discountController = require('../../controllers/discount.controller');
const { authenticationv2 } = require('../../auth/authUtils');
const { asyncHandler } = require('../../helpers/asyncHandler');
const route = express.Router();
// users get amount discount 
route.post('/amount',asyncHandler(discountController.getDiscountAmout))
route.get('/list_product_codes',asyncHandler(discountController.getAllDiscountCodesWithProduct))
route.use(authenticationv2)
route.get('/',asyncHandler(discountController.getDiscountCodes))
route.post('/', asyncHandler(discountController.createDiscountCode));

module.exports = route