


//try {
	require('./SbuzzMeConstants');
	var logger = require('./log.js');
	var i = 0;
	var communication = require ('./SbuzzMeCommunication');
	var configFile = "config.properties";
	var express = require('express');
	var fs = require('fs');
	var app = express();
	var parser = require('properties-parser');
	
	
	var properties = parser.createEditor(configFile);
	global.myProperties = properties;

	var port = properties.get('port');
	var checkPath = properties.get('checkPath');
	var SbuzzMePath = properties.get('SbuzzMePath');
	var registerPath = properties.get('registerPath');
	var validatePath = properties.get('validatePath');
	var getContactsPath = properties.get('getContactsPath');
	var getContactsNovalidatePath = properties.get('getContactsNovalidatePath');
	var listQueuePath = properties.get('listQueuePath');
	
	
	app.get(checkPath,communication.check);
	app.get(SbuzzMePath,communication.sbuzzme);
	app.get(registerPath,communication.register);
	app.get(validatePath,communication.validate);
	app.get(getContactsPath,communication.getContacts);
	app.get(getContactsNovalidatePath,communication.getContactsNovalidate);
	app.get(listQueuePath,communication.listQueue);
	app.listen(port, function() {
		console.log("Listening on " + port);
	});
	
	/*DEBUG*/
	app.get("/queue",function (request,response){
		
	
	
	});
	

	
	
/*}catch (err){
	console.log(err)
	// Procesos de salida de emergencia
	process.exit(1);
}*/



/*app.get('/', function(request, response) {
  response.send('Hello World!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});*/
