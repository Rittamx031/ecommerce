'use strict';
const express = require('express');
require('../../../test/inventory.test');
const productionTestService = require('../../../test/product.test');
productionTestService.purchaseProduct('product:001','10')
const route = express.Router();
module.exports = route