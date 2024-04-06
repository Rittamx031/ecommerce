'use strict';
const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const route = express.Router();

// const
//signUp
route.post('/shop/signup', asyncHandler(accessController.signUp));
route.post('/shop/login', asyncHandler(accessController.login));

module.exports = route