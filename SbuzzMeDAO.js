var ONLINE_STATUS = "online";
var OFFLINE_STATUS = "offline";
var UNREGISTER_STATUS = "unregister";
var UNKNOW_STATUS = "unknow";
var logger = require('./log.js');
// Base de datos temporal, posiblemente luego si esta establecido guarde el socket o offline si esta desctivada
// Problemas paises
var db = new Object();
db['(+34) 653264427'] = new Object();
//db['(+34) 653264427'].privateKey = new Object()
db['(+34) 653264427'].privateKey = "-----BEGIN RSA PRIVATE KEY-----\n"+
                                           "MIIEowIBAAKCAQEA8eHtIWugOA0Fg1rvgFvnKwKgluqWptNn75Pb0gSxD/xhpIza\n"+
                                           "IbXkyDDww73X4TF07hYwg6gHG469riQpqL8r6YjNpLmSrgyMCVmpPqgxe3T8/8TX\n"+
                                           "Rj6Jkl8H5gOR/vsJyjmslKceiGBf7o7lgah86CAQQi7tnpjTi/Xpz9EvUeNpF6vy\n"+
                                           "GYAv831iAHaEdKiJZKjImMvitjIznMyUHNMhKazUEFnrS02DprKvZjUm+lk/bvBd\n"+
                                           "xQJ0dqQKU7OTGMqWB8uhgLAAvnsYzFHj7u1YoL+2LOsrhIit7xlxl2w2wO4xELi5\n"+
                                           "K76cvhGXU1gXsrgbJsei1+sZYQgoXUTltD/Y1wIDAQABAoIBADE9GYWNIC9ozy9/\n"+
                                           "KnQJwVQrE7/E/2f0bxsBEWV+WQD1EndpyNnF6k2qUMi386M+6xuwXq3eXZwJgala\n"+
                                           "aTSVvf2rQJmAwVA286bPnrlHidMk7H+wdVYyUtT+DWCQZ37tYX/OH8ifAIMogz7P\n"+
                                           "zf6H6u1h4Y1nei2n1KCQLcmFPsm/SQU2u1I6ZfrLpvwRcebtL1qvLipQg4BkvuxA\n"+
                                           "WTTIA3Bv36Wz422I7R2Sgz7nsUW7sEGPWACeKUxFidqh2m8RaGhCx7yWS4HtGoRI\n"+
                                           "ffH6WT9YS5m++HJhb6ce2R6sxYC+GWLdAQd4Xfuvd9IeTEInVCBf9WCwwG0tQyQK\n"+
                                           "yuqYL/ECgYEA/tacRnuVRYxY4Cxx981aFVPB5RhqKma34ZNY41qW68qTbdi+YdCW\n"+
                                           "5RlHWnOacg8l49Ud0PWM0N55XYyZ+fxYynQCA1FFHoDUHybUlsKBCH58YZgJ8vVF\n"+
                                           "FYqudtkKClDOUm5t9+Zr0aU6hZM3/f916yKiqp/qDIgwAPaClo91SH8CgYEA8vwy\n"+
                                           "X3nPM+mAFMNzDyt1jhujMWFIViQ4nIJlD0f1eUXIcH3PSYOv3x0dBnAGS7xhWp4S\n"+
                                           "JpKDIWh8OcF7tcMB/b5dQgN5Y4gmuhDj0t+L5MvwzLkPJ9bcPiybVL/EZgOjQQkj\n"+
                                           "K5GNtsZgYDjcLvPz1WldVRS2jm53eUtIHVdGg6kCgYAPEVtuI3KBCTpcDuSyNTcl\n"+
                                           "Wa12QUpNtYMb2F2CG+IekPzEmvMuz2mMpED+zSUNp22jGf/IUiyAURc1+9FC4bPS\n"+
                                           "TKet0IlYs19XdDFPtLJycSAjmRzFe9EY4/lK16xrTbnVT+g6pyoq3C0oprrBzvAG\n"+
                                           "9iZOFmR9VzQXanvwMQ1LOwKBgBJcLBI6ygVKJ3tqKU+EISXTwMkCaMzZf82TrL8y\n"+
                                           "2MGJHFQjrX4IjUl2kbLi1Bb07QZD22s+ttnXY0uZ6xcY3RWnRLSwPoPezc5RaGWO\n"+
                                           "rqtjHZbahOKlwY6RIEuPEfADZlqLrjSkkui0pKOgqEKD/HCrvXmoTwMEJdLsdU6C\n"+
                                           "QbnBAoGBAO1k6zHCpWmzZb7yPBC4GPg9TemPNMmHmAP7sEocDJYvcN2Jak7Pp0Yu\n"+
                                           "4cUbnvLVohimHbQ7yiFFAEJi/4RV5flIMu8iytWWoMGuD+t5JCykoxwIqjgrt1Ea\n"+
                                           "5dbmWWAP8E9Dzg05+kqc/gcLnrylttSZUxTWxmqRjc/UfE8qylmH\n"+
                                           "-----END RSA PRIVATE KEY-----"
