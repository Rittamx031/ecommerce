'use strict';

const {product, clothing, electronic, furnitrue} = require('../models/product.model')
const {BadRequestError} = require('../core/error.response');

class ProductFactory {
    /* 
        types: 'Clothing', 'Electronic'
    */
   static productRegistry = {}; // key- class  
   static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
   }

    static async createProduct(type, payload){
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`invalid product type1 ${type}`);
        return new productClass(payload).createProduct();
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
        return await product.create({...this, _id: product_id});
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
class Furnitrue extends Product {
    async createProduct() {
        const newFurnitrue = await furnitrue.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurnitrue) throw new BadRequestError('create new clothings error');

        const newProduct = await super.createProduct(newFurnitrue._id);
        if(!newProduct) throw new BadRequestError('create new clothings error');

        return newProduct;
    }
}

// register product type 
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furnitrue', Furnitrue);

module.exports = ProductFactory;