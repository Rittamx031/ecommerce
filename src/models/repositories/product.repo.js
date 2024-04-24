'use strict';

const {product,clothing,electronic,furnitrue} = require('../product.model');
const {Types} = require('mongoose');
const {getSelectData, ungetSelectData, updateNestedObjectParser } = require('../../utils/index');
const findAllDraftForShop = async({query, limit, skip}) =>{
    return await queryProduct({query, limit, skip})
}

const findAllPublicForShop = async({query, limit, skip}) =>{



    return await queryProduct({query, limit, skip})
}

const findAllProducts = async({limit, sort ,page , filter, select}) =>{
    const skip = (page-1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
    const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();

    return products;
}

const publishProductByShop = async({product_shop,product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
            _id: new Types.ObjectId(product_id)
    })
    if(!foundShop) return null;
    
    foundShop.isDraft = false;
    foundShop.isPublish = true;

    const { modifiedCount } = await foundShop.save(foundShop);

    return modifiedCount;
}

const unPublishProductByShop = async({product_shop,product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
            _id: new Types.ObjectId(product_id)
    })
    if(!foundShop) return null;
    
    foundShop.isDraft = true;
    foundShop.isPublish = false;

    const { modifiedCount } = await foundShop.save(foundShop);

    return modifiedCount;
}
const seacrhProduct = async ({key_search}) =>{
    const regexSearch = new RegExp(key_search)
    const result = await product.find({
        $text: { $search : regexSearch}
        , isPublish: true },
        {score: {$meta: 'textScore'}})
        .sort({score: {$meta: 'textScore'}})
        .lean();

    return result;
}
const findProduct = async({product_id, unSelect}) =>{
    return await product.findById(product_id).select(ungetSelectData(unSelect));
}

const updateProductById = async({productId,bodyUpdate, model, isNew = true})=>{
    return await model.findByIdAndUpdate(productId, bodyUpdate,{
        new: isNew
    })
}
const queryProduct = async({query, limit, skip}) =>{
    return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
}
module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublicForShop,
    unPublishProductByShop,
    seacrhProduct,
    findAllProducts,
    findProduct,
    updateProductById
}