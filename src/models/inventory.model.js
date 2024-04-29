'use strict';

const {model,Schema} = require('mongoose');
const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';
var InventorySchema = new Schema({
  inven_productId: {type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product'},
  inven_location: {type: String, default: 'unKnown'},
  inven_stock:{ type: Number, required: true},
  inven_shopId: {type: Schema.Types.ObjectId,
    required: true,
    ref: 'Shop'},
  inven_reservations:{ type: Array,default: []},
  /*
    cartID:,
    stock:1,
    createdOn.
  */
},{
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = {
    inventory:  model(DOCUMENT_NAME, InventorySchema)
}