'use strict';
const express = require('express');
const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const route = express.Router();

// authentication
route.use(authentication)
route.post('', asyncHandler(productController.createProduct));

module.exports = route