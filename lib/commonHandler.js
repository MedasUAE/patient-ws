const log = require('./logger');
const handler = {};

/*
    commonHandler for all request to get record from DB and sending response 
    @params:    req: request object, 
                res: response object, 
                next: callback method, 
                query: DB to execute, 
                params: Filter params for the query
*/
handler.commonHandler = async function(req, res, next, query, params){
    const execParamQuery = require('./mysql').execParamQuery;
    log.info("commonHandler.js, Handlers: commonHandler " + query);
    try {
        //get result from db
        let result = await execParamQuery(query, params);  
        log.info("commonHandler.js, Handlers: commonHandler result: " + JSON.stringify(result));

        //if result present in 
        if(typeof result != "undefined") res.send(200, {data: result});
         //no data found in DB return 400 status code with error
         else res.send(400, {error: "No Data found"}); //ToDo Error Code
         //go to after handler
         return next();
    } catch (error) {
        log.error("master.js, Handlers: commonHandler " + error);
        //error when getting data from mysql DB
        res.send(400, {error: "No Data found"}); //ToDo Error Code
    }
    return next();
}

handler.version = (req, res, next) => {
    res.send(200, {data: "1.0"});
    return next();
}

handler.menus = (req, res, next) => {
    res.send(200, {data: {
        "menu": {
          "en": [
            {
              title: "Medical File",
              url: "/tab-pages/appointments",
              icon: "git-network-outline"
            },
            {
              title: "Profile",
              url: "/tab-pages/profile",
              icon: "person-outline"
            },
            {
              title: "Services",
              url: "/tab-pages/our-services",
              icon: "medkit-outline"
            },
            {
              title: "Insurance",
              url: "/tab-pages/insurances",
              icon: "umbrella-outline"
            },
            {
              title: "Contact Us",
              url: "/contact-us",
              icon: "call-outline"
            },
            {
              title: "English / Arabic",
              url: "/change-language",
              icon: "language-outline"
            }
          ],
          "ar": [
            {
              "title": "ملف طبي",
              "url": "/tab-pages/appointments",
              "icon": "git-network-outline"
            },
            {
              "title": "حساب تعريفي",
              "url": "/tab-pages/profile",
              "icon": "person-outline"
            },
            {
              title: "خدمات",
              url: "/tab-pages/our-services",
              icon: "medkit-outline"
            },
            {
              title: "تأمين",
              url: "/tab-pages/insurances",
              icon: "umbrella-outline"
            },
            {
              title: "اتصل بنا",
              url: "/contact-us",
              icon: "call-outline"
            },
            {
              title: "اللغة الإنجليزية أو العربية",
              url: "/change-language",
              icon: "language-outline"
            }
          ]
        },
        "homePageCards": {
          "en": [
            {
              "title": "Appointment",
              "button_title": "Get Started",
              "description": "Book your Appointment",
              "location": "",
              "icon": ""
            },
            {
              "title": "Medical File",
              "button_title": "View",
              "description": "My Medical File",
              "location": "",
              "icon": ""
            },
            {
              "title": "TeleMedicine",
              "button_title": "Get Started",
              "description": "Online Consultation with Doctor",
              "location": "",
              "icon": ""
            },
            {
              "title": "Payment",
              "button_title": "Get Started",
              "description": "Online Payment",
              "location": "",
              "icon": ""
            }
          ],
          "ar": [
            {
              "title": "موعد",
              "button_title": "البدء",
              "description": "احجز موعدك",
              "location": "",
              "icon": ""
            },
            {
              "title": "ملف طبي",
              "button_title": "عرض",
              "description": "ملفي الطبي",
              "location": "",
              "icon": ""
            },
            {
              "title": "الطب عن بعد",
              "button_title": "ابدأ",
              "description": "استشارة عبر الإنترنت مع طبيب",
              "location": "",
              "icon": ""
            },
            {
              "title": "الدفع",
              "button_title": "البدء",
              "description": "الدفع عبر الإنترنت",
              "location": "",
              "icon": ""
            }
          ]
        },
        "homePageTitle": {
          "en": [
            {
              "title": "Introducing Tele Medicine",
              "description": "Don’t delay your health concerns"
            }
          ],
          "ar": [
            {
              "title": "تقديم الطب عن بعد",
              "description": "لا تؤخر مخاوفك الصحية"
            }
          ]
        }
    }});
    return next();
}

module.exports = handler