/**
 * Llamadas: Check con user
 */

var logger = require('./log.js');
var db = 

module.exports = {
	check: function(request, response){
		var vars;
		if (request.method == 'GET'){
			vars = request.query;
		} else if (request.method == 'POST'){
			vars = request.body;
		}
		if (typeof(vars.user) !== 'undefined'){
			var db = require('./SbuzzMeDAO');
			var status = db.get(vars.user);
			response.send(status);
		}else {
			response.send('incorrect call');
		}
	}
}
