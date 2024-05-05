'use strict';

const InventoryService = require("../services/inventory.service");
const { CREATE,SuccessResponse } = require('../core/success.response');

class InventoryController{
    addStock = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success add stock ',
            metadata: await InventoryService.addStockToInventory({...req.body})
        }).send(res);
    };
}

module.exports = new InventoryController();