'use strict';

const mongoose = require('mongoose');

const connectString = 'mongodb://localhost:27017/demo';
mongoose.connect(connectString).then(_ => {
    console.log(`Connecting to ${connectString} Successfully`);
}).catch( error => console.error(error) );

module.exports = mongoose