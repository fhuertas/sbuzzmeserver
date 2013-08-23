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
formidable = require('formidable')

function _sbuzzme(direction){
	return false;
}

module.exports = {
	check: function(request, response){
		logger.log("START: Check contacts");
		var form = new formidable.IncomingForm()
		form.parse(request, function(err, fields, files) {
			// Si no esta esta linea una llamada incorrecta puede petar el servicio
			try {
				var contacts = fields.contacts;
				var session = fields.session;
			} catch (e){
				response.send(global.HTML_BAD_REQUEST);
				return;
			}
			if (typeof(contacts) !== 'undefined' && typeof(session) !== 'undefined'){
				var status = new Object();
				status['status'] = global.OK;
				status['contacts'] = new Object();

				for (var i = 0; i < contacts.length; i++){
					contact = contacts[i];
					var statusContact = db.get(contact);
					if (typeof (statusContact) !== 'undefined'){
						status['contacts'][contact] = db.get(contact);
					}
				}
				logger.log(status['contacts']);
				response.send(status);
			}else {
				response.send(global.HTML_BAD_REQUEST);
			}
		});
		logger.log("END: Check contacts");
		return;
	},

	sbuzzme: function(request, response){
		logger.log("START: SbuzzMe");
		var form = new formidable.IncomingForm()
		form.parse(request, function(err, fields, files) {

			try {
				var contacts = JSON.parse(fields.contacts);
				var session = fields.session;
				var id = fields.id;
			} catch (e){
				response.send(global.HTML_BAD_REQUEST);
				return;
			}


			if ((typeof(contacts) !== 'undefined') &&
					(typeof(session) !== 'undefined') &&
					(typeof(id) !== 'undefined')){
				var status = new Object();
				status.contacts = new Object();
				for (var i = 0; i < contacts.length; i++){
					var contact = contacts[i];
					logger.log("From: "+session+", To: "+contact+", Id: "+id);
					if (typeof(db.getContact(contact)) === 'undefined'){
						status.contacts[contact]= global.UNREGISTERED;
					}else {
						var direction = db.getContact(contact)
						var result = _sbuzzme(session,direction,id);
						if (!result){
							queue.add(session,contact);
							status.contacts[contact]= global.SAVED;
						}else {
							status.contacts[contact]= global.SEND;
						}
					}
				}
				status.status= global.OK;
				response.send(status);
			}else {
				response.send(global.HTML_BAD_REQUEST);
			}
		});
		logger.log("END: SbuzzMe");
		return;
	},
	register: function(request, response){
		logger.log("Start: register");
		var form = new formidable.IncomingForm()
		var status = new Object();
		form.parse(request, function(err, fields, files) {
			if (typeof(fields.contact) !== 'undefined') {
				// Abria que autentificar primero
				db.addContact(fields.contact);

				status.status= global.OK;
				status.authtoken= "token"+fields.contact;
				var min = global.myProperties.get('minNumberRandom');
				var max = global.myProperties.get('maxNumberRandom');

				var authCode = parseInt((Math.random() * (max-min)) );//parseInt(max) - parseInt(min));
				authCode += parseInt(min);
				status.authcode=  authCode ;
				logger.log("Register OK, Contact="+fields.contact+", AUTH CODE="+status.authcode);
				response.set('Content-Type', 'application/json');
				response.send(status);
			} else {
				status.status= global.ERR;
				logger.log("Register ERR, Contact="+fields.contact);
				response.set('Content-Type', 'application/json');
				response.send(status);
			}
			logger.log("End: register");
		})
		return;

		var status = new Object();
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
	listQueue: function(request, response){
		logger.log("Start: listQueue");
		queue.list();
		response.send("200");
		logger.log("End: listQueue");
	},

	ping: function(request, response){
    		logger.log("Start: ping");
    		logger.log("Se ha hecho ping");
    		response.send("200");
    		logger.log("End: ping");
    }
}


