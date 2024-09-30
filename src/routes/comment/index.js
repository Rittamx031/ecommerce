'use strict';
const express = require('express');
const commentController = require('../../controllers/comment.controller');
const { authenticationv2 } = require('../../auth/authUtils');
const { asyncHandler } = require('../../helpers/asyncHandler');
const route = express.Router();
// users get amount discount 
route.use(authenticationv2)

route.post('/', asyncHandler(commentController.createComment));

module.exports = route