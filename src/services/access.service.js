'use strict';
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('../services/keyToken.service');
const {findByEmail} = require('../services/shop.service');
const {createTokenPair,vertifyJWT} = require('../auth/authUtils');
const {getInfoData} = require('../utils/index');
const { BadRequestError, AuthFailureResponse, ForBiddenError } = require('../core/error.response');
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
};

class AccessService {
    /*
    1 - check token use
    2 -
    */ 
    static handleRefreshToken = async (refreshToken) =>{
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        if(foundToken){
            // decode  xem may la thang nao ?
            const {userId, email} = await vertifyJWT( refreshToken, foundToken.privateKey);
            console.log({userId, email});
            await KeyTokenService.deleteKeyByUserID
            throw new ForBiddenError("Somthing was happend please login");
        }
    // NO 
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
        if(!holderToken) throw new AuthFailureResponse("Shop not registered");
        // vertify Token
        const {userId, email} = await vertifyJWT( refreshToken, holderToken.privateKey);
        // Check UserId
        console.log({userId, email});
        const shop = await findByEmail({email});
        if(!shop) throw new AuthFailureResponse("Shop not registered");

        // create new token
        const tokens = await createTokenPair({userId, email},holderToken.publicKey , holderToken.privateKey);
        // update token
        await holderToken.updateOne({
            $set:{
                refreshToken: tokens.refreshToken
            },
            $addToSet:{
                refreshTokensUsed: tokens.refreshToken
            }
        });
        return {
            user:{userId, email},
            tokens
        }
    }
    static handleRefreshTokenv2 = async ({refreshToken, user,keyStore}) =>{
        const {userId, email} = user;

        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyByUserID(userId);
            throw new ForBiddenError("Somthing was happend please login");
        }

        if(keyStore.refreshToken !== refreshToken) throw new AuthFailureResponse("Shop not registered");

        const shop = await findByEmail({email});
        if(!shop) throw new AuthFailureResponse("Shop not registered");

        // create new token
        const tokens = await createTokenPair({userId, email},keyStore.publicKey , keyStore.privateKey);
        // update token
        await keyStore.updateOne({
            $set:{
                refreshToken: tokens.refreshToken
            },
            $addToSet:{
                refreshTokensUsed:tokens.refreshToken
            }
        });
        return {
            user,
            tokens
        }
    }
    /*
        1- check email
        2- match password
        3- create AT vs RT and save
        4- gennerate token
        5- get data return token 
    */ 

    static login = async ({email, password,refreshToken = null}) =>{
        // 1
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new BadRequestError('Can not find Shop');
        // 2 
        const isMatch = await bcrypt.compare(password, foundShop.password);
        if(!isMatch) throw new AuthFailureResponse('Password not match');
        // 3 
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'pkcs1', // public key cryptography Standards !
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
        });
        // 4
        const userId = foundShop._id;
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);
        await KeyTokenService.createKeyToken({userId, publicKey, privateKey, refreshToken: tokens.refreshToken})

        return {
            shop: getInfoData({fileds:["_id","email","name"], object: foundShop}),
            tokens
        }
    }
    static logout =  async (keyStore) =>{
        const delKey =  KeyTokenService.removeKeyById(keyStore._id);
        console.log(delKey);
        return delKey;
    }
    static signUp = async ({ name, email, password }) => {
        try {
            // Step 1: Check if email already exists
            const modelShop = await shopModel.findOne({ email }).lean(); // lean returns plain JavaScript object
            if (modelShop) {
                throw new BadRequestError("Error: Shop already registered"); 
            }

            // Hash the password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create new shop
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP]
            });

            if (!newShop) {
                throw new BadRequestError("Failed to create new shop"); 
            }

            // Generate RSA key pair
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'pkcs1', // public key cryptography Standards !
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem',
                },
            });
            console.log(publicKey);
            // Create a token with the public key
            const publicKeyString = await KeyTokenService.createKeyToken({userId: newShop._id, publicKey});

            if (!publicKeyString) {
                throw new BadRequestError("Failed to create publicKeyString"); 
            }
            const publicKeyObject = crypto.createPublicKey(publicKeyString)
            // Create token pair with RSA keys
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyString, privateKey);
            console.log(`Create Token Access::`, tokens);

            return {
                code: '001',
                metadata: {
                    user: getInfoData({fileds: ['_id','name', 'email'], object: newShop}),
                    tokens
                }
            };
        } catch (error) {
            return {
                code: "xxx",
                message: error.message,
                status: 'error'
            };
        }
    };
}
module.exports = AccessService;
