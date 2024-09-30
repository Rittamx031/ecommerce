'use strict';
const express = require('express');
const { apikey,permission } = require('../auth/checkAuth');
const route = express.Router();
// check api key
route.use(apikey)
route.use(permission('0000'))

route.use("/v1/api/product", require('./product'))
route.use("/v1/api/inventory", require('./inventory'))
route.use("/v1/api/discount", require('./discount'))
route.use("/v1/api/comment", require('./comment'))
route.use("/v1/api/checkout", require('./checkout'))
route.use("/v1/api/cart", require('./cart'))
route.use("/v1/api", require('./access'))
// route.use("test/v1/api", require('./test/pubsub'))
// authentication 

// 
// check permission 

module.exports = route