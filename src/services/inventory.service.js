'use strict';
const { BadRequestError } = require('../core/error.response');
const {inventory} = require('../models/inventory.model');
const { getProductById } = require('../models/repositories/product.repo');
class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = 'Unknow'
    }){
        const product = await getProductById(productId);
        if(!product) throw new BadRequestError('The Product is not exits')

        const query = {
            inven_shopId: shopId,
            inven_productId: productId},
            updateSet = {
                $inc: {
                    inven_stock: stock,
                },
                $set: {
                    inven_location: location
                }
            },options = {upsert:true, new: true}
            return await inventory.findOneAndDelete( query, updateSet, options );
    }
}


module.exports = InventoryService;