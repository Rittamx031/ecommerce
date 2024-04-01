'use strict';

const mongoose = require('mongoose');

const connectString = `mongodb://localhost:27017/demo`
mongoose.connect( connectString).then( _ => console.log('Connect successfully'))
.catch( error => console.log(error) );

// dev
if(1===0){
    mongoose.set('debug', true);
    mongoose.set('debug', {color:true});
}
module.exports = mongoose;