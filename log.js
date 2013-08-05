var configFile = "config.properties";
var parser = require('properties-parser');
var properties = parser.createEditor(configFile);

var destino = properties.get('debugOutput')
var debugLevel = properties.get('logLevel');
var functionLog;
if (destino == 'console'){
	functionLog = function(text,level){
		if (typeof level === 'undefined') level = 0;
		if (debugLevel >= level) {
			console.log(text)
		}
	}
} else {
	functionLog = function (text,level){
		if (typeof level === 'undefined') level = 0;
		if (debugLevel >= level) {
			//console.log(text)
		}
	}
}



module.exports = {
	log: functionLog
}

