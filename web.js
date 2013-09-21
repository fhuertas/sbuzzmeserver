



//try {
	require('./SbuzzMeConstants');
	var db = require('./SbuzzMeDAO');
    var client = require('./SbuzzMeRestClient');

	var logger = require('./log.js');
	var i = 0;
	var communication = require ('./SbuzzMeCommunication');
	var configFile = "config.properties";
	var express = require('express');
	var parser = require('properties-parser');
	var fs = require('fs');
    var gcm = require('node-gcm')
    var _ = require('underscore')
    var registrationIds = []
    registrationIds[0] = '(+34)653264427'
    var sender = new gcm.Sender('AIzaSyAQHELtS0MSA0F2olfknaUnd9XvIxXYcKU');
	var app = express();
	app.use(express.logger());

	var security = require('./SbuzzMeSecurity');



	var properties = parser.createEditor(configFile);
	global.myProperties = properties;
	logger.log(global.myProperties.get('attempts'));

	var _port = properties.get('port');
	var checkPath = properties.get('checkPath');
	var SbuzzMePath = properties.get('SbuzzMePath');
	var registerPath = properties.get('registerPath');
	var validatePath = properties.get('validatePath');
	var pingPath = properties.get('pingPath');
	var getContactsPath = properties.get('getContactsPath');
	var getContactsNovalidatePath = properties.get('getContactsNovalidatePath');
	var listQueuePath = properties.get('listQueuePath');
	var validatePath = properties.get('validatePath');
	var signInPath = properties.get('signInPath');
	var getUrlServerPath = properties.get('getUrlServerPath');

	
	
	logger.log("Puerto: "+_port);
	logger.log("Path de check="+checkPath);
	logger.log("Path de Sbuzz="+SbuzzMePath);
	logger.log("Path de signIn="+signInPath);
	logger.log("Path de registro="+registerPath);
	logger.log("Path de ping="+pingPath);
	logger.log("Path de validate="+validatePath);
	logger.log("Path de obtener contactos="+getContactsPath);
	logger.log("Path de obtener contactos no validados="+getContactsNovalidatePath);
	logger.log("Path de listar la cola de mensajes="+listQueuePath);


	app.post(checkPath,communication.check);
	app.post(SbuzzMePath,communication.sbuzzme);
	app.post(registerPath,communication.register);
	app.post(getContactsPath,communication.getContacts);
	app.post(pingPath,communication.ping);
	app.post(validatePath,communication.validate);
	app.post(signInPath,communication.signIn);
	app.get(listQueuePath,communication.listQueue);
	app.get('/', function(request, response) {
	  response.send('SbuzzMeServer is runnig!');
	});


	app.post('/masterSbuzz', function(request, response){
	    var form = new formidable.IncomingForm()
    	form.parse(request, function(err, fields, files) {
    	    try {
                var o = fields.o;
                var d = fields.d;
                console.log(d);
                console.log(o);
                //var
                db.getGCMId(d, function (results) {
                    //console.log("%j",results)
                    var contacts = []
                    contacts[0] = results.GCMId;
                    var id = client.sbuzz(contacts,o,0,0)
                    var result = new Object
                    result.status = global.OK
                    result.sbuzzid = id;
                    response.send(result) ;
                })
    	    } catch (e) {
                response.send(400);
    	        console.log("%j",e)
    	        console.log(e)
    	    }
    	})
	})



	var port = process.env.PORT || _port;
	app.listen(port, function() {
	  console.log("Listening on " + port);
	});
	
	
	
	
	return;
//}catch (err){
//	console.log(err)
//	process.exit(1);
//}



