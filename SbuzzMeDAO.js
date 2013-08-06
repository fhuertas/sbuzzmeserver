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

module.exports = {
	get: function(key){
		var response;
		if (typeof db[key] === 'undefined'){
			response = UNREGISTER_STATUS;
		} else {
			response = db[key];
		}
		logger.log(response);
		return response;
	},
	getContact: function (contact) {
		return db[contact];
	},
	
	addContact: function (contact) {
		db[contact] = new Object();
		db[contact] = global.ONLINE;
	},
	
	getContacts: function () {
		return db;
	}
	
	//addSbuzzMeRecord : function(
}

