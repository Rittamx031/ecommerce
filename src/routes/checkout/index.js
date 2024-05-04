'use strict';
const express = require('express');
const checkoutController = require('../../controllers/checkout.controller');
const { authenticationv2 } = require('../../auth/authUtils');
const { asyncHandler } = require('../../helpers/asyncHandler');
const route = express.Router();
route.post('/review',asyncHandler(checkoutController.getCheckoutList))

module.exports = route