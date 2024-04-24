'use strict';
const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationv2 } = require('../../auth/authUtils');
const route = express.Router();

// const
//signUp
route.post('/shop/signup', asyncHandler(accessController.signUp));
route.post('/shop/login', asyncHandler(accessController.login));

// authentication
route.use(authenticationv2)
route.post('/shop/logout', asyncHandler(accessController.logout));
route.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken));

module.exports = route