const log = require('./logger');

const consult = {};

/*
    handler for get consults of the patient 
    @params: op_number
    version: v1
*/
consult.consultsV1Handler = async function(req,res,next) {
    log.debug("consult.js, Handlers: getConsultV1Handler");
    const consultQuery = require('./sql').consult;
    //if op_number not present
    if(!req.params.op_number) res.send(400, {error: "op number missing"});

    /* commonHandler to get patient consult from db 
        @params:    query: consultQuery.v1.query, 
                    params: [req.params.op_number]
    */
    return commonHandler(req,res,next,consultQuery.v1.query, [req.params.op_number]);
}

/*
    handler for vital signs of the patient 
    @params: consult_id
    version: v1
*/
consult.vitalSignV1Handler = async function(req,res,next) {
    log.debug("consult.js, Handlers: vitalSignV1Handler");
    const vitalQuery = require('./sql').vitalsign;
    if(!req.params.consult_id) res.send(400, {error: "consult_id missing"});
    /* commonHandler to get insurar from db 
        @params:    query: vitalQuery.v1.query, 
                    params: [req.params.consult_id]
    */
    return commonHandler(req,res,next,vitalQuery.v1.query, [req.params.consult_id]);
}

/*
    handler for lab result of the patient 
    @params: consult_id, office_id
    version: v1
*/
consult.labResultV1Handler = async function(req,res,next) {
    log.debug("consult.js, Handlers: labResultV1Handler");
    const labResultQuery = require('./sql').labresult;
    if(!req.params.consult_id && !req.params.office_id) res.send(400, {error: "consult_id/office_id missing"});

    /* commonHandler to get insurar from db 
        @params:    query: labResultQuery.v1.query, 
                    params: [req.params.consult_id, req.params.office_id]
    */
    return commonHandler(req,res,next,labResultQuery.v1.query, [req.params.consult_id, req.params.office_id]);  
}

/*
    handler for patient profile
    @params: op_number
    version: v1
*/
consult.profileV1Handler = async function(req,res,next) {
    log.debug("consult.js, Handlers: profileV1Handler");
    const myprofileQuery = require('./sql').myprofile;
    if(!req.params.op_number) res.send(400, {error: "op_number missing"});

    /* commonHandler to get insurar from db 
        @params:    query: labResultQuery.v1.query, 
                    params: [req.params.op_number, req.params.op_number] *two times need to pass
    */
    return commonHandler(req,res,next,myprofileQuery.v1.query, [req.params.op_number, req.params.op_number]);  
}

/*
    commonHandler for all request to get record from DB and sending response 
    @params:    req: request object, 
                res: response object, 
                next: callback method, 
                query: DB to execute, 
                params: Filter params for the query
*/
async function commonHandler(req, res, next, query, params){
    const execParamQuery = require('./mysql').execParamQuery;

    try {
        //get result from db
        let result = await execParamQuery(query, params);  

        //if no result from execParamQuery
        if(typeof result != "undefined") res.send(200, {data: result});
        //no data found in DB return 400 status code with error
        else res.send(400, {error: "No Data found"}); //ToDo Error Code
        //go to after handler
        return next();
    } catch (error) {
        log.error("consult.js, Handlers: commonHandler " + error);
        //error while getting data from mysql DB
        res.send(400, {error: "No Data found"}); //ToDo Error Code
    }
    return next();
}

module.exports = consult;