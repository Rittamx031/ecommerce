'use strict';

const keytokenModel = require("../models/keytoken.model");
class KeyTokenService{
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) =>{
        try{
            // lv 0
            // const publicKeyString = publicKey.toString();

            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey: publicKeyString,
            // })
            // return tokens ? tokens.publicKey : null;

            // level xx
            const filter = {user: userId},update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            },options = { upsert: true,new:true};
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options);
            return tokens ? tokens.publicKey : null;
        } catch(e){
            return e
        }
    }
    static removeKeyById = async (id) =>{
        return await keytokenModel.deleteOne({_id : id});
    }
    static findByClientId = async (userId) =>{
       return await keytokenModel.findOne({user:userId});
    }
    static findByRefreshToken = async (refreshToken) =>{
        return await keytokenModel.findOne({refreshToken: refreshToken});
    } 
    static findByRefreshTokenUsed = async (refreshToken) =>{
        return await keytokenModel.findOne({refreshTokensUsed: refreshToken}).lean();
    } 
    static deleteKeyByUserID = async (userId) =>{
        return await keytokenModel.findOneAndDelete({user: userId}).lean();
    } 
}

module.exports = KeyTokenService;