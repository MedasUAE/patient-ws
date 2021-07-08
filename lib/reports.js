const fs = require('fs');
const PATH = require('../config/config').REPORT_FILE_PATH;
const log = require('./logger');
const request = require('request');

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


const getTestDetails = async (consult_id) => {
    const execParamQuery = require('./mysql').execParamQuery;
    const query = `SELECT office_id, dispatch_by, test_Detailsid, consult_id FROM test_details WHERE consult_id = ? AND dispatch_status = 'Y';`;
    return new Promise( (resolve, reject) => {
        execParamQuery(query, [consult_id])
            .then(result => {
                result[0].test_Detailsid = commmbineTestDetailsIds(result)
                resolve(result);
            })
            .catch(error => {
                log.error(error);
                resolve([])
            })
    });
}

function commmbineTestDetailsIds(result)  {
    return result.map(x => x.test_Detailsid).join(',')
}



const callReportAPIToGetReport = (consult_id, test_Detailsid, office_id, dispatch_by) => {
    const url = `http://46.151.211.36:8055/report/lab/generate?userId=${dispatch_by}&officeId=${office_id}&testDetailsIds=${test_Detailsid}&consultId=${consult_id}`
    log.debug("reports.js, Handlers: callReportAPIToGetReport URL: " + url);
    const options = {
            'method': 'GET',
            'url': url,
            'headers': {}
        };

        // REPONSE 
        // {
        //     "success": true,
        //     "message": null,
        //     "data": {
        //         "filePath": "D:\\MEDAS\\Eclinic_Documents\\labreports\\202105\\04\\20210504154152_302711_4100_114.pdf",
        //         "opNumber": "AF13-04639",
        //         "patientName": "MOHAMED IBRAHIM MOHAMED IBRAHIM",
        //         "mailTo": "",
        //         "patientMail": ""
        //     }
        // }
    return new Promise( (resolve,reject) => {
        request(options, function (error, response) {
            if (error) throw new Error(error);
            if(response.body){
                try {
                    const filesName = JSON.parse(response.body).data.filePath;
                    resolve(filesName);
                } catch (error) {
                    log.error(error);
                    resolve([]);
                }
                
            }
        });
    })

}

function prepareReportResponse(consult_id){
    return [{
        fileName: consult_id,
        reportName: "report-" + 1 + ".PDF"
    }]
}

report.reportV2Handler = async (req,res,next) => {
    log.debug("reports.js, Handlers: reportV2Handler");
    if(!req.params.consult_id) res.send(400, {error: "consult_id missing"});
    try {
        res.send(200, {data: prepareReportResponse(req.params.consult_id)});
    } catch (error) {
        log.error(error);
        res.send(400, {error: "No Data found"});
    }
    return next()
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

const fileDataV2 = (fileName) => {
    log.debug("reports.js, Handlers: fileData");
    if(!fileName) throw new Error("No file found in the directory");
    if(!fs.existsSync(fileName)) throw new Error("No file found in the directory");
    const fileData = fs.readFileSync(fileName);
    return fileData;
}

report.downloadFileV2 = async (req,res,next) => {
    log.debug("reports.js, Handlers: downloadFile");
    try {
        const result = await getTestDetails(req.params.fileName) //consult_id
        if(result.length){
            const {office_id, dispatch_by, test_Detailsid, consult_id} = result[0];
            const filePath = await callReportAPIToGetReport(consult_id, test_Detailsid, office_id, dispatch_by);
            console.log(filePath);
            res.setHeader('Content-Type', 'application/pdf');
            res.send(200, fileDataV2(filePath));
        } else res.send(400, {error: "No Data found"});
    } catch (error) {
        log.error(error);
        res.send(400, {error: "No Data found"});
    }
    return next();
}

//get the lab result pdf filename from attachment table
const getLabResultAttachment = async (consult_id) => {
    const execParamQuery = require('./mysql').execParamQuery;
    const query = `SELECT document_Filename FROM attacheddocuments WHERE consult_id = ? and document_Id = 'Lab';`;
    return new Promise( (resolve, reject) => {
        execParamQuery(query, [consult_id])
            .then(result => {
                result[0].test_Detailsid = commmbineTestDetailsIds(result)
                resolve(result);
            })
            .catch(error => {
                log.error(error);
                resolve([])
            })
    });
}

// File Name reading from attacheddocuments
report.downloadFileV3 = async (req,res,next) => {
    log.debug("reports.js, Handlers: downloadFile");
    try {
        const result = await getLabResultAttachment(req.params.fileName) //consult_id  --> returns filenames
        if(result.length){
            log.debug("reports.js, Handlers: downloadFileV3 fileName: " + result[0].document_Filename);
            res.setHeader('Content-Type', 'application/pdf');
            res.send(200, fileData(result[0].document_Filename));
        } else res.send(400, {error: "No Data found"});
    } catch (error) {
        log.error(error);
        res.send(400, {error: "No Data found"});
    }
    return next();
}
module.exports = report;