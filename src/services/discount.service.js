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
const {discount} = require('../models/discount.model');
const { findAllDiscountCodesUnselect, findDiscount } = require('../models/repositories/discount.repo');
const { findAllProducts } = require('../models/repositories/product.repo');
const { convertToObjectIdMongodb } = require('../utils');
class DiscountService{
    static async createDiscountCode(payload){
        const {
            code, start_date, end_date,
            is_active, shopId, min_order_value, product_ids,
            applies_to, name, description,
            type, value, max_value, max_uses,
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
            discount_uses_count: 0 ,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_max_uses: max_uses,
            discount_user_count: user_count,
            discount_max_uses_per_user: max_uses_per_user
        });

        return newDiscount;
    }
    static async updateDiscountCode(payload){

    }
//  get all discount code available for product
    static async getAllDiscountCodesWithProduct({code, shopId, userId, limit, page}){
        const foundDiscout = await findDiscount(code, shopId);

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
        return discounts;
    }
    /* 
        Apply discount code
        products = [{
            productId,
            shopId,
            quantity,
            price,
            name
        },{
            productId,
            shopId,
            quantity,
            price,
            name
        }]
     */ 
    static async getDiscountAmount({
        codeId, userId, shopId, products
    }){
        const foundDiscout = await findDiscount(codeId, shopId);

        if(!foundDiscout) throw new NotFoundResponse("Discount dosen't exits");

        const {discount_is_active,
                discount_max_users,
                discount_start_date,
                discount_end_date,
                discount_min_order_value,
                discount_max_uses_per_user,
                discount_users_used,
                discount_value,
                discount_type
        } = foundDiscout;

        if(!discount_is_active) throw new BadRequestError("Discount expried!");
        if(discount_max_users <=0) throw new BadRequestError("Discount are out!");

        // if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)){
        //     throw new BadRequestError("Discount expried!");
        // }
        //  check em co gia tri thoi thieu ko
        let totalOrder = 0;
        if(discount_min_order_value > 0){
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.price * product.quantity);
            }, 0)

            if(totalOrder < discount_min_order_value){
                throw new NotFoundResponse(`discount require  a minium order value of ${discount_min_order_value}`)
            }

            if(discount_max_uses_per_user>0){
                const userDiscount = discount_users_used.find( user => user.userId === userId )
                if (userDiscount){

                }
            }
            //  check xem discount is fixed_amount  or percentage

            const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder*(discount_value/100);

            return {
                totalOrder,
                discount: amount,
                totalPrice: totalOrder - amount
            }
        }
    }
    /*
        Hai cách xóa data. 
        1 - ném vào 1 db khác để trường hợp kiện tùng, cần restore.
        2 - đánh dấu bằng 1 trường vd deleted.
    */ 
    static async deleteDiscountCode({
        shopId,
        codeId
    }){
        // const foundDiscout = await findDiscount(codeId, shopId);
        // if(!foundDiscout) throw new NotFoundResponse("Discount dosen't exits");
        const  deletedCode = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })
        return deletedCode;
    }

    /* User Cancel discount code*/ 
    static async cancelDiscountCode({
        codeId,
        shopId,
        userId
    }){
        const foundDiscout = await findDocument({
            model: discount,
            filter:{
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        });
        if(!foundDiscout) throw new NotFoundResponse("Discount dosen't exits");

        const result = await foundDiscout.updateOne({
            $pull:{
                discount_users_used: userId
            },
            $inc: {
                discount_max_users: 1,
                discount_user_count: -1
            }
        })
        return result;
    }
}


module.exports = DiscountService;