'use strict';
const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const route = express.Router();

// const
//signUp
route.post('/shop/signup', asyncHandler(accessController.signUp));
route.post('/shop/login', asyncHandler(accessController.login));
// authentication
route.use(authentication)
route.post('/shop/logout', asyncHandler(accessController.logout));

module.exports = route