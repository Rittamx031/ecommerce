'use strict';

// !dmbg
const {model,Schema} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'shops';
// Declare the Schema of the Mongo model
var shopSchema = new Schema({
    name:{
        type:String,
        required:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    vertify:{
        type: Schema.Types.Boolean,
        default:false
    },
    roles: {
        type: Array,
        default: []
    }
},{
    timestamps: true,
    collection: COLLECTION_NAME
}
);

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);
