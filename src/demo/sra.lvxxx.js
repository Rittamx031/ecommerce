'use strict'

const crypto = require('crypto');
const JWT = require('jsonwebtoken');

const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa',{
    modulusLength: 4096
})

console.log({privateKey, privateKey});

const token = JWT.sign({userId: 1234, roles: ['ADMIN']}, privateKey,{
    algorithm: 'RS256',
    expiresIn: '2 days'
})

console.log(`Sign Token::`,token);

JWT.verify(token, publicKey, (err,decode) =>{
    console.log(`Decode:: `, decode);
})

JWT.verify(token, privateKey, (err,decode) =>{
    console.log(err);
    console.log(`Private key: ${decode}`);
})