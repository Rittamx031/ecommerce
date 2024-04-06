'use strict';
const {findById} = require('../services/apikey.service');
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}

const apikey = async (req,res,next) =>{
    try{
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(403).json({
                message: 'Forbidden Errors'
            })
        }
        // check objkey
        const objkey = await findById(key)

        if(!objkey){
            return res.status(403).json({
                message: 'Forbidden Errors'
            })
        }

        req.objkey = objkey
        return next();
    }catch(e){
        console.log(e);
    }
}

const permission = ( permission) => {
    return (req,res,next) => {
        if(!req.objkey.permissions){
            return res.status(403).json({
                message: 'Permission denied'
            })
        }
        console.log(req.objkey.permissions);
        const validPermissions = req.objkey.permissions.includes(permission)

        if(!validPermissions){
            return res.status(403).json({
                message: 'Permission denied'
            })
        }
        return next();
    }
}
module.exports = {
    apikey,
    permission,
};