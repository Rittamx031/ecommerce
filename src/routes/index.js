'use strict';
const express = require('express');
const { apikey,permission } = require('../auth/checkAuth');
const route = express.Router();
// check api key
route.use(apikey)
route.use(permission('0000'))

route.use("/v1/api", require('./access'))
// authentication 

// 
// check permission 

module.exports = route