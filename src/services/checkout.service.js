'use strict';
const {BadRequestError,
    NotFoundResponse} = require('../core/error.response')
const {order} = require('../models/order.model');
const { findCartById } = require("../models/repositories/cart.repo");
const DiscountService = require("../services/discount.service");
const {checkProductByServer} = require("../models/repositories/product.repo");
// const { relaseLock } = require('./redis.service');
class CheckoutService {
    // login and Without login
    /*
        {
            cartId: String,
            userId: String,
            shop_order_ids: [
            {
                shopId: String,
                shop_discounts:[{
                    shopId,
                    discountId,
                    codeId
                }],
                item_products: [{
                    productId: String,
                    quantity: Number,
                    price: Number,
                },{
                    productId: String,
                    quantity: Number,
                    price: Number,
                },{
                    productId: String,
                    quantity: Number,
                    price: Number,
                }]
            },{
             ...
            }]
        }

        cách sử lý 
        1 - lấy shop_order_ids gốc 
        2 - kiểm tra từng discout với voucher shop
        3 - trả về 
    */ 
    static async checkoutReview({cartId, userId, shop_order_ids}){
        const foundCart = await findCartById(cartId);
        if(!foundCart) throw new NotFoundResponse('Cart not found');

        const checkout_order ={
            totalPrice: 0, // tổng tiền hàn
            feeShip: 0, // Phi vận chuyển
            totalDiscount: 0, // tổng giảm giá
            totalCheckout: 0, // tổng thanh toán
        }, shop_order_ids_new = []

        // Tính tổng tiền bill

        for(let i= 0;i <shop_order_ids.length; i++) {
            const {shopId, shop_discounts = [],item_products =[]} = shop_order_ids[i];

            const checkProductServer = await checkProductByServer(item_products); 
            console.log(`Checkour Product Service`, checkProductServer);
            if(!checkProductServer[0]) throw new BadRequestError('orther Wroing!!!');
            // tổng tiền đơn hàng
            const checkoutPrice = checkProductServer.reduce((acc, product)=>{
                return acc + (product.quantity * product.price);
            },0)
        // tổng tiền trước khi xử lý
        checkout_order.totalPrice = checkoutPrice;
            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // nếu shop_discount tồn tại > 0, check xem có hợp lệ hay không
            if(shop_discounts.length > 0){
                const {totalPrice= 0, discount = 0} = await DiscountService.getDiscountAmount({
                    codeId: shop_discounts[0]?.codeId,
                    userId,
                    shopId: shop_discounts[0]?.shopId,
                    products: checkProductServer,
                })
                checkout_order.totalDiscount +=discount;
                // Nếu số tiền giảm giá > 0
                if(discount > 0){
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount

            shop_order_ids_new.push(itemCheckout);
        }

        return {
            checkout_order,
            shop_order_ids,
            shop_order_ids_new
        }
    }
    // static async checkout({shop_order_ids_new,cartId,userId, userPayment={} , userAddress={}}){

    //     const {shop_order_ids_new: newShopOrderIdsNew, checkout_order} = await CheckoutService.checkoutReview({
    //         cartId,
    //         userId,
    //         shop_order_ids: shop_order_ids_new
    //     })
    //     // check lai một lần nữa xem có vượt tồn kho hay không?
    //     // get new array Products 
    //     const products = newShopOrderIdsNew.flatMap( order => order.item_products)
    //     console.log(`[1] :`, products);
    //     const acquireProducts =[];
    //     for(let i =0 ; i <= products.length; i++){
    //         const {productId, quantity} = products[i];
    //         const keyLock = await acquireLock(productId, quantity,cartId);
    //         console.log(`[2] :::`, keyLock);
    //         acquireProducts.push(keyLock ? true : false);
    //         if(keyLock) {
    //             await relaseLock(keyLock);
    //         }
    //     }

    //     // check if có sản phẩm hết hàng trong kho 
    //     if(acquireProducts.includes(false)){
    //         throw new BadRequestError('Product out of stock');
    //     }

    //     const newOrder = await order.create({
    //         order_userId: userId,
    //         order_checkout: checkout_order,
    //         order_payment: userPayment,
    //         order_shipping: userAddress,
    //         order_cartId: cartId,
    //         order_products: products
    //     });
    //     // truờng hợp: new ínert thành công, thì remove product in cart
    //     if(newOrder){

    //     }
        
    //     return newOrder
    // }
    /*
    1> Query orders [User]
    */ 
    static async getOrdersByUser({userId}){
        return await order.find({order_userId: userId});
    }
    /*
    2> Query get One Order [User]
    */ 
    static async getOrderByUser({userId}){
        return await order.find({order_userId: userId});
    }
    /*
    3> Cancelled Order [User]
    */ 
    static async cancelOrderByUser({userId}){
        return await order.find({order_userId: userId});
    }


        /*
    3> Update Order status [Shop | Admin]
    */ 
    static async updateOrderStatusByShop({userId}){
        return await order.find({order_userId: userId});
    }   

    
}

module.exports = CheckoutService;