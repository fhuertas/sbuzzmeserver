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
var ursa = require('ursa');
var client = require('./SbuzzMeRestClient');
formidable = require('formidable')

function _sbuzzme(direction){
	return false;
}


module.exports = {
    signIn: function(request, response){
        var form = new formidable.IncomingForm()
        form.parse(request, function(err, fields, files) {
            logger.log("START: signIn.",global.INFO);
            try {
				var account_name = fields.account;
				var GCMId_ciphered = fields.GCMId;
				var contact = db.getContact(account_name, function (results){
				    contact = results.result;
                    var privateKey = sec.regeneratePrivateKey(contact.privatekeyid);

                    var GCMId = sec.decode(GCMId_ciphered,privateKey)

                    db.setGCMId(account_name,GCMId, function (results){
                        if (results.status == global.OK ){
                            response.send(global.HTML_OK);
                            logger.log("SIGN_IN: (contact: \""+ account_name +"\") (GCMId: \""+GCMId+"\")",global.INFO);
                        } else {
                            response.send(global.HTML_BAD_REQUEST);
                            logger.log("SIGN_IN: Incorrect (contact: \""+ account_name +"\") (GCMId: \""+GCMId+"\")",global.INFO);
                        }

                    });

				});
            } catch (e){
                logger.log("SIGN_IN Fail: "+e);
                response.send(global.HTML_BAD_REQUEST);
                return;
            }

        });
        logger.log("END: signIn",global.INFO);
    },
	check: function(request, response){
		logger.log("START: Check contacts",global.INFO);
        logger.log("END: Check contacts",global.INFO);

		response.send(global.OK);
		return;
		var form = new formidable.IncomingForm()
		form.parse(request, function(err, fields, files) {
			// Si no esta esta linea una llamada incorrecta puede petar el servicio
			try {
				var contacts = fields.contacts;
				var account = fields.account;
				var contact = db.getContact(account);
				var privateKey = sec.regeneratePrivateKey(contact.privateKey);
			} catch (e){
				response.send(global.HTML_BAD_REQUEST);
				return;
			}
			if (typeof(contacts) !== 'undefined'){// && typeof(session) !== 'undefined'){
				var status = new Object();
				status['status'] = global.OK;
				status['contacts'] = new Object();

				for (var i = 0; i < contacts.length; i++){
				    logger.log(contacts[i],privateKey);
					contact = sec.decode(contacts[i],privateKey);
					var statusContact = db.getContact(contact);
					if (typeof (statusContact) !== 'undefined'){
						status['contacts'][contacts[i]] = "online";
					}
				}
				logger.log(status['contacts']);
				response.send(status);
			}else {
				response.send(global.HTML_BAD_REQUEST);
			}
		});
		logger.log("END: Check contacts",global.INFO);
		return;
	},

	sbuzzme: function(request, response){
		logger.log("START: SbuzzMe");
		var form = new formidable.IncomingForm()
		form.parse(request, function(err, fields, files) {
			try {
			    var i = 0;
				var account = fields.account;

				db.getPrivateKey(account, function (results) {
				    try {
                        var privateKey = sec.regeneratePrivateKey(results.privateKeyId);
                        var SbuzzId = sec.decode(fields.sbuzzid,privateKey);
                        logger.log(fields.msg)
                        var msg = JSON.parse(fields.msg);
                        logger.log("RECIVED Sbuzz: from="+account+", sbuzzid="+SbuzzId,global.INFO);
                        msg.contact =  sec.decode(msg.contact,privateKey);
                        logger.log(i++);
                        msg.KeyChatId =  sec.decode(msg.KeyChatId,privateKey);
                        logger.log(i++);
                        logger.log("RECIVED Sbuzz: msg="+JSON.stringify(msg));
                        // TODO soporte para varios destinos
                        db.getGCMId(msg.contact, function (results) {

                            if (results.status != global.OK)
                                response.send(global.HTML_BAD_REQUEST);
                            else {
                                var contacts = [];
                                contacts[0] = results.GCMId;
                                client.sbuzz(contacts,account,SbuzzId,msg.KeyChatId)
                                response.send(global.HTML_OK);
                            }
                            return;

                        });

                    } catch (e){
                        logger.log(e);
                        response.send(global.HTML_BAD_REQUEST);
                        return;
                    }


				});
			} catch (e){
			    logger.log(e);
				response.send(global.HTML_BAD_REQUEST);
				return;
			}
		});
		logger.log("END: SbuzzMe",global.INFO);
		return;
	},
	register: function(request, response){
		logger.log("Start: register",global.INFO);
		var form = new formidable.IncomingForm()
		var status = new Object();
		form.parse(request, function(err, fields, files) {
			if (typeof(fields.account) !== 'undefined') {
				// Abria que autentificar primero
				status.status= global.OK;
				var min = global.myProperties.get('minNumberRandom');
				var max = global.myProperties.get('maxNumberRandom');
				var authcode = parseInt((Math.random() * (max-min)) );//parseInt(max) - parseInt(min));
				authcode += parseInt(min);
                db.addNovalidate(fields.account,authcode);
				status.authcode=  authcode ;
				logger.log("Register OK, Account="+fields.account+", AUTH CODE="+status.authcode,global.INFO);//, "Token=\"\""+status.authtoken);
				//db.addContact(fields.contact,key.toPrivatePem().toString(),status.authcode);
				response.set('Content-Type', 'application/json');
				response.send(status);
			} else {
				status.status= global.ERR;
				logger.log("Register ERR, Account="+fields.account);
				response.set('Content-Type', 'application/json');
				response.send(status);
			}
			logger.log("End: register");
		})
		return;
	},
	validate: function(request, response){
	    logger.log("Start: validation");
        var form = new formidable.IncomingForm()
        form.parse(request, function(err, fields, files) {
            var status = new Object();
            var key = sec.generatePrivateKey();

            if ((typeof (fields.account) !== 'undefined') && (typeof (fields.code) !== 'undefined')){
                status.status = db.addAccount(fields.account,key.toPrivatePem().toString(),fields.code, function (result){
                    if (result.status == global.OK){
                        var publicKeyString = key.toPublicPem().toString().split("-----")[2];
                        result.authtoken = publicKeyString .replace(/\n/g,'');
                        logger.log("Correct code, adding account. Account="+fields.account+", Code="+fields.code,global.INFO);//+"pivateKey="+privateKey);//, "Token=\"\""+status.authtoken);
                        response.send(result);
                    }else {
                        response.send(result);
                    }
                    response.end();
                });
            }


//            if (status.status == global.OK){
//                status.authtoken= key.toPublicPem().toString();
//                status.authtoken = status.authtoken.split("-----")[2];
//                status.authtoken = status.authtoken.replace(/\n/g,'');
//				response.send(status);
//            }else {
//				response.send(status);
//            }
        });
	    logger.log("End: validation",global.INFO);
	},

	getContacts: function(request, response){
		logger.log("Start: getContacts");
		db.getContacts()
		logger.log();
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


