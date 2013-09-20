



try {
	require('./SbuzzMeConstants');

	var logger = require('./log.js');
	var communication = require ('./SbuzzMeCommunication');
	var configFile = "config.properties";
	var express = require('express');
	var parser = require('properties-parser');
	var app = express();
	app.use(express.logger());

	var properties = parser.createEditor(configFile);
	global.myProperties = properties;
	logger.log(global.myProperties.get('attempts'));

	var _port = properties.get('port');
	var getUrlServerPath = properties.get('getUrlServerPath');

	
	
	logger.log("Puerto: "+_port);
	logger.log("Path de obtenerUrl="+getUrlServerPath);


	app.post(getUrlServerPath,communication.getUrl);
	app.get('/', function(request, response) {
	  response.send('SbuzzMeServer is runnig!');
	});

	var port = process.env.PORT || _port;
	app.listen(port, function() {
	  logger.log("Listening on " + port);
	});
	
	
	
	
	return;
}catch (err){
	logger.log(err)
	// Procesos de salida de emergencia
	process.exit(1);
}



