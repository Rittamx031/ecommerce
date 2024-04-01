const express = require('express');
const {default: helmet} = require('helmet');
const app = express();
const morgan = require('morgan');
const compression = require('compression');
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

// init db
require('./dbs/init.mongoDB')
// const { checkOverload } = require('./helpers/check.connect');
// checkOverload();
// init routes
app.get('/', (req, res) => {
    const srt = "that cowws"
    return res.status(200).json({
        message: "OK",
        metadata: srt.repeat(10000)
    });
})
// handing error messages


module.exports = app