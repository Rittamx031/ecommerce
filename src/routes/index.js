'use strict';
const express = require('express');
const { apikey,permission } = require('../auth/checkAuth');
const route = express.Router();
// check api key
route.use(apikey)
route.use(permission('0000'))

route.use("/v1/api", require('./access'))
route.use("/v1/api/product", require('./product'))
// authentication 

// 
// check permission 

module.exports = route