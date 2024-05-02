'use strict';
const express = require('express');
const cartController = require('../../controllers/cart.controller');
const { authenticationv2 } = require('../../auth/authUtils');
const { asyncHandler } = require('../../helpers/asyncHandler');
const route = express.Router();
// users get amount discount 
route.post('/',asyncHandler(cartController.addToCart))
route.get('/',asyncHandler(cartController.list))
route.post('/update',asyncHandler(cartController.update))
route.delete('/',asyncHandler(cartController.deleteProductInCart))

module.exports = route