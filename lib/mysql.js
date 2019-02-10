const mysql = require('mysql');
const log = require('./logger');
const dbConfig = require('../config/config').db;

const mysqlDB = {};

mysqlDB.init = function(){
    let db = mysql.createConnection(dbConfig);
    db.connect((err)=>{
        if(err) {
            log.error("mysql connection lost: " + err);
            return;
            // write re connection logic
        }
        log.info("DB '" + dbConfig.database + "' Connected.");
    });
    return db;
}

mysqlDB.execQuery = function(query, next){
    if(!query) return next("No query");
    log.debug(query);
    _mysqldb.query(query, (err, result)=>{
        if(err) return next(err);
        return next(null,result);
    })
}

mysqlDB.execParamQuery = function(query, params){
    log.debug(`mysql.js, function: execParamQuery, 
                Query: ${query} 
                Params:  ${params}`);
    return new Promise((resolve,reject)=>{
        _mysqldb.query(query, params,(err, result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

module.exports = mysqlDB;