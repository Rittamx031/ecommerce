'use strict';
const AccessService = require('../services/access.service')

const { CREATE,SuccessResponse } = require('../core/success.response');

class AccessController{
    handleRefreshToken =  async (req, res, next) => {
        // new SuccessResponse({
        //     message: 'get Token  Successfully',
        //     metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
        // }).send(res);
        // ver2 fixed, no need access token
        new SuccessResponse({
            message: 'get Token  Successfully',
            metadata: await AccessService.handleRefreshTokenv2(
                {
                 refreshToken: req.refreshToken,
                 user: req.user,
                 keyStore: req.keyStore
            })
        }).send(res);
    }
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