'use strict';
const express = require('express');
const route = express.Router();
route.use("/v1/api", require('./access'))
// route.get('', (req, res) => {
//     return res.status(200).json({
//         message: "Wellcom tips javascript",
//     });
// })
module.exports = route