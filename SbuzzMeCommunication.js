/**
 * Llamadas: Check con user
 */
 
 // Responder con estados

var logger = require('./log.js');
var sec = require('./SbuzzMeSecurity');
var db = require('./SbuzzMeDAO');
var qs = require('querystring');
var url = require("url");
var queue = require('./SbuzzMeQueue');

function _sbuzzme(direction){
	return false;
}

module.exports = {
	check: function(request, response){
		logger.log("Check contacts");
		var vars;
		
		
		if (request.method == 'GET'){
			vars = request.query;
			if (typeof(vars.contacts) !== 'undefined' && typeof(vars.session) !== 'undefined'){
				var session = vars.session;
				var status = new Object();
				status['status'] = global.OK;
				status['contacts'] = new Object();
				var contacts = vars.contacts.split(',');
				
				for (var i = 0; i < contacts.length; i++){
				//for (var contact in contacts){
					contact = contacts[i];	
					var statusContact = db.get(contact);
					if (typeof (statusContact) !== 'undefined'){
						status['contacts'][contact] = db.get(contact);
					} /*else{
						status['contacts'][contact] = global.UNREGISTERED;
					}*/
						
				}
				logger.log(status);
				response.send(status);
				
			}else {
				var status = new Object();
				status['status'] = global.ERR;
				response.send(status);
			}
		} else if (request.method == 'POST'){
			response.send('Only GET method are supported');
		}
		logger.log("End check");

	},
	
	sbuzzme: function(request, response){ 
		logger.log("SbuzzMe");

		if (request.method == 'GET'){
			vars = request.query;
			//response.send('Only Post method are supported');
			//return;
		} else if (request.method == 'POST'){
			vars = request.query;
		}
		if ((typeof(vars.contact) !== 'undefined') && 
			(typeof(vars.session) !== 'undefined') &&
			(typeof(vars.id) !== 'undefined')){
			logger.log("From: "+vars.session+", To: "+vars.contact+", Id: "+vars.id);
			//var session = sec.getSession(vars.session);
			var session = vars.session;
			var direction = db.getContact(vars.contact)
			if (typeof(direction) === 'undefined'){
				var status = new Object();
				status.s= global.ERR;
				response.send(status);

			}
			var result = _sbuzzme(session,direction,vars.id);
			if (!result){
				queue.add(session,vars.contact);
				var status = new Object();
				status.s= global.SAVED;
				response.send(status);
			}
			var status = new Object();
			status.s= global.OK;
			response.send(status);
		}
		var status = new Object();
		status.s= global.ERR;
		response.send(status);
		logger.log("End: SbuzzMe");

	},
	register: function(request, response){ 
		logger.log("Start: register");

		vars = request.query;
		if (typeof(vars.contact) !== 'undefined') {
			// Abria que autentificar primero
			db.addContact(vars.contact);
			var status = new Object();
			status.status= global.OK;
			// TODO hay que cambiar 
			status.authtoken= "token"+vars.contact;
			var min = global.myProperties.get('minNumberRandom');
			var max = global.myProperties.get('maxNumberRandom');
			status.authcode=  parseInt(Math.random() * (max-min) + min);
			logger.log("Register OK, Contact="+vars.contact+", AUTH CODE="+status.authcode);
			response.send(status);
		} else {
			status.status= global.ERR;
			logger.log("Register ERR, Contact="+vars.contact);
			response.send(status);
		}
		logger.log("End: register");
	},
	
/*	validate: function (request, response) {
		logger.log("Start: register");

		vars = request.query;
		if (typeof(vars.contact) !== 'undefined'){
			// Abria que autentificar primero
			var status = new Object();
			if (db.addContact(vars.contact)){
				status.status= global.OK;
			}else {
				status.status= global.ERR_2;
			}
			
			response.send(status);
		}
		var status = new Object();
		status.s= global.ERR;
		response.send(status);
		logger.log("End: register");

	},*/
	
	getContacts: function(request, response){ 
		logger.log("Start: getContacts");
		logger.log(db.getContacts());
		response.send(db.getContacts());
		logger.log("end: getContacts");
	},
	
	getContactsNovalidate: function(request, response){ 
		logger.log("Start: getContactsNovalidate");		
		logger.log(db.getContactsNovalidate());
		response.send(db.getContactsNovalidate());
		logger.log("End: getContactsNovalidate");		
	},
	
	listQueue: function(request, response){ 
		logger.log("Start: listQueue");		
		queue.list();
		response.send("200");
		logger.log("End: listQueue");		
	}
}


