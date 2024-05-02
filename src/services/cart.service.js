'use strict';

const {cart} = require('../models/cart.model');
const { convertToObjectIdMongodb } = require('../utils');
const {BadRequestError,
    NotFoundResponse} = require('../core/error.response');
const { getProductById } = require('../models/repositories/product.repo');
class CartService{
    // Start Repo Cart
    static async createUserCart({userId, product}){
        const query = {cart_userId : userId, cart_state: "active"},

        updateOrInsert = {
            $addToSet:{
                cart_products: product
            }
        },options = {upsert: true, new: true}

        return await cart.findOneAndUpdate(query, updateOrInsert, options);
    }
    static async updateUserCartQuantity({userId, product}){
        const {productId, quantity} =product;
        const query = {
            cart_userId : userId, 
            cart_state: "active", 
            "cart_products.productId" : productId
        }, updateSet = {
            $inc: {
                "cart_products.$.productId" : quantity
            }
        },options = {upsert: true, new: true}


        updateOrInsert = {
            $addToSet:{
                cart_products: product
            }
        },options = {upsert: true, new: true}

        return await cart.findOneAndUpdate(query, updateSet, options);
    }
    // End Repo Cart
    // Create
    static async addToCart({userId, product= {}}){
        //  Check cart ton tai
        const userCart = await cart.findOne({userId: userId});

        if(!userCart){
            return await CartService.createUserCart({userId, product})
        }
        //  nếu có giỏ hàng rồi nhưng chưa có sản phẩm 
        if(userCart.cart_products.length === 0){
            userCart.cart_products =[product];

            return await userCart.save();
        }
        //  nếu có giỏ hàng rồi và có sản phẩm này thì update quantity
        return await CartService.updateUserCartQuantity({userId, product});
    }
    // update cart

    /*
     shop_order_ids:{
            shodId,
            item_products [
                {
                    quantity,
                    price,
                    shopId,
                    old_quantity,
                    productId.
                 }],
            version:
    */ 

    static async addToCartV2({userId, product= {}}){
        //  Check cart ton tai
        const {productId, quantity, old_quantity} = shop_order_ids[0]?.item_products;

        const foundProduct = await getProductById(productId);

        if(!foundProduct) throw new NotFoundResponse('Product not exists')
        //  compare 
        if(!foundProduct.product_shop.toString() === shop_order_ids[0]?.shopId){
            throw new NotFoundResponse('Product not belong to this shop')
        }

        if(quantity === 0){
            // delete
            return await  CartService.deleteProductInCart({userId,productId})
        }

        return await CartService.updateUserCartQuantity({user, product:{productId, quantity}})
    }
    static async ReduceProductQuantity({userId, product= {}}){
        //  Check cart ton tai
    }

    static async IncreaseQuantity({userId, product= {}}){
        //  Check cart ton tai
    }
    static async getListUserCart({userId}){
        //  Check cart ton tai
        return await cart.findOne({cart_userId: userId}).lean();
    }
    static async DeleteCart({userId, product= {}}){
        //  Check cart ton tai
    }
    static async deleteProductInCart({userId, productId}){
        const query = {
            cart_userId: userId,
            cart_state:'active',
            },updateSet ={
                $pull: {
                    cart_products: {
                        productID: productId
                    }
                }
            }
        const deleteCart = await cart.updateOne(query, updateSet);

        return deleteCart;
        //  Check cart ton tai
    }
s}



module.exports = CartService;