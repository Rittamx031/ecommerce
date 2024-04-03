require("dotenv").config();
const express = require('express');
const {default: helmet} = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const app = express();
// init middleware
// morgan.middleware
// app.use(morgan('dev'));
app.use(morgan('tiny'));
// app.use(morgan('common'));
// app.use(morgan('short'));
// app.use(morgan('dev'));
// helmet.middleware
app.use(helmet());
// compression.middleware
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// init db
require('./dbs/init.mongoDB')
// const { checkOverload } = require('./helpers/check.connect');
// checkOverload();
// init routes
app.use('/', require('./routes'));
// handing error messages


module.exports = app