var nodemailer = require('nodemailer');
var mailConfig = require('../config/config').mail;
const request = require('request');
const log = require('./logger');

let mail = {};

/*
    function to Send mail
    @params: 
        toMails: xyz@abc.com,123@abc.com
        subject: mail subject
        body: mail body

*/
mail.sendMail = function(toMails,subject,body){
    // toMails = "talatm02@gmail.com";
    // subject = "TEST";
    // body = "TEST BODY";
    if(!toMails) toMails = mailConfig.to;
    const mailOptions = {
        from:mailConfig.from, // sender address
        to:toMails, // list of receivers
        subject: subject, // Subject line
        html:body
    }; 
	
	const transportOptions = {
        host: mailConfig.host,
        port: mailConfig.emailPort,
        secure: true,
        auth: {
            user: mailConfig.username, // sender address
            pass: mailConfig.pass
        }
    }
    
	//console.log(transportOptions);
    const transporter = nodemailer.createTransport(transportOptions);
    transporter.sendMail(mailOptions, (err, result) => {
        if (err) return log.error("mail.js, Handlers: sendMail " + err);
        return log.debug("sent mail successfully: " + toMails);
    });
}


mail.sendMailByAPI = (subject, body, toEmailID, officeId, referId) => {
    //client id is from the common API to send email
    if(!mailConfig.clientId) throw new Error("mail.clintId missing. Please check it.");
    if(!mailConfig.url) throw new Error("mail.url missing. Please check it.");
    if(!toEmailID) throw new Error("to mail ID missing. please check send mail id");
    if(!subject) throw new Error("to subject missing. please check send subject");
    if(!body) throw new Error("to body missing. please check send body");

    if(!referId) referId = Date.now();

    const postData = {
        "branchId": officeId,
        "clientId": mailConfig.clientId,
        "currentTime": new Date().toISOString(),
        "instant": "Y",
        "notificationId": toEmailID,
        "notificationSubject": subject,
        "notificationTemplate": body,
        "notificationTime": new Date().toISOString(),
        "notificationType": "email",
        "referId": 1,
        "referType": "app"
      }
    if(!postData)
    request.post(mailConfig.url, postData,(error, res, body) => {
        if (error) {
          log.error("mail.js, Handlers: sendMailByAPI " + error)
          return
        }
        log.info("mail.js, Handlers: sendMailByAPI, statusCode:" + res.statusCode)
      })
      
}

module.exports = mail;