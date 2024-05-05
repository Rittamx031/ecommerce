'use strict';

// !dmbg
const {model,Schema} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'orders';
// Declare the Schema of the Mongo model
var orderSchema = new Schema({
    order_userId: { type: Number, required: true},
    order_checkout: {type: Object, default: {}},
    /*
        order_checkout = {
            total Price,
            totalApplyDiscount
            feeShip
        }
    */
   order_shipping:{type:Object, default: {}},
   /* 
   street, city, state, country
   */
   order_payment:{type:Object, default: {}},
   /* 
   cardNumber,
   cardType,
   cardExpMonth,
   cardExpYear,
   cardCVV
   */
   order_status:{type:String,enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending'},
   order_products: {type: Array, default: []},
   order_trackingNumber: {type: String, default: '#0001'},
   /*
   productID,
   ShopeId,
   Quantity,
   Name,
   Price
   */
},{
    timestamps: true,
    collection: COLLECTION_NAME
}
);

//Export the model
module.exports = {order: model(DOCUMENT_NAME, orderSchema)}