db['(+34) 653264427'].GCMId = "APA91bFYymANKUJg8u_Kte15r3yADzCen_0IkxjkU7m_RR1ixpIDoljLGHeLLyY57sb0teEdPRx5kaXF2SJgSkLtxHQadI1tWcm0-q4-ByKFHHiUCyvqvuM0uWvZw20SXI8y926k7YmgNge9omJLl2IgWSQ-BqkMWw";

var db_2 = new Object();


module.exports = {
	get: function(key){
		var response;
		return response = db[key];
	},
	getContact: function (contact) {
		return db[contact];
	},
	
	addAccount: function (account,privateKey,code) {
        if (typeof(db_2[account]) !== 'undefined'){
            if (db_2[account].code != code){
                db_2[account].attempts--;
                if (db_2[account].attempts <= 0){
                    logger.log("Incorrect code, Exceeded the number of attempts. Account="+account+" Attempts="+db_2[account].attempts+"Stored="+db_2[account].code+"Sended="+code);//, "Token=\"\""+status.authtoken);
                    delete db_2[account];
                    return global.CODE_MAX_MISTAKES;
                }
                logger.log("Incorrect code. Account="+account+" attempts="+db_2[account].attempts+"Stored="+db_2[account].code+", Sended="+code);//, "Token=\"\""+status.authtoken);
                return global.CODE_INCORRECT;
            } else {
                db[account] = new Object();
                logger.log(privateKey);
                db[account].privateKey = privateKey;
                db[account].GCMId = "";
                logger.log("Correct code, adding account. Account="+account+" Attempts="+db_2[account].attempts+"Code="+code);//+"pivateKey="+privateKey);//, "Token=\"\""+status.authtoken);
                // El código de autenticación y los intentos guardar en memoria siempre,
                delete db_2[account];
                return global.OK;
            }
        }
        else {
              logger.log("Incorrect Account. account="+account+", Code="+code);
              return global.CODE_UNDEFINED;
        }
	},
	
	addNovalidate: function (account,code) {
		db_2[account] = new Object();
		db_2[account].code = code;
		db_2[account].attempts = global.myProperties.get('attempts');
    	logger.log("Added to db_2 OK, Account="+account+", AUTH CODE="+code+", ATTEMPS="+global.myProperties.get('attempts'));//, "Token=\"\""+status.authtoken);

	},
	
	getContacts: function () {
		return db;
	},
	setGCMId : function(account,GCMId){
        if (typeof (db[account]) !== 'undefined')
            db[account].GCMId = GCMId;
	},

    getGCMId : function (account){
        if (typeof (db[account]) !== 'undefined')
            return db[account].getGCMId;
        return "";
    },

	getContactsNovalidate: function () {
		return db_2;
	},

	getContactsFromChat: function(chatId){
	    return chatId;
	}
}
