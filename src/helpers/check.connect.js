'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000;
// count connect
const countConnect = () =>{
    const numConnections = mongoose.connections.length;
    console.log(`Number of connections: ${numConnections}`);
}
// check overload connect
const checkOverload = () =>{
    setInterval(() =>{
        const numConnections = mongoose.connections.length;
        const numcor = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Example maximun number of connections based on number ofsf cores
        const maxConnections = numcor * 5;
        console.log(`Memory usage: ${memoryUsage/1024/1024} MB`)
        console.log(`Active connections: ${numConnections}`);
        if(numConnections > maxConnections){
            console.log(`Number of connections: ${numConnections}`);
            console.log(`Max number of connections: ${maxConnections}`);
            console.log(`Memory usage: ${memoryUsage}`);
            // notify.send(....)
        }
    }, _SECONDS ); // monitor every 5 seconds
}
module.exports =  {
    countConnect,
    checkOverload
}

