var ONLINE_STATUS = "online";
var OFFLINE_STATUS = "offline";
var UNREGISTER_STATUS = "unregister";
var UNKNOW_STATUS = "unknow";
var logger = require('./log.js');
// Base de datos temporal, posiblemente luego si esta establecido guarde el socket o offline si esta desctivada
// Problemas paises
var db = new Object();
db['(+34)653264427'] = global.ONLINE
db['(+34)664763824'] = global.OFFLINE
db['(+34)123456789'] = global.ONLINE
db['(+34)976230380'] = global.ONLINE


var db_2 = new Object();

module.exports = {
	get: function(key){
		var response;
		return response = db[key];
	},
	getContact: function (contact) {
		return db[contact];
	},
	
	addContact: function (contact,privateKey,code) {
        if (typeof(db_2[contact]) !== 'undefined'){
            if (db_2[contact].code != code){
                db_2[contact].attempts--;
                if (db_2[contact].attempts <= 0){
                    logger.log("Incorrect code, Exceeded the number of attempts. Contact="+contact+" Attempts="+db_2[contact].attempts+"Stored="+db_2[contact].code+"Sended="+code);//, "Token=\"\""+status.authtoken);
                    delete db_2[contact];
                    return global.CODE_MAX_MISTAKES;
                }
                logger.log("Incorrect code. Contact="+contact+" attempts="+db_2[contact].attempts+"Stored=db_2[contact].code"+"Sended="+code);//, "Token=\"\""+status.authtoken);
                return global.CODE_INCORRECT;
            } else {
                db[contact] = new Object();
                db[contact].privateKey = privateKey;
                db[contact].regId = "";
                logger.log("Correct code, adding contact. Contact="+contact+" Attempts="+db_2[contact].attempts+"Code="+code);//+"pivateKey="+privateKey);//, "Token=\"\""+status.authtoken);
                // El código de autenticación y los intentos guardar en memoria siempre,
                delete db_2[contact];
                return global.OK;
            }
        }
        else {
              logger.log("Incorrect contact. Contact="+contact+", Code="+code);
              return global.CODE_UNDEFINED;
        }
	},
	
	addNovalidate: function (contact,code) {
		db_2[contact] = new Object();
		db_2[contact].code = code;
		db_2[contact].attempts = global.myProperties.get('attempts');
    	logger.log("Added to db_2 OK, Contact="+contact+", AUTH CODE="+code+", ATTEMPS="+global.myProperties.get('attempts'));//, "Token=\"\""+status.authtoken);

	},
	
	getContacts: function () {
		return db;
	},
	
	getContactsNovalidate: function () {
		return db_2;
	}
}
