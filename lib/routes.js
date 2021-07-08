// const log = require('./logger');
const auth = require('./auth');
const consult = require('./consult');
const report = require('./reports');
const master = require('./master');
const mail = require('./mail');
const tele = require('./teleConsult');

module.exports = function (server, restify) {
    //login api
    server.post('/login', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: auth.loginV1Handler },
        { version: '2.0.0', handler: auth.loginV2Handler }
    ]));

    //get consult by op_number
    server.get('/consults/:op_number', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: consult.consultsV1Handler }
    ]));

    //get consultsummary by consult_id
    server.get('/consultsummary/:consult_id', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: consult.consultsummaryV1Handler }
    ]));

    //get myprofile by op_number
    server.get('/myprofile/:op_number', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: consult.profileV1Handler }
    ]));

    //get vitalsign by consult_id
    server.get('/vitalsigns/:consult_id', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: consult.vitalSignV1Handler }
    ]));

     //get consultmedicine by consult_id
     server.get('/prescription/:consult_id', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: consult.medicineV1Handler }
    ]));

    //get laborder by consult_id
    server.get('/laborder/:op_number', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: consult.labOrderV1Handler }
    ]));

    //get labresult by consult_id & test_id & office_id & profile_type as query param
    server.get('/labresult', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: consult.labResultV2Handler }
    ]));

    //get reportfile by consult_id
    server.get('/reportfiles/:consult_id', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: report.reportV2Handler }
    ]));

    //download reportfile by consult_id
    server.get('/downloadreport/:fileName', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: report.downloadFileV2 },
        { version: '2.0.0', handler: report.downloadFileV3 } //file name is consultID
    ]));

    //get doctors by office_id
    server.get('/doctors/:office_id', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: master.doctorV1Handler }
    ]));

    //get doctors 
    server.get('/doctors', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: master.doctorV1Handler }
    ]));

    //get insurar
    server.get('/insurars', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: master.insurarV1Handler }
    ]));

    //get aboutus
    server.get('/aboutus', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: master.aboutusV1Handler }
    ]));

    //get promotions
    server.get('/promotions', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: master.promotionV1Handler }
    ]));

    //get feedback
    server.get('/feedback', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: master.feedbackV1Handler }
    ]));

    //get locations
    server.get('/locations', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: master.locationV1Handler }
    ]));

    //get offices
    server.get('/offices', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: master.officesV1Handler }
    ]));

    //send apt request for opnumber and doctors
    server.get('/requestapt/:op_number/:doctors_id', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: consult.bookAppointmentV1Handler }
    ]));

    //send apt request for opnumber and doctors
    server.get('/requestapt', restify.plugins.conditionalHandler([
        { version: '2.0.0', handler: consult.bookAppointmentV2Handler }
    ]));

    //send doctorslot
    server.get('/doctorslot/:doctors_id/:fromdate/:todate', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: master.doctorSlotsV1Handler }
    ]));

    //service list
    server.get('/services/:office_id', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: master.servicesV1Handler },
        { version: '2.0.0', handler: master.servicesV2Handler }
    ]));

    //tele list
    server.get('/tele/:op_number/:apt_date', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: tele.getTodayList }
    ]));

    //tele list
    server.get('/tele/start/:consult_id', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: tele.getTeleUrl }
    ]));

    //latest consult ID
    server.get('/latestconsult/:op_number', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: consult.getLatestCosultID }
    ]));
}