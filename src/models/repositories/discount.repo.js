const {Types} = require('mongoose');

const discount = require('../discout.model');
const { ungetSelectData, getSelectData } = require('../../utils');


const findAllDiscountCodesUnselect = async({
    limit=50, page = 1, sort ='ctime',
    filter,unSelect, model
}) =>{
    const skip = (page - 1)*limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
    const documents = await model.find(filter)
   .sort(sortBy)
   .skip(skip)
   .limit(limit)
   .select(ungetSelectData(unSelect))
   .lean();
   return documents
}


const findAllDiscountCodesSelect = async({
    limit=50, page = 1, sort ='ctime',
    filter,select, model
}) =>{
    const skip = (page - 1)*limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
    const documents = await model.find(filter)
   .sort(sortBy)
   .skip(skip)
   .limit(limit)
   .select(getSelectData(select))
   .lean();
   return documents
}
// const insertInventory = async({productId, ShopId, location = 'Unknow', stock}) =>{
//     return await inventory.create({
//         inven_productId: productId,
//         inven_shopId: ShopId,
//         inven_location: location,
//         inven_stock: stock
//     })
// }
const findDiscount = async(codeId, shopId) =>{
    return await discount.findOne({
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
    }).lean();
}
const findDocument = async(mode, filter) =>{
    return await mode.findOne(filter);
}
module.exports = {findAllDiscountCodesUnselect,
    findAllDiscountCodesSelect,
    findDocument,
    findDiscount
}