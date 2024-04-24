'use strict';

const {product, clothing, electronic, furnitrue} = require('../models/product.model')
const {BadRequestError} = require('../core/error.response');
const {findAllDraftForShop, publishProductByShop, findAllPublicForShop,
     unPublishProductByShop, seacrhProduct,findAllProducts,
     findProduct,
     updateProductById} = require('../models/repositories/product.repo');
const { updateNestedObjectParser, removeUndefinedObject } = require('../utils');
class ProductFactory {
    /* 
        types: 'Clothing', 'Electronic'
    */
   static productRegistry = {}; // key- class  
   static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
   }

    static async createProduct(type, payload){
        console.log(type, payload);
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`invalid product type1 ${type}`);
        return new productClass(payload).createProduct();
    }

    static async updateProduct(type, productId, payload){
        console.log(type, payload);
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`invalid product type1 ${type}`);
        return new productClass(payload).updateProduct(productId);
    }

    static async findAllDraftForShop({product_shop,limit= 50, skip =0}){
        const query = {product_shop, isDraft: true};
        return await findAllDraftForShop({query, limit, skip});
    }

    static async findAllPublicForShop({product_shop,limit= 50, skip =0}){
        const query = {product_shop, isPublish: true};
        return await findAllPublicForShop({query, limit, skip});
    }

    static async publicProductByShop({product_shop, product_id}){
        return await publishProductByShop({product_shop, product_id})
    }
    static async unPublicProductByShop({product_shop, product_id}){
        return await unPublishProductByShop({product_shop, product_id})
    }
    static async seacrhProduct({key_search}){
        return await seacrhProduct({key_search})
    }
    
    static async findAllProducts({limit= 50, sort = "ctime" ,page = 1, filter = {isPublish:true }}){
        return await findAllProducts({limit, sort,page, filter,select:['product_name','product_thumb','product_price'] })
    }

    static async findProduct({product_id}){
        return await findProduct({product_id,unSelect: ['__v']})
    }
}

class Product {
    constructor({
        product_name,product_thumb,product_description,product_shop,
        product_price,product_quantity,product_type,product_attributes,
        product_ratingsAvarage
    }){
        this.product_name = product_name;
        this.product_shop = product_shop;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_ratingsAvarage = product_ratingsAvarage;
        this.product_attributes = product_attributes
    }
    async createProduct(product_id){
        return await product.create({...this, _id: product_id});
    }

    async updateProduct(productId, bodyUpdate){
        return await updateProductById({productId,bodyUpdate: updateNestedObjectParser(bodyUpdate), model: product})
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
    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this);

        if(objectParams.product_attributes){
            // update product attributes
            updateProductById({productId, bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), model: clothing})
        }
        const updateProduct = await super.updateProduct(productId, objectParams);
        return updateProduct;
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

    async updateProduct(productId) {
        console.log(`[0]::`,this);
        const objectParams = removeUndefinedObject(this);
        console.log(`[1]::`,objectParams);
        if(objectParams.product_attributes){
            // update product attributes
            updateProductById({productId, bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), model: electronic})
        }
        const updateProduct = await super.updateProduct(productId, objectParams);
        return updateProduct;
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

    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this);
        if(objectParams.product_attributes){
            // update product attributes
            updateProductById({productId, bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), model: furnitrue})
        }
        const updateProduct = await super.updateProduct(productId, objectParams);
        return updateProduct;
    }
}

// register product type 
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furnitrue', Furnitrue);

module.exports = ProductFactory;