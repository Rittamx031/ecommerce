'use strict';

const {product, clothing, electronic} = require('../models/product.model')
const {BadRequestError} = require('../core/error.response');
const {insertInventory} = require('../models/repositories/inventory.repo');
class ProductFactory {
    /* 
        types: 'Clothing', 'Electronic'
    */ 
    static async createProduct(type, payload){
        switch (type){
            case 'Clothing':
                return new Clothing(payload).createProduct();
            case 'Electronic':
                return new Electronic(payload).createProduct();
            default:
                throw new BadRequestError('invalid product type');
        }
    }
}

class Product {
    constructor({
        product_name,product_thumb,product_description,product_shop,
        product_price,product_quantity,product_type,product_attributes
    }){
        this.product_name = product_name;
        this.product_shop = product_shop;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_attributes = product_attributes
    }
    async createProduct(product_id){
        const newProduct = await product.create({...this, _id: product_id});
        if(newProduct){
            const inventory =  insertInventory({
                productId: this._id,
                ShopId: this.product_shop,
                stock: this.product_quantity
            })
        }

    }
}

// Define sub-class for different product types Clothings, Electrons

class Clothing extends Product {
    async createProduct() {
        const newClothings = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newClothings) throw new BadRequestError('create new clothings error');

        const newProduct = await super.createProduct(newClothings._id);
        if(!newProduct) throw new BadRequestError('create new clothings error');

        return newProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newClothings = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newClothings) throw new BadRequestError('create new clothings error');

        const newProduct = await super.createProduct(newClothings._id);
        if(!newProduct) throw new BadRequestError('create new clothings error');

        return newProduct;
    }
}

module.exports = ProductFactory;