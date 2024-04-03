'use strict';
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('../services/keyToken.service');
const {createTokenPair} = require('../auth/authUtils');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
};

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            // Step 1: Check if email already exists
            const modelShop = await shopModel.findOne({ email }).lean(); // lean returns plain JavaScript object
            if (modelShop) {
                return {
                    code: "xxxx",
                    message: "Shop already registered",
                };
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
                throw new Error('Failed to create new shop');
            }

            // Generate RSA key pair
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048
            });
            console.log(publicKey);
            // Create a token with the public key
            const publicKeyString = await KeyTokenService.createKeyToken({userId: newShop._id, publicKey});

            if (!publicKeyString) {
                return {
                    code: "xxxx",
                    message: "Failed to create publicKeyString",
                };
            }

            // Create token pair with RSA keys
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
            console.log(`Create Token Access::`, tokens);

            return {
                code: '001',
                metadata: {
                    user: newShop,
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
