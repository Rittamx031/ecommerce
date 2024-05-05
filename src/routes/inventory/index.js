'use strict';
const express = require('express');
const inventoryController = require('../../controllers/inventory.controller');
const { authenticationv2 } = require('../../auth/authUtils');
const { asyncHandler } = require('../../helpers/asyncHandler');
const route = express.Router();
// users get amount discount 
route.use(authenticationv2)
route.post('/', asyncHandler(inventoryController.addStock));

module.exports = route