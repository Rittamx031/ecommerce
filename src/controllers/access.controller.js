'use strict';
const AccessService = require('../services/access.service')

const { CREATE,SuccessResponse } = require('../core/success.response');

class AccessController{
    logout =  async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout Successfully',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res);
    }
    login = async (req, res, next) => {
        // return res.status(201).json(await AccessService.signUp(req.body))
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res);
    };
    signUp = async (req, res, next) => {
        // return res.status(201).json(await AccessService.signUp(req.body))
        new CREATE({
            message: 'Registration oke',
            metadata: await AccessService.signUp(req.body)
        }).send(res);
    };
}

module.exports = new AccessController();