var ONLINE_STATUS = "online";
var OFFLINE_STATUS = "offline";
var UNREGISTER_STATUS = "unregister";
var UNKNOW_STATUS = "unknow";
var logger = require('./log.js');
// Base de datos temporal, posiblemente luego si esta establecido guarde el socket o offline si esta desctivada
// Problemas paises
var db = new Object();
db['0034653264427'] = global.ONLINE
db['0034664763824'] = global.OFFLINE
db['0034123456789'] = global.ONLINE
db['976230380'] = global.ONLINE


var db_2 = new Object();

module.exports = {
	get: function(key){
		var response;
		if (typeof db[key] === 'undefined'){
			response = global.UNREGISTERED;
		} else {
			response = db[key];
		}
		logger.log(response);
		return response;
	},
	getContact: function (contact) {
		return db[contact];
	},
	
	addContact: function (contact, code) {
		if (typeof(db_2[contact]) === 'undefined'){
			return false;
		}
		var code2 = db_2[contact].code;
		logger.log("Codigo enviado: "+code);
		logger.log("Codigo almacenado: "+code2);
		if ((typeof(db_2[contact]) !== 'undefined') && (code == code2)){
			delete db_2[contact];
			db[contact] = new Object();
			db[contact] = global.ONLINE;
			return true;
		}
		return false
	},
	
	addNovalidate: function (contact) {
		// Hacer limpia?
		var min = global.myProperties.get('minxNumberRandom');
		var max = global.myProperties.get('maxNumberRandom');
		db_2[contact] = new Object();
		db_2[contact].code = parseInt(Math.random() * (max-min)) + min;
		db_2[contact].code = 0;
		return db_2[contact].code;
	},
	
	getContacts: function () {
		return db;
	},
	
	getContactsNovalidate: function () {
		return db_2;
	}
}
