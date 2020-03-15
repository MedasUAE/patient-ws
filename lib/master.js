/* masters like Doctor, Insurance, Service, Location */
const log = require('./logger');
var fs = require('fs');

const PROMOTION_FILE_PATH = require('../config/config').PROMOTION_FILE_PATH;

//master init
const master = {};

/* get doctor list office and deparment */
master.doctorV1Handler = async function(req,res,next){
    log.debug("master.js, Handlers: doctorHandler");
    const doctorsQuery = require('./sql').doctors;

    /*  if office_id present 
            get doctors from the office 
        else ALL docotr list
    */
    if(req.params.office_id) {
        /* commonHandler to get doctors from db 
            @params:    query: doctorsQuery.v1.query, 
                        params: req.params.office_id
        */
        return commonHandler(req,res,next,doctorsQuery.v1.query, [req.params.office_id]); 
    } else{
        /* commonHandler to get ALL doctors from db 
            @params:    query: doctorsQuery.v2.query, 
                        params: none
        */
        return commonHandler(req,res,next,doctorsQuery.v2.query, []); 
    }

    
};

/*
    handler for doctorSlotsV1Handler
    @params: doctors_id, fromdate, todate
    version: v1
*/
master.doctorSlotsV1Handler = async function(req,res,next){
    log.debug("master.js, Handlers: doctorSlotsV1Handler");
    const doctorSlotQuery = require('./sql').doctors.v4.query;
    if(!req.params.doctors_id) {res.send(400, {error: "docotrs_id missing"});return next();}
    if(!req.params.fromdate) {res.send(400, {error: "fromdate missing"});return next();}
    if(!req.params.todate) {res.send(400, {error: "todate missing"});return next();}
    
    /*  commonHandler to get doctor slot from db 
        @params:    query: doctors.v4.query, 
                    params: doctors_id, fromdate, todate
    */
    return commonHandler(req,res,next,doctorSlotQuery, [req.params.doctors_id, req.params.fromdate, req.params.todate]);  
};

/* get insurar list by office */
master.insurarV1Handler = function(req,res,next){
    log.debug("master.js, Handlers: insurarV1Handler");
    const insurarQuery = require('./sql').insurar;

    /*  commonHandler to get insurar from db 
        @params:    query: insurarQuery.v1.query, 
                    params: None
    */
    return commonHandler(req,res,next,insurarQuery.v1.query, []);  
};

/* get insurar list by office */
master.servicesV1Handler = function(req,res,next){
    log.debug("master.js, Handlers: servicesV1Handler");
    console.log(req.query);
    let type  = req.query.type; //type = service || profile

    if(!type) type = 'service'
    // get data from service.json file
    try {
        let result = []
        if(type == 'service')
            result = JSON.parse(fs.readFileSync('./data/service.json', 'utf8'));
        else if(type == 'profile')
            result = JSON.parse(fs.readFileSync('./data/profile.json', 'utf8'));
        
        res.send(200, {data: result});
        //go to after handler
        return next();
    } catch (error) {
        console.log(error);
        res.send(400, {error: "No Data found"}); //ToDo Error Code
        //go to after handler
        return next();
    }
    
};

/* get about us  */
master.aboutusV1Handler = function(req,res,next){
    log.debug("master.js, Handlers: aboutusV1Handler");
    // get data from service.json file
    try {
        var aboutus = JSON.parse(fs.readFileSync('./data/aboutus.json', 'utf8'));
        res.send(200, {data: aboutus});
        //go to after handler
        return next();
    } catch (error) {
        log.error("master.js, Handlers: aboutusV1Handler" + error);
        res.send(400, {error: "No Data found"}); //ToDo Error Code
        //go to after handler
        return next();
    }
    
};

/* get location  */
master.locationV1Handler = function(req,res,next){
    log.debug("master.js, Handlers: locationV1Handler");
    // get data from service.json file
    try {
        var locations = JSON.parse(fs.readFileSync('./data/locations.json', 'utf8'));
        res.send(200, {data: locations});
        //go to after handler
        return next();
    } catch (error) {
        log.error("master.js, Handlers: locationV1Handler" + error);
        res.send(400, {error: "No Data found"}); //ToDo Error Code
        //go to after handler
        return next();
    }
    
};

