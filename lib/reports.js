const fs = require('fs');
const PATH = require('../config/config').REPORT_FILE_PATH;

// report init
const report = {}

const findReportFile = (consult_id) => {
    if(!PATH) throw new Error("Please check 'REPORT_FILE_PATH' attribute in the config file.");
    
    const files = fs.readdirSync(PATH);
    if(!Array.isArray(files)) throw new Error("No file found in the directory");
    return files.filter(file => {
        const consultId = file.substring(file.indexOf('_') + 1, file.indexOf('.'));
        return (consultId == consult_id)
    });
}

report.fileReportPDFArray = (consult_id) => {
    return findReportFile(consult_id).map((file,index) => {
        return {
            fileName: file,
            reportName: "report" + index + ".PDF"
        }
    });
}

module.exports = report;