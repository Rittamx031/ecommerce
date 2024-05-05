const redis = require('redis');
const {promisify} = require('util');
const redisClient = redis.createClient();
const {reservationInventory} = require('../models/repositories/inventory.repo')
const pexpire = promisify(redisClient.pexpire).bind(redisClient);

const setnvxAsync =  promisify(redisClient.pexpire).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) =>{
    const key = 'lock_v2023_${productId}'
    const retryTime = 10;
    const exprireTime = 3000; // 3 seconds tam lock

    for(let i = 0; i < retryTime; i++) {
        // tạo 1 ky , thành nào nắm dc thì cho vao thanh toán
        const result = await setnvxAsync(key,exprireTime);
        console.log(`Result::: ${result}`);
       if(result === 1){
        // thao tác với inventory 
        const istReversation = await reservationInventory({productId, quantity, cartId})
        if(istReversation.modifiedCount){
            await pexpire(key, exprireTime);
            return key;
        }
        return null;
       }else{
        await new Promise(resolve => setTimeout(resolve,50))
       }

    }
}


const relaseLock = async keyLock =>{
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock);
}

module.exports = {
    acquireLock,
    relaseLock
}