/* get promotions  */
master.promotionV1Handler = function(req,res,next){
    log.debug("master.js, Handlers: promotionV1Handler");
    // get data from service.json file
    try {
        var promotions = getPromotions()
        res.send(200, {data: promotions});
        //go to after handler
        return next();
    } catch (error) {
        log.error("master.js, Handlers: promotionV1Handler" + error);
        res.send(400, {error: "No Data found"}); //ToDo Error Code
        //go to after handler
        return next();
    }
    
};

function getPromotions(){
    log.debug("master.js, Handlers: getPromotions");
    const files = readAllFiles(PROMOTION_FILE_PATH);
    return base64Array(files);
}

// Returning all file names from given path
function readAllFiles(PATH){
    log.debug("master.js, Handlers: readAllFiles");
    if(!PATH) throw new Error("Please check 'PROMOTION_FILE_PATH' attribute in the config file.");
    return fs.readdirSync(PATH);
}

function base64Array(files){
    log.debug("master.js, Handlers: base64Array");
    if(!Array.isArray(files)) throw new Error("Promotions files not found.");
    return files.map((file) => {
        const prefix = "data:image/" + getFileType(file) + ";base64,";
        const binary = fs.readFileSync(PROMOTION_FILE_PATH + "/" + file);
        const base64 = new Buffer(binary).toString('base64');
        return prefix + base64;
    })
}

function getFileType(filename){
    if(!filename) return;
    return filename.substr(filename.indexOf(".")+1,filename.length)
    //console.log(filename);
}

/**
 * Feedback API
 */

 master.feedbackV1Handler = function(req,res,next) {
    log.debug("master.js, Handlers: feedback");
    const { patient_name, mobile, rating, comments, office_id } = req.query;

    if(!office_id) {res.send(400, {error: "office_id missing"});return next();}
    
    try {
        
        // mail subject
        const subject = "Feedback from " + patient_name;
        //mail body
        const body = `
            <h3>Dear Manager,</h3>
            <p>There is an feedback from</p>
            <p>Name:&nbsp; ${patient_name}</p>
            <p>Mobile:&nbsp; ${mobile}</p>
            <p>Rating:&nbsp; ${rating}</p>
            <p>Comment:&nbsp; ${comments}</p>
            <blockquote>
                <p><em>This request is generated from the mobile app user</em></p>
            </blockquote>`;
        
        // const mail = require('./mail').sendMail;
        // mail(null,subject,body);
        const mail = require('./mail').sendMailByAPI;
        mail(subject, body, office_id, null);
        res.send(200, {data: "Thank you for the feedback. We will connect soon."});
        return next();

    } catch (error) {
        log.error("consult.js, Handlers: feedbackV1Handler: " + error);
        res.send(400, {error: "Something went wrong. Please call clinic"});
        return next();
    }
    
 }

/*
    handler to get all offices [branch] 
    @params:    req: request object, 
                res: response object, 
                next: callback method, 
    version:    v1
*/
master.officesV1Handler = function(req,res,next){
    log.debug("master.js, Handlers: insurarV1Handler");
    const officeQuery = require('./sql').offices;

    /* commonHandler to get offices from db 
        @params:    query: insurarQuery.v1.query, 
                    params: None
    */
    return commonHandler(req,res,next,officeQuery.v1.query, []);  
};

/*
    commonHandler for all request to get record from DB and sendi ng response 
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

        //if result present in 
        if(typeof result != "undefined") res.send(200, {data: result});
         //no data found in DB return 400 status code with error
         else res.send(400, {error: "No Data found"}); //ToDo Error Code
         //go to after handler
         return next();
    } catch (error) {
        log.error("master.js, Handlers: commonHandler " + error);
        //error when getting data from mysql DB
        res.send(400, {error: "No Data found"}); //ToDo Error Code
    }
    return next();
}

module.exports = master