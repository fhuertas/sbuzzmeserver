


//try {
	var communication = require ('./SbuzzMeCommunication');
	var configFile = "config.properties";
	var express = require('express');
	var fs = require('fs');
	var app = express();
	var parser = require('properties-parser');
	
	var properties = parser.createEditor(configFile);

	var port = properties.get('port');
	var listenPath = properties.get('listenPath');
	app.get(listenPath,communication.check);
	app.listen(port, function() {
		console.log("Listening on " + port);
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
