const {Types} = require('mongoose');

const { inventory } = require('../inventory.model');

const insertInventory = async({productId, ShopId, location = 'Unknow', stock}) =>{
    return await inventory.create({
        inven_productId: productId,
        inven_shopId: ShopId,
        inven_location: location,
        inven_stock: stock
    })
}

module.exports = {insertInventory}