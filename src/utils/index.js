`use strict`

const  _ = require('lodash');
const {Types} = require('mongoose');
const getInfoData =({fileds= [],object = {}})=>{
    return _.pick(object,fileds); 
}
const getSelectData = (select =[]) =>{
    return Object.fromEntries(select.map(el => [el,1]))
}
const ungetSelectData = (select =[]) =>{
    return Object.fromEntries(select.map(el => [el,0]))
}
const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(key => {
        if ( obj[key] === null || obj[key] === undefined ){
            delete obj[key];
        }
    })
    return obj
}

const convertToObjectIdMongodb = id =>{
    return new Types.ObjectId(id);
}
const updateNestedObjectParser = obj => {
    console.log(`[0]:: ${obj}`);
    const final = {};
    Object.keys(obj).forEach(key => {
        if ( obj[key] === null || obj[key] === undefined ){
            delete obj[key];
        }else if(typeof obj[key] === 'object' && !Array.isArray(obj[key])){
            const response = updateNestedObjectParser(obj[key]);
            Object.keys(response).forEach(a => {
                final[`${key}.${a}`] = response[a];
            });
        }else{
            final[key] = obj[key];
        }
    })
    console.log(`[1]:: ${final}`);
    return final;
}
module.exports = {
    getInfoData,
    getSelectData,
    ungetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongodb
}