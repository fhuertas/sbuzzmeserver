



//try {
	require('./SbuzzMeConstants');
	var logger = require('./log.js');
	var i = 0;
	var communication = require ('./SbuzzMeCommunication');
	var configFile = "config.properties";
	var express = require('express');
	var fs = require('fs');
	var app = express();
	app.use(express.logger());


	
	var parser = require('properties-parser');
	
	
	var properties = parser.createEditor(configFile);
	global.myProperties = properties;

	var _port = properties.get('port');
	var checkPath = properties.get('checkPath');
	var SbuzzMePath = properties.get('SbuzzMePath');
	var registerPath = properties.get('registerPath');
	var validatePath = properties.get('validatePath');
	var getContactsPath = properties.get('getContactsPath');
	var getContactsNovalidatePath = properties.get('getContactsNovalidatePath');
	var listQueuePath = properties.get('listQueuePath');

	
	
	logger.log("Puerto: "+_port);
	logger.log("Path de check="+checkPath);
	logger.log("Path de Sbuzz="+SbuzzMePath);
	logger.log("Path de registro="+registerPath);
	//logger.log("Path de validacion="+validatePath);
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
	app.get(listQueuePath,communication.listQueue);
	app.get('/', function(request, response) {
	  response.send('SbuzzMeServer is runnig!');
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



