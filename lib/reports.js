const fs = require('fs');
const PATH = require('../config/config').REPORT_FILE_PATH;
const log = require('./logger');

// report init
const report = {}

const findReportFile = (consult_id) => {
    log.debug("reports.js, Handlers: findReportFile");
    if(!PATH) throw new Error("Please check 'REPORT_FILE_PATH' attribute in the config file.");
    
    const files = fs.readdirSync(PATH);
    if(!Array.isArray(files)) throw new Error("No file found in the directory");
    return files.filter(file => {
        const consultId = file.substring(file.indexOf('_') + 1, file.indexOf('.'));
        return (consultId == consult_id)
    });
}

const fileReportPDFArray = (consult_id) => {
    log.debug("reports.js, Handlers: fileReportPDFArray");
    return findReportFile(consult_id).map((file,index) => {
        return {
            fileName: file,
            reportName: "report-" + (index + 1) + ".PDF"
        }
    });
}

report.reportV1Handler = async (req,res,next) => {
// report.reportV1Handler = (consult_id) => {
    log.debug("reports.js, Handlers: reportV1Handler");
    if(!req.params.consult_id) res.send(400, {error: "consult_id missing"});
    
    res.send(200, {data: fileReportPDFArray(req.params.consult_id)})
    return next();
}

module.exports = report;