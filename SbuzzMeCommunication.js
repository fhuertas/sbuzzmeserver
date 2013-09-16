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
		var form = new formidable.IncomingForm()
		form.parse(request, function(err, fields, files) {
			// Si no esta esta linea una llamada incorrecta puede petar el servicio
			try {
				var account = fields.account;
				console.log(typeof (fields.contacts))
				if (fields.contacts instanceof Array){
    				var contacts = fields.contacts
				} else {
    				var contacts = []
    				contacts[0] = fields.contacts

				}


				db.getPrivateKey(account, function (results){
				    if (results.status == global.OK){
                        var privateKey = sec.regeneratePrivateKey(results.privateKeyId);
                        console.log(privateKey )
                        var status = new Object();
                        status['status'] = global.OK;
                        status['contacts'] = new Object();
                        console.log(contacts);
                        for (var i = 0; i < contacts.length; i++){
                            contacts[i] = sec.decode(contacts[i],privateKey);
                        }
                        db.checkContacts(contacts, function (results) {
                            console.log("%j",results)
                            response.send(results);
                            response.end()
                            return;
                        })
			    } else {
                        response.send(global.HTML_BAD_REQUEST);
                        return;
				    }
                })
			} catch (e){
				response.send(global.HTML_BAD_REQUEST);
				return;
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
                        var msg = JSON.parse(fields.msg);
                        msg.contact =  sec.decode(msg.contact,privateKey);
                        msg.KeyChatId =  sec.decode(msg.KeyChatId,privateKey);
                        logger.log("RECIVED Sbuzz: from="+account+", To= "+msg.contact+",sbuzzid="+SbuzzId,global.INFO);
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
		logger.log("END: SbuzzMe");
		return;
	},
	register: function(request, response){
		logger.log("Start: register");
		var form = new formidable.IncomingForm()
		var status = new Object();
		form.parse(request, function(err, fields, files) {
			if (typeof(fields.account) !== 'undefined') {
				// Abria que autentificar primero
				status.status= global.OK;
				var min = global.myProperties.get('minNumberRandom');
				var max = global.myProperties.get('maxNumberRandom');
				var code = parseInt((Math.random() * (max-min)) );//parseInt(max) - parseInt(min));
				code += parseInt(min);
                db.addNovalidate(fields.account,code);
				status.code=  code ;
				logger.log("Register OK, Account="+fields.account+", AUTH CODE="+status.code,global.INFO);//, "Token=\"\""+status.authtoken);
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
            console.log("%j", fields);
            var key = sec.generatePrivateKey();
            if ((typeof (fields.account) !== 'undefined') && (typeof (fields.code) !== 'undefined')){
                status.status = db.addAccount(fields.account,key.toPrivatePem().toString(),fields.code, function (result){
                    if (result.status == global.OK){
                        var publicKeyString = key.toPublicPem().toString().split("-----")[2];
                        result.authtoken = publicKeyString .replace(/\n/g,'');
                        logger.log("Correct code, adding account. Account="+fields.account+", Code="+fields.code,global.INFO);//+"pivateKey="+privateKey);//, "Token=\"\""+status.authtoken);
                        response.send(result);
                    }else {
                        console.log("ha habido algun problema %j",result);
                        response.send(result);
                    }
                    response.end();
                });
            } else {
                console.log("ha habido algun problema");
                response.send(200);
                response.end();
            }
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


