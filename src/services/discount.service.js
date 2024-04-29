/*
    Discount Service 
    1 - Generator Discount [Shop/ Admin]
    2 - Get discount amout {user}
    3- Get all discount Code [Uses/ Shop]
    4 - verify discount code [users]
    5- Delete discount Code [Shop / Admin]
    6- Cancel Discount Code [Shop / Admin]
*/ 
const {BadRequestError,
       NotFoundResponse} = require('../core/error.response')
const discount = require('../models/discout.model');
const { findAllDiscountCodesUnselect } = require('../models/repositories/discount.repo');
const { findAllProducts } = require('../models/repositories/product.repo');
const { convertToObjectIdMongodb } = require('../utils');
class DiscountService{
    static async createDiscountCode(payload){
        const {
            code, start_date, end_date,
            is_active, shopId, min_order_value, product_ids,
            applies_to, name, description,
            type, value, max_value, max_users,
            user_count, max_uses_per_user
        } = payload;
        // Kiểm tra

        if( new Date() < new Date(start_date) || new Date() < new Date(start_date)) throw new BadRequestError('Discount code has expired');
        if(new Date(end_date) < new Date(start_date)) throw new BadRequestError('Discount date not valid');

        // create index for discount code
        const foundDiscout = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean();

        if(foundDiscout && foundDiscout.discount_is_active){
            throw new BadRequestError('Discount is using now !!!');
        }

        const newDiscount = await discount.create({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_is_active: is_active,
            discount_min_order_value: min_order_value,
            discount_product_ids: product_ids,
            discount_applies_to: applies_to,
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_max_users: max_users,
            discount_user_count: user_count,
            discount_max_uses_per_user: max_uses_per_user
        });

        return newDiscount;
    }
    static async getDiscountAmount(payload){

    }
    static async updateDiscountCode(payload){

    }
//  get all discount code available for product
    static async getAllDiscountCodesWithProduct({code, shopId, userId, limit, page}){
        const foundDiscout = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean();

        if(!foundDiscout || !foundDiscout.discount_is_active) throw new NotFoundResponse('Discount not exists')

        const {discount_applies_to, discount_product_ids} = foundDiscout
        let products;
        if (discount_applies_to === 'all'){
            products = await findAllProducts({
                filter:{
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublish: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name','product_thumb','product_price']
            })
        }
        if (discount_applies_to === 'specific'){
            products = await findAllProducts({
                filter:{
                    _id:{ $in: discount_product_ids},
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublish: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name','product_thumb','product_price']
            })
        }
        return products;
    }
    static async getAllDiscountCodesByShop({
        limit, page, shopId
    }){
        const discounts = findAllDiscountCodesUnselect({
            limit,
            page,
            filter:{
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            unSelect:['v','discount_shopId'],
            model: discount
        })

    }
}


module.exports = DiscountService;