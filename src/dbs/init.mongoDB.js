'use strict';

const mongoose = require('mongoose');

const connectString = 'mongodb://localhost:27017/demo';
class Database{
    constructor(){
        this.connect();
    }
    connect(){
        if (1=== 1){
            mongoose.set('debug', true);
            mongoose.set('debug', {color:true});
        }
        mongoose.connect( connectString).then( _ => console.log('Connect successfully pro'))
        .catch( error => console.log(error) );
    }
    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
const instanceDatabase = Database.getInstance();
module.exports = instanceDatabase;