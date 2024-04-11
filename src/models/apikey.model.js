'use strict';


const {model,Schema} = require('mongoose');
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'products';

const ProductSchema = new Schema ({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture']},
    product_shop: String, //{ type: Schema.Types.ObjectId, ref: 'User' },
    product_attributes: { type: Schema. Types. Mixed, required: true }
    }, {
    collection: COLLECTION_NAME,
    timestamps: true
});
 
module.exports = model(DOCUMENT_NAME, ProductSchema)