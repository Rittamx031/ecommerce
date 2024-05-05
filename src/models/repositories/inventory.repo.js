const { inventory } = require('../inventory.model');
const { convertToObjectIdMongodb } = require('../../utils');

const insertInventory = async({productId, ShopId, location = 'Unknow', stock}) =>{
    return await inventory.create({
        inven_productId: productId,
        inven_shopId: ShopId,
        inven_location: location,
        inven_stock: stock
    })
}

const reservationInventory = async({productId, quantity, cartId}) =>{
    const query = {
        inven_productId: convertToObjectIdMongodb(productId),
        inven_shopId: convertToObjectIdMongodb(cartId),
        inven_stock: {
            $gte: quantity
        }
        }, updateSet = {
            $inc:{
                inven_stock: -quantity,
            },
            $push: {
                inven_reservations: {
                    quantity,
                    cartId,
                    createdOn: new Date()
                }
            }
        },options = {upsert: true, new: true}

        return await inventory.findOneAndUpdate(query, updateSet, options);
}

module.exports = {insertInventory,reservationInventory}