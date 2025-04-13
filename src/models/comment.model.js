'use strict';

const {model, Schema} = require('mongoose');

const DOCUMENT_NAME = 'Comments';
const COLLECTION_NAME = 'comments';

const DEFAULT_SCHEMA = new Schema ({
    comment_productId: {type: Schema.Types.ObjectId, ref: 'Product'},
    comment_userId: {type: Number, default: 1},
    comment_content: {type: String, required: true},
    comment_left: {type: Number, default: Date.now},
    comment_right: {type: Number, default: 0},
    comment_parentID: {type: Schema.Types.ObjectId, ref: DOCUMENT_NAME},
    isDeleted: {type: Boolean, default: false},
},{
    collection: COLLECTION_NAME,
    timestamps: true
}
)

module.exports = model(DOCUMENT_NAME, DEFAULT_SCHEMA);