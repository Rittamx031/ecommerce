'use strict';

const Redis = require('redis');
const {newClient} = require('./redis.service');
class RedisPubSubService{
    constructor(){
        this.subscriber =  newClient();
        this.publisher = newClient();
    }

    publish(channel, message){
        return new Promise( (resolve, reject) => {
            this.publisher.publish(channel, message, (err, reply) =>{
                if(err){
                reject(err);
                }
                resolve(reply);
            })
        });
    }

    subscribe(channel, callback) {
        this.subscriber.subscribe(channel);
        this.subscriber.on('message', (subscriberChanel, message) =>{
            if(channel === subscriberChanel){
                callback(channel, message);
            }
        } )
    }
}


module.exports = new RedisPubSubService();