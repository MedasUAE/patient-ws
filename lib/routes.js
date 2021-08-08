// const log = require('./logger');
const auth = require('./auth');
const consult = require('./consult');
const report = require('./reports');
const master = require('./master'); 
const common = require('./commonHandler'); 

module.exports = function (server, restify) {
    //login api
    server.post('/v2/login', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: auth.loginV1Handler },
        { version: '2.0.0', handler: auth.loginV2Handler }
    ]));

    //get myprofile by op_number
    server.get('/v2/myprofile/:op_number', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: consult.profileV1Handler }
    ]));

    

    //get laborder by consult_id
    server.get('/v2/laborder/:op_number', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: consult.labOrderV1Handler }
    ]));

    //get labresult by consult_id & test_id & office_id & profile_type as query param
    // consult_id=646224&office_id=9&test_id=649&profile_type=N
    server.get('/v2/labresult', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: consult.labResultV2Handler }
    ]));

    //get reportfile by consult_id
    server.get('/v2/reportfiles/:consult_id', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: report.reportV2Handler }
    ]));

    //download reportfile by consult_id
    server.get('/v2/downloadreport/:fileName', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: report.downloadFileV2 },
        { version: '2.0.0', handler: report.downloadFileV3 }, //file name is consultID
        { version: '0.0.1', handler: report.downloadFile } //test API
    ]));

    
    //get insurar
    server.get('/v2/insurars', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: master.insurarV1Handler }
    ]));

    //get aboutus
    server.get('/v2/aboutus', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: master.aboutusV1Handler }
    ]));

    //get promotions
    server.get('/v2/promotions', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: master.promotionV1Handler }
    ]));

    //get feedback
    server.get('/v2/feedback', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: master.feedbackV1Handler }
    ]));

    //get locations
    server.get('/v2/locations', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: master.locationV1Handler }
    ]));

    //get offices
    server.get('/v2/offices', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: master.officesV1Handler }
    ]));
 
    //get latestversion
    server.get('/v2/latestversion', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: common.version }
    ]));

    //get latestversion
    server.get('/v2/menus', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: common.menus }
    ]));
}