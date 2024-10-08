'use strict';

const mongoose = require('mongoose');
const { db: {user, pass, host, name, port } } = require('../configs/config.mongobd');
const connectString = `mongodb://${user}:${pass}@${host}:${port}/${name}?authSource=admin&retryWrites=true&w=majority`
console.log(connectString);
const { countConnect } = require('../helpers/check.connect');
class Database {
    constructor(){
        this.connect();
    }
    connect(type = 'mongodb') {
        if(1===1){
            mongoose.set('debug', true);
            mongoose.set('debug', {color:true});
        }
        mongoose.connect( connectString,{
            maxPoolSize: 50,
        }).then( _ => console.log('Connect successfully Pro'))
       .catch( error => console.log(error) );
    }
    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database();
        }
    countConnect();
    return Database.instance
    }
}
const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;