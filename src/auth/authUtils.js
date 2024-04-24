'use strict';
const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const KeyTokenService = require('../services/keyToken.service');
const { AuthFailureResponse, NotFoundResponse } = require('../core/error.response');
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'refreshtoken',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try{
        const accessToken = await JWT.sign(payload, privateKey,{
            algorithm: 'RS256',
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey,{
            algorithm: 'RS256',
            expiresIn: '7 days'
        })
        // verify use refresh token 
        JWT.verify(accessToken, publicKey, (err,decode) =>{
            if(err){
                console.log('error verifying:: ',err);
            }else{
                console.log(`decode:: `, decode);
            }
        });
        return {
            accessToken,
            refreshToken
        }
    }catch(e){
        console.log(e);
    }
};
const authentication = asyncHandler( async (req, res, next) =>{
    /*
    1 - check user id missing?
    2 - get accesstoken 
    3 - verify token
    4 - check user
    5 - check keystore with userid
    6 - Ok all , return next();
    */ 
    //  1
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureResponse('Invalid client');

    // 2
    const keyStore = await KeyTokenService.findByClientId(userId);
    if(!keyStore) throw new NotFoundResponse("Not found keyStore");

    // 3

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if(!accessToken) throw new AuthFailureResponse("Invalid Accesss");

    try{
        const decodeUser = JWT.decode(accessToken, keyStore.publicKey);
        if(userId !== decodeUser.userId) throw new AuthFailureResponse("Invalid userId");
        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    }catch(error){
        throw error;
    }
})

const authenticationv2 = asyncHandler( async (req, res, next) =>{
    /*
    1 - check user id missing?
    2 - get accesstoken 
    3 - verify token
    4 - check user
    5 - check keystore with userid
    6 - Ok all , return next();
    */ 
    //  1
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureResponse('Invalid client');

    // 2
    const keyStore = await KeyTokenService.findByClientId(userId);
    if(!keyStore) throw new NotFoundResponse("Not found keyStore");

    // 3
    if(req.headers[HEADER.REFRESHTOKEN]){
        try{
            const refreshToken = req.headers[HEADER.REFRESHTOKEN];
            const decodeUser = JWT.decode(refreshToken, keyStore.privateKey);
            if(userId !== decodeUser.userId) throw new AuthFailureResponse("Invalid userId");
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        }catch(error){
            throw error;
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if(!accessToken) throw new AuthFailureResponse("Invalid Accesss");

    try{
        const decodeUser = JWT.decode(accessToken, keyStore.publicKey);
        if(userId !== decodeUser.userId) throw new AuthFailureResponse("Invalid userId");
        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    }catch(error){
        throw error;
    }
})
const vertifyJWT = async(token, keySecret) => {
    return await JWT.verify(token, keySecret);
}
module.exports = {
    createTokenPair,
    authentication,
    authenticationv2,
    vertifyJWT
};