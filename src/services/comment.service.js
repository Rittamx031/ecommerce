'use strict';

const { NotFoundResponse } = require('../core/error.response');
const comment = require('../models/comment.model');
const {convertToObjectIdMongodb} = require('../utils');

const {
    findProduct
    } = require('../models/repositories/product.repo');
/* 
    key featruer: Comment Service
    add comment [User, Shop]
    get a list of Comment [User, Shop]
    delete a comment [User, Shop, Admin]
*/ 

class CommentService{

    static async createComment ({ 
        productId,
        userId,
        content,
        parentId = null
    }){
        const newComment = new comment({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_userId: userId,
            comment_content: content,
            comment_parentID: parentId
        });

        let rightValue ;
        if (parentId) {
            // repply Comment
            const parentComment = await comment.findOne({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_parentID: convertToObjectIdMongodb(productId) 
            })

            if(!parentComment) throw new NotFoundResponse('Parent Comment not found')

            rightValue = parentComment.comment_right;
            await comment.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_right: {$gte: rightValue}
            },{
                $inc: {comment_right: 2}
            })

            await comment.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: {$gt: rightValue}
            },{
                $inc: {comment_left: 2}
            })

            newComment.comment_left = rightValue + 1;
            newComment.comment_right = rightValue + 2;
        }else {
            const maxRightValue =  await comment.findOne({
                comment_productId: convertToObjectIdMongodb(productId)
            }, 'comment_right', {sort: {comment_right : -1}})
            if(maxRightValue){
                rightValue = maxRightValue.comment_right + 1;
            }else{
                rightValue = 1;
            }
            newComment.comment_left = rightValue;
            newComment.comment_right = rightValue + 1;
        }

        //insert to comment

        return await newComment.save();
    }

    static async getCommentByProductId ({productId}){
        return await comment.find({
            comment_productId: convertToObjectIdMongodb(productId)
        })
    }

    static async deleteComment ({productId, commentId}){
        const foundProduct = await findProduct({
            product_id: productId
        })

        if(!foundProduct) throw new NotFoundResponse(`Product ${productId} not found`);

        const foundComment = await comment.findById(commentId);   

        if(!foundComment) throw new NotFoundResponse(`Comment ${commentId} not found`);

        const leftValue = foundComment.comment_left;
        const rightValue = foundComment.comment_right;
        // 2. Tính Chiều rộng
        const witdh = rightValue - leftValue + 1;
        // 3. Xóa tất cả comment id con
        await comment.deleteMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: {$gte: leftValue},
            comment_right: {$lte: rightValue}
        })
        // 4. Cập nhật lại cây
        await comment.updateMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: {$gt: rightValue}
        },{
            $inc: {comment_left: -witdh}
        })


    }   
}

module.exports = CommentService;