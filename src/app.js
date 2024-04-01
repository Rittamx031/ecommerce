const express = require('express')
const app = express();
const {default: helmet} =require('helmet')
const morgan = require('morgan')
const compression = require('compression')
require('./dbs/init.mongoDB')
// export
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());

app.get('/', (req, res) =>{
    const str = "String Path"
    return res.status(200).json({
        message: "OK",
        metadata: str.repeat(1000)
    }
    )
});
module.exports = app;