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
		logger.log("Listen incoming");
		var vars;
		
		
		if (request.method == 'GET'){
			vars = request.query;
			if (typeof(vars.contacts) !== 'undefined' && typeof(vars.session) !== 'undefined'){
				var session = vars.session;
				var status = new Object();
				status['status'] = global.OK;
				status['contacts'] = new Object();
				var contacts = vars.contacts.split(',');
				logger.log(contacts);
				logger.log(contacts[0]);
				
				for (var i = 0; i < contacts.length; i++){
				//for (var contact in contacts){
					contact = contacts[i];	
					logger.log("contacto: " + contact);
					var statusContact = db.get(contact);
					if (typeof (statusContact) !== 'undefined'){
						status['contacts'][contact] = db.get(contact);
					} else{
						status['contacts'][contact] = global.UNREGISTERED;
					}
						
				}
				response.send(status);
				
			}else {
				var status = new Object();
				status['status'] = global.ERR;
				response.send(status);
			}
		} else if (request.method == 'POST'){
			response.send('Only GET method are supported');
			return;
		}
	},
	
	sbuzzme: function(request, response){ 
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
	},
	register: function(request, response){ 
		vars = request.query;
		if (typeof(vars.contact) !== 'undefined') {
			// Abria que autentificar primero
			db.addNovalidate(vars.contact);
			var status = new Object();
			status.status= global.OK;
			response.send(status);
		}
		status.s= global.ERR;
		response.send(status);
	},
	
	validate: function (request, response) {
		vars = request.query;
		if ((typeof(vars.contact) !== 'undefined') && (typeof(vars.code) !== 'undefined')){
			// Abria que autentificar primero
			var status = new Object();
			if (db.addContact(vars.contact,vars.code)){
				status.status= global.OK;
			}else {
				status.status= global.ERR_2;
			}
			
			response.send(status);
		}
		var status = new Object();
		status.s= global.ERR;
		response.send(status);
	},
	
	getContacts: function(request, response){ 
		logger.log(db.getContacts());
		response.send(db.getContacts());
	},
	
	getContactsNovalidate: function(request, response){ 
		logger.log(db.getContactsNovalidate());
		response.send(db.getContactsNovalidate());
	},
	
	listQueue: function(request, response){ 
		queue.list();
		response.send("200");
	}
}


