'use strict';

const {model, Schema} = require('mongoose');

const DOCUMENT_NAME = 'Product';
const CLOTHING_DOCUMENT_NAME = 'Clothing';
const ELECTRONIC_DOCUMENT_NAME = 'Electronic';
const COLLECTION_NAME = 'products';

const productSchema = new Schema ({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronic', 'Clothing', 'Furniture']},
    product_shop: String, //{ type: Schema.Types.ObjectId, ref: 'User' },
    product_attributes: { type: Schema. Types. Mixed, required: true }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

const clothingSchema = new Schema({
    brand: {type: String, required: true},
    product_shop: String,
    size: String,
    material: String
}, {
    collection: "clothings",
    timestamps: true
})

const electronicSchema = new Schema({
    manufacturer: {type: String, required: true},
    product_shop: String,
    model: String,
    color: String
}, {
    collection: "electronics",
    timestamps: true
})

module.exports ={
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model(CLOTHING_DOCUMENT_NAME, clothingSchema),
    electronic: model(ELECTRONIC_DOCUMENT_NAME, electronicSchema),
}