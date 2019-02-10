module.exports = {
    name: "patientAPI",
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000,
    loglevel: "all", //debug, info, error, all , off
    showconsole: true, //true,false
    db:{
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password : process.env.DB_PSW || 'medteam2013',
        port : process.env.DB_PORT || 3306, //port mysql
        database:process.env.DB_NAME || 'eclinic_samc'
    }
}