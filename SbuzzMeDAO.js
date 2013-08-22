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
	
	addContact: function (contact) {
		db[contact] = new Object();
		db[contact] = global.ONLINE;
		return;
	},
	
	addNovalidate: function (contact) {
		var min = global.myProperties.get('minNumberRandom');
		var max = global.myProperties.get('maxNumberRandom');
		db_2[contact] = new Object();
		return db_2[contact].code;
	},
	
	getContacts: function () {
		return db;
	},
	
	getContactsNovalidate: function () {
		return db_2;
	}
}
