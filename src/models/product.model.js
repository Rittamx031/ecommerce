'use strict';

const {model, Schema} = require('mongoose');
const slugify = require('slugify')
const DOCUMENT_NAME = 'Product';
const CLOTHING_DOCUMENT_NAME = 'Clothing';
const ELECTRONIC_DOCUMENT_NAME = 'Electronic';
const FURNITRURE_DOCUMENT_NAME = 'Furnitrue';
const COLLECTION_NAME = 'products';

const productSchema = new Schema ({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String, 
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronic', 'Clothing', 'Furniture']},
    product_shop: String, //{ type: Schema.Types.ObjectId, ref: 'User' },
    product_attributes: { type: Schema. Types. Mixed, required: true },
    // more
    product_ratingsAvarage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: (val) => Math.round(val*10)/10
    },
    product_variations: {
        type: Array,
        default: []
    },
    isDraft: {type: Boolean, default: true, select:false, index:true },
    isPublish: {type: Boolean, default: false, select:false, index:true }
    // , isPublish, unPublish
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})
// Document middleware: runs before .save() and .create()...
// create index to search
productSchema.index({product_name : 'text', product_description: 'text'})
productSchema.pre('save', function (next){
    this.product_slug = slugify(this.product_name), {lower: true};
    next();
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

const furnitrueSchema = new Schema({
    brand: {type: String, required: true},
    product_shop: String,
    size: String,
    material: String
}, {
    collection: "furnitures",
    timestamps: true
})

module.exports ={
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model(CLOTHING_DOCUMENT_NAME, clothingSchema),
    electronic: model(ELECTRONIC_DOCUMENT_NAME, electronicSchema),
    furnitrue: model(FURNITRURE_DOCUMENT_NAME, furnitrueSchema)
}