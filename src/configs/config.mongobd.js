'use strict';

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3000 
    },
    db: {
        user: process.env.DEV_USER || 'mongoadmin',
        pass: process.env.DEV_PASS || 'mongoadmin',
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'development'
    }
};

const pro = {
    app: {
        port: process.env.PRO_APP_PORT || 3000 
    },
    db: {
        user: process.env.DEV_USER || 'mongoadmin',
        pass: process.env.DEV_PASS || 'mongoadmin',
        host: process.env.PRO_DB_HOST || 'localhost', 
        port: process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || 'production' 
    }
};

const config = { dev, pro };

const env = process.env.NODE_ENV || 'dev';

module.exports = config[env];
