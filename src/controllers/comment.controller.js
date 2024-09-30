'use strict';

const { createComment} = require('../services/comment.service');
const { CREATE,SuccessResponse } = require('../core/success.response');

class CommentController {

    createComment = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Success Created Comment',
            metadata: await createComment(req.body)
        }).send(res)
    } 
}


module.exports = new CommentController();