



//try {
	require('./SbuzzMeConstants');
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

	
	
	logger.log("Puerto: "+_port);
	logger.log("Path de check="+checkPath);
	logger.log("Path de Sbuzz="+SbuzzMePath);
	logger.log("Path de registro="+registerPath);
	logger.log("Path de ping="+pingPath);
	logger.log("Path de validate="+validatePath);
	logger.log("Path de obtener contactos="+getContactsPath);
	logger.log("Path de obtener contactos no validados="+getContactsNovalidatePath);
	logger.log("Path de listar la cola de mensajes="+listQueuePath);
	

	//app.get(registerPath,communication.register);
	//app.get(validatePath,communication.validate);
	//app.get(getContactsPath,communication.getContacts);

	app.post(checkPath,communication.check);
	app.post(SbuzzMePath,communication.sbuzzme);
	app.post(registerPath,communication.register);
	app.post(getContactsPath,communication.getContacts);
	app.post(pingPath,communication.ping);
	app.post(validatePath,communication.validate);
	app.get(listQueuePath,communication.listQueue);
	app.get('/', function(request, response) {
	  response.send('SbuzzMeServer is runnig!');
	});

    var count = 0;
    app.get('/gcm',function(req, res) {
        var message= new gcm.Message;
        //message
        message.addData('message', 'Hello World. Count='+(count++));
        //_.intersection(registrationIds, req.body.receptors.split(','));
        sender.send(message, registrationIds, 4, function(result) {
            console.log(result);
        });
        res.send(200);
    });

    app.get('/ind',function(req, res) {
       res.render('index', {
          title: 'Express',
          receptors: registrationIds
        });
    });
	var port = process.env.PORT || _port;
	app.listen(port, function() {
	  console.log("Listening on " + port);
	});
	
	
	
	
	return;
/*}catch (err){
	console.log(err)
	// Procesos de salida de emergencia
	process.exit(1);
}*/



