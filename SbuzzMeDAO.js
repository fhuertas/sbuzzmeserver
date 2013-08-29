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
                db[account].privateKey = privateKey;
                db[account].GMCId = "";
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
	setGCMId : function(account,GMCId){
        if (typeof (db[account]) !== 'undefined')
            db[account].GMCId = GMCId;
	},

    getGMCId : function (account){
        if (typeof (db[account]) !== 'undefined')
            return db[account].getGMCId;
        return "";
    },

	getContactsNovalidate: function () {
		return db_2;
	},
}
