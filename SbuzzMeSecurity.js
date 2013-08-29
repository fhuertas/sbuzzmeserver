var ursa = require('ursa')
/*var logger = require('./log.js')

var key = ursa.generatePrivateKey();

var key2 = ursa.createPrivateKey(key.toPrivatePem())


logger.log(key.toPublicPem().toString())
logger.log(key2.toPublicPem().toString())
var publickey = key.toPublicPem().toString();
logger.log(publickey);


publickey = publickey.split("-----")[2];
logger.log(publickey);
publickey = publickey.replace('/[\n\r]/g','');
logger.log(publickey);  */

module.exports = {
	getSession: function(key){
		return key;
	},

	generatePrivateKey : function(){
	    return ursa.generatePrivateKey();
	},

	regeneratePrivateKey : function(privateKey) {
	    return ursa.createPrivateKey(privateKey)
	},

	decode: function (text, privateKey){
        return privateKey.decrypt(text,'base64','utf8')
	}

}

