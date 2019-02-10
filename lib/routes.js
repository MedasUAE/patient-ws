// const log = require('./logger');
const auth = require('./auth');
const consult = require('./consult');
const master = require('./master');
const mail = require('./mail');

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

    //get myprofile by op_number
    server.get('/myprofile/:op_number', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: consult.profileV1Handler }
    ]));

    //get vitalsign by consult_id
    server.get('/vitalsigns/:consult_id', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: consult.vitalSignV1Handler }
    ]));

    //get labresult by consult_id & office_id
    server.get('/labresult/:consult_id/:office_id', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: consult.labResultV1Handler }
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

    //get offices
    server.get('/offices', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: master.officesV1Handler }
    ]));

    //send apt request for opnumber and doctors
    server.get('/requestapt/:op_number/:doctors_id', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: consult.bookAppointmentV1Handler }
    ]));

    //send doctorslot
    server.get('/doctorslot/:doctors_id/:fromdate/:todate', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: master.doctorSlotsV1Handler }
    ]));
}