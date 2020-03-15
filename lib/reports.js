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
    log.debug("reports.js, Handlers: reportV1Handler");
    if(!req.params.consult_id) res.send(400, {error: "consult_id missing"});
    try {
        res.send(200, {data: fileReportPDFArray(req.params.consult_id)})
    } catch (error) {
        log.error(error);
        res.send(400, {error: "No Data found"});
    }
    return next()
}

const fileData = (fileName) => {
    log.debug("reports.js, Handlers: fileData");
    if(!fileName) throw new Error("No file found in the directory");

    const fileData = fs.readFileSync(PATH +"/"+ fileName);
    return fileData;
}

report.downloadFile = (req,res,next) => {
    log.debug("reports.js, Handlers: downloadFile");
    try {
        res.setHeader('Content-Type', 'application/pdf');
        res.send(200, fileData(req.params.fileName));
    } catch (error) {
        log.error(error);
        res.send(400, {error: "No Data found"});
    }
    return next();
}

module.exports = report;