const log = require('./logger');
const cH = require('./commonHandler')

const teleConsult = {};

teleConsult.getTodayList = (req, res, next) => {
    log.debug("teleConsult.js, Handlers: getTodayList");
    const appointQuery = require('./sql').appointment;
    //if op_number not present
    if(!req.params.op_number) res.send(400, {error: "op number missing"});

    /* commonHandler to get patient tele appointment from db 
        @params:    query: appointment.v1.query, 
                    params: [req.params.op_number]
    */
    return cH.commonHandler(req,res,next,appointQuery.v1.query, [req.params.op_number, req.params.apt_date]);
}

teleConsult.getTeleUrl = (req, res, next) => {
    log.debug("teleConsult.js, Handlers: getTeleUrl");
    const teleQuery = require('./sql').tele;
    //if consult_id not present
    if(!req.params.consult_id) res.send(400, {error: "consult_id missing"});

    /* commonHandler to get patient tele url from db 
        @params:    query: teleQuery.v1.query, 
                    params: [req.params.consult_id]
    */
    return cH.commonHandler(req,res,next,teleQuery.v1.query, [req.params.consult_id]);
}

module.exports = teleConsult;