const {Types} = require('mongoose');

const {cart} = require('../cart.model');
const { ungetSelectData, getSelectData, convertToObjectIdMongodb } = require('../../utils');
const findCartById = async(cartId) =>{
    return await cart.findOne({
        _id: convertToObjectIdMongodb(cartId),
        cart_state: 'active'
    }).lean();
}

module.exports = {findCartById
    
}