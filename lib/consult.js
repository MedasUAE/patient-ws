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
    handler for get consultsummary of the patient 
    @params: consult_id
    version: v1
*/
consult.consultsummaryV1Handler = async function(req,res,next) {
    log.debug("consult.js, Handlers: consultsummaryV1Handler");
    const diagnosisQuery = require('./sql').diagnosis.v1.query;
    const complaintQuery = require('./sql').complaint.v1.query;
    //if op_number not present
    if(!req.params.consult_id) res.send(400, {error: "consult_id missing"});

    /* get patient consult from db 
        @params:    query: diagnosisQuery, 
                    params: [req.params.consult_id]
    */
    const execParamQuery = require('./mysql').execParamQuery;
    try {
        //get result from db
        let diagnosisResult = await execParamQuery(diagnosisQuery, [req.params.consult_id]);  
        let complaintResult = await execParamQuery(complaintQuery, [req.params.consult_id]);  

        //if no result from execParamQuery
        if(typeof diagnosisResult != "undefined" && typeof complaintResult != "undefined") res.send(200, {data: { diagnosisResult, complaintResult }});
        //no data found in DB return 400 status code with error
        else res.send(400, {error: "No Data found"}); //ToDo Error Code
        //go to after handler
        return next();
    } catch (error) {
        log.error("consult.js, Handlers: consultsummaryV1Handler " + error);
        //error while getting data from mysql DB
        res.send(400, {error: "No Data found"}); //ToDo Error Code
    }
    return next();

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
    handler for cinsultation medicine of the patient 
    @params: consult_id
    version: v1
*/
consult.medicineV1Handler = async function(req,res,next) {
    log.debug("consult.js, Handlers: medicineV1Handler");
    const medicineQuery = require('./sql').medicine;
    if(!req.params.consult_id) res.send(400, {error: "consult_id missing"});
    /* commonHandler to get insurar from db 
        @params:    query: medicineQuery.v1.query, 
                    params: [req.params.consult_id]
    */
    return commonHandler(req,res,next,medicineQuery.v1.query, [req.params.consult_id]);
}

/*
    handler for labOrder of the patient 
    @params: consult_id
    version: v1
*/
consult.labOrderV1Handler = async function(req,res,next) {
    log.debug("consult.js, Handlers: labOrderV1Handler");
    const labOrderQuery = require('./sql').laborder;
    if(!req.params.consult_id) res.send(400, {error: "consult_id missing"});
    /* commonHandler to get insurar from db 
        @params:    query: medicineQuery.v1.query, 
                    params: [req.params.consult_id]
    */
    return commonHandler(req,res,next,labOrderQuery.v1.query, [req.params.consult_id]);
}

/*
    handler for lab result of the patient 
    @params: consult_id, office_id
    version: v1
*/
consult.labResultV1Handler = async function(req,res,next) {
    log.debug("consult.js, Handlers: labResultV1Handler");
    const labQuery = require('./sql').labresult.v1.query;
    const radiologyQuery = require('./sql').radiology.v1.query;
    if(!req.params.consult_id && !req.params.office_id) res.send(400, {error: "consult_id/office_id missing"});

    /* commonHandler to get insurar from db 
        @params:    query: labResultQuery.v1.query, 
                    params: [req.params.consult_id, req.params.office_id]
    */
    //return commonHandler(req,res,next,labResultQuery.v1.query, [req.params.consult_id, req.params.office_id]);
    
    const execParamQuery = require('./mysql').execParamQuery;
    try {
        //get result from db
        let labResult = await execParamQuery(labQuery, [req.params.consult_id, req.params.office_id]);  
        let radiologyResult = await execParamQuery(radiologyQuery, [req.params.consult_id]);  

        //if no result from execParamQuery
        if(typeof labResult != "undefined" && typeof radiologyResult != "undefined") res.send(200, {data: { labResult, radiologyResult }});
        //no data found in DB return 400 status code with error
        else res.send(400, {error: "No Data found"}); //ToDo Error Code
        //go to after handler
        return next();
    } catch (error) {
        log.error("consult.js, Handlers: labResultV1Handler " + error);
        //error while getting data from mysql DB
        res.send(400, {error: "No Data found"}); //ToDo Error Code
    }
    return next();

}

/*
    handler for lab result of the patient 
    @params: consult_id, test_id, office_id
    version: v2
*/
consult.labResultV2Handler = async function(req,res,next) {
    log.debug("consult.js, Handlers: labResultV2Handler");
    const { consult_id, test_id, office_id, profile_type} = req.query 
    const labQuery = require('./sql').labresult.v2.query;
    const radiologyQuery = require('./sql').radiology.v1.query;
    if(!consult_id && !test_id && !office_id && !profile_type) res.send(400, {error: "consult_id/test_id/office_id/profile_type missing"});

    /* commonHandler to get insurar from db 
        @params:    query: labResultQuery.v2.query, 
                    params: [req.params.consult_id, req.params.test_id]
    */
    //return commonHandler(req,res,next,labResultQuery.v1.query, [req.params.consult_id, req.params.test_id]);
    
    const execParamQuery = require('./mysql').execParamQuery;
    try {
        //get result from db
        let labResult = await execParamQuery(labQuery, [consult_id, test_id, office_id]);  
        let radiologyResult = await execParamQuery(radiologyQuery, [req.params.consult_id]);  

        //if no result from execParamQuery
        if(typeof labResult != "undefined" && typeof radiologyResult != "undefined") res.send(200, {data: { labResult, radiologyResult }});
        //no data found in DB return 400 status code with error
        else res.send(400, {error: "No Data found"}); //ToDo Error Code
        //go to after handler
        return next();
    } catch (error) {
        log.error("consult.js, Handlers: labResultV1Handler " + error);
        //error while getting data from mysql DB
        res.send(400, {error: "No Data found"}); //ToDo Error Code
    }
    return next();

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
    handler for bookAppointment
    @params: op_number, doctors_id
    version: v1
*/
consult.bookAppointmentV1Handler = async function(req,res,next) {
    log.debug("consult.js, Handlers: bookAppointmentV1Handler");
    const execParamQuery = require('./mysql').execParamQuery;
    if(!req.params.op_number) {res.send(400, {error: "op_number missing"});return next();}
    if(!req.params.doctors_id) {res.send(400, {error: "doctors_id missing"});return next();}
    let doctorProfile, patientProfile;
    try {
        //doctor v3 query
        log.debug("consult.js, Handlers: bookAppointmentV1Handler, getting doctor profile");
        const doctorsQuery = require('./sql').doctors.v3.query;
        doctorProfile = await execParamQuery(doctorsQuery, [req.params.doctors_id]);
        
        //patient v1 query
        log.debug("consult.js, Handlers: bookAppointmentV1Handler, getting patient profile");
        const myprofileQuery = require('./sql').myprofile.v1.query;
        patientProfile = await execParamQuery(myprofileQuery, [req.params.op_number, req.params.op_number]);

        if(!patientProfile.length) {
            log.error("consult.js, Handlers: bookAppointmentV1Handler: No patient data found for:" + req.params.op_number);
            res.send(400, {error: "no patient data found"});
            return next();
        }

        // mail subject
        const subject = "Appointment request from " + patientProfile[0].patient_name;
        //mail body
        const body = `
            <h3>Dear Manager,</h3>
            <p>There is an appointment request from the following patient:</p>
            <p>Name:&nbsp; ${patientProfile[0].patient_name}</p>
            <p>Mobile:&nbsp; ${patientProfile[0].mobile}</p>
            <p>Email:&nbsp; ${(patientProfile[0].email) ? patientProfile[0].email : '-'}</p>
            <p>MRN:&nbsp; ${patientProfile[0].op_number}</p>
            <p>Doctor:&nbsp; ${doctorProfile[0].doctors_name}</p>
            <blockquote>
                <p><em>This request is generated from the mobile app user</em></p>
            </blockquote>`;
        const mail = require('./mail').sendMail;
        mail(null,subject,body);
        res.send(200, {data: "We will connect you for confirmation."});
        return next();

    } catch (error) {
        log.error("consult.js, Handlers: bookAppointmentV1Handler: " + error);
        res.send(400, {error: "Something went wrong. Please call clinic"});
        return next();
    }
}

/*
    handler for bookAppointment
    @params: patient_name, doctors_id, mobile
    version: v2
*/
consult.bookAppointmentV2Handler = async function(req,res,next) {
    log.debug("consult.js, Handlers: bookAppointmentV2Handler");
    const { patient_name, doctors_id, mobile, office_id } = req.query;
    const execParamQuery = require('./mysql').execParamQuery;
    if(!patient_name) {res.send(400, {error: "patient_name missing"});return next();}
    if(!doctors_id) {res.send(400, {error: "doctors_id missing"});return next();}
    if(!mobile) {res.send(400, {error: "mobile missing"});return next();}
    if(!office_id) {res.send(400, {error: "office_id missing"});return next();}
    
    try {
        //doctor v3 query
        log.debug("consult.js, Handlers: bookAppointmentV2Handler, getting doctor profile");
        const doctorsQuery = require('./sql').doctors.v3.query;
        const doctorsProfile = await execParamQuery(doctorsQuery, [doctors_id]);
        if(!doctorsProfile.length) {res.send(400, {error: "mobile missing"});return next();}

        // mail subject
        const subject = "Appointment request from " + patient_name;
        //mail body
        const body = `
            <h3>Dear Manager,</h3>
            <p>There is an appointment request from the following patient:</p>
            <p>Name:&nbsp; ${patient_name}</p>
            <p>Mobile:&nbsp; ${mobile}</p>
            <p>Doctor:&nbsp; ${doctorsProfile[0].doctors_name}</p>
            <blockquote>
                <p><em>This request is generated from the mobile app user</em></p>
            </blockquote>`;
        
        // const mail = require('./mail').sendMail;
        // mail(null,subject,body);
        const mail = require('./mail').sendMailByAPI;
        mail(subject, body, office_id, null);
        res.send(200, {data: "We will connect you for confirmation."});
        return next();

    } catch (error) {
        log.error("consult.js, Handlers: bookAppointmentV2Handler: " + error);
        res.send(400, {error: "Something went wrong. Please call clinic"});
        return next();
    }
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
        res.send(400, {error: "No Data found 8"}); //ToDo Error Code
    }
    return next();
}

module.exports = consult;