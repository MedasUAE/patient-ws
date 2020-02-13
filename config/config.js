module.exports = {
    name: "patientAPI",
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000,
    loglevel: "all", //debug, info, error, all , off
    showconsole: true, //true,false
    db:{
        host: process.env.DB_HOST || '192.168.0.20',
        user: process.env.DB_USER || 'root',
        password : process.env.DB_PSW || 'medteam2013',
        port : process.env.DB_PORT || 3306, //port mysql
        database:process.env.DB_NAME || 'eclinic_daweni_p1'
    },
    mail: {
        clientId: "daweni",
        url: "http://40.123.209.214:8010/v1/notification",
        toMailId: "appointment@daweni.com.sa"
    }
}