var ONLINE_STATUS = "online";
var OFFLINE_STATUS = "offline";
var UNREGISTER_STATUS = "unregister";
var UNKNOW_STATUS = "unknow";
var logger = require('./log.js');
// Base de datos temporal, posiblemente luego si esta establecido guarde el socket o offline si esta desctivada
// Problemas paises
var db = new Object();
db['(+34) 653264427'] = new Object();
//db['(+34) 653264427'].privateKey = new Object()
db['(+34) 653264427'].privateKey = "-----BEGIN RSA PRIVATE KEY-----\n"+
                                  "MIIEowIBAAKCAQEAl1dUHuQNggJH5+vUjAIaSnh9m7vcEE45UKxFn5wy/DD78lWB\n"+
                                  "qhSDKlQzvkyLW+ty78Lo/YoEEWoNg1coZNB1RWg7qd1iSOVhds+7YgmCNgSy9amW\n"+
                                  "kgYl2Rd3FjrHTIJ9QVEWtUV/tV1axlaXQbfpJ01RIpRBzMeA0FQRm30uZN75IimY\n"+
                                  "aKb8JPvdHpPEE2xDcTWMH6p2OVq6WIuJ6+S2gyXDcqtgg/o9Loi/fEvZ+rehtOzW\n"+
                                  "jshQ6zwGCeAcIkjIx0LW0w16TdwmUS1elkuz98gEQzZ8vIsKe6ExgXGKfZioP97y\n"+
                                  "SqRjZpgyTFUwxPI2x5RYK2KYru5KagCwfNCO6QIDAQABAoIBAHprjMNULE0PNUU4\n"+
                                  "cf0zMjstTkXsZ23VKO3F/KfIvUFdCmCTpEiFQTi7VgPIfS5EvfuOSdPVkcbYZ8fn\n"+
                                  "d+hc64/SafjU+M0Ip5dpICWElYzGrlCj9wV17aW3IoCb2V1dbJ6qTlkht9Voh6ZK\n"+
                                  "ox3o+7PsCgaTsMpKUzux1XBWiXHT4XUk3Vqojyg5FcuQrmwqRSePRwoo/4TxPVXF\n"+
                                  "NhyE1bl3oljxf9fTrLZEsKfDz8TUoBFqQ7XDFlQ+/fVePE2iUZOw2imKfnqfFLIm\n"+
                                  "hFeyxrstOg/mvSiYBRyG7Qm18pN7oXtmWpde6neuuT0V5oSR9s4agHnvMfIzOtQX\n"+
                                  "4xcQ4JECgYEAxnbvupTt1Qy/uEKAIbAB2w8gnxgjo9ii6q7IdVWurK17MPm+ZfWX\n"+
                                  "Jsh7KgKOvDjLfB73GmuziblBfx9bAX9H+PzetFWJwSaHRsIj/sxVMkd7pmarA7Jw\n"+
                                  "FahAFpkxhfmbvlNkWRzWu8W1sHag4LSo/mZvcealiiEoCNwijq+XNQUCgYEAwzce\n"+
                                  "6JpUuYy9Ar1XtXfuRZYN4d9OQaIuYFrC/7eUa42LG3Vx2Y2fH7gJt1qIDXTec8bd\n"+
                                  "z7ktYGnAh5meYq5oAajgM8Q95ozw1EqjOBL7UaySDYfIQpETOf5kHZz8O0UDC/kQ\n"+
                                  "Z10+8G615HLkgNgMyI8IXe8Xxm0HMkYNWCXCV5UCgYAHLt7WXfWNtHxr6txAW+J1\n"+
                                  "T0La/0Cq+XhMDi9rL8K2tUC0MRXXEuB5ot/yUU1hOp0CzQwchLFm1rGsLDJbB4RP\n"+
                                  "Wrekx0PJHd/fi79JxZN/0l6DU0v1QkwUPJa1Oq40LyiX5uTG5OhQu4Mr8982wtMr\n"+
                                  "AgIemT58lV6hk3Ycu/Y5EQKBgQCPi/W3dty8QEgwPojDUPgtxSRaJjlGO/q8MaFY\n"+
                                  "JmcGG2PiAh+AqQoMaekDIZgPxRNasS4j8/fxAHJpg8WarMKgDc0nY7Nc1+CzSlrw\n"+
                                  "/cw+B5aySlkw0bsAlxaJTAmRj7Ko2DF+wGtqow4veWibccMcq0iswgaKi1uSVT60\n"+
                                  "xbc9bQKBgFdjGdwMy5rIWAovKRuLiL2VF0afwkmhDpAmJ9EkbgZPd2bc9ag8s/7K\n"+
                                  "zronwMoQpqbB8q60DnDvPGYReVT0Ji+TxmKtgOFp2B1txjW2aPOoEbxOg2ohfbqY\n"+
                                  "l6FmkDGMxa4pNmus5MQjb6G876n1yqd/1yqiF4VFm5fC4IAFwXG6\n"+
                                  "-----END RSA PRIVATE KEY-----";
db['(+34)664763824'] = global.OFFLINE
db['(+34)123456789'] = global.ONLINE
db['(+34)976230380'] = global.ONLINE

var db_2 = new Object();

module.exports = {
	get: function(key){
		var response;
		return response = db[key];
	},
	getContact: function (contact) {
		return db[contact];
	},
	
	addAccount: function (account,privateKey,code) {
        if (typeof(db_2[account]) !== 'undefined'){
            if (db_2[account].code != code){
                db_2[account].attempts--;
                if (db_2[account].attempts <= 0){
                    logger.log("Incorrect code, Exceeded the number of attempts. Account="+account+" Attempts="+db_2[account].attempts+"Stored="+db_2[account].code+"Sended="+code);//, "Token=\"\""+status.authtoken);
                    delete db_2[account];
                    return global.CODE_MAX_MISTAKES;
                }
                logger.log("Incorrect code. Account="+account+" attempts="+db_2[account].attempts+"Stored="+db_2[account].code+", Sended="+code);//, "Token=\"\""+status.authtoken);
                return global.CODE_INCORRECT;
            } else {
                db[account] = new Object();
                logger.log(privateKey);
                db[account].privateKey = privateKey;
                db[account].GMCId = "";
                logger.log("Correct code, adding account. Account="+account+" Attempts="+db_2[account].attempts+"Code="+code);//+"pivateKey="+privateKey);//, "Token=\"\""+status.authtoken);
                // El código de autenticación y los intentos guardar en memoria siempre,
                delete db_2[account];
                return global.OK;
            }
        }
        else {
              logger.log("Incorrect Account. account="+account+", Code="+code);
              return global.CODE_UNDEFINED;
        }
	},
	
	addNovalidate: function (account,code) {
		db_2[account] = new Object();
		db_2[account].code = code;
		db_2[account].attempts = global.myProperties.get('attempts');
    	logger.log("Added to db_2 OK, Account="+account+", AUTH CODE="+code+", ATTEMPS="+global.myProperties.get('attempts'));//, "Token=\"\""+status.authtoken);

	},
	
	getContacts: function () {
		return db;
	},
	setGCMId : function(account,GMCId){
        if (typeof (db[account]) !== 'undefined')
            db[account].GMCId = GMCId;
	},

    getGMCId : function (account){
        if (typeof (db[account]) !== 'undefined')
            return db[account].getGMCId;
        return "";
    },

	getContactsNovalidate: function () {
		return db_2;
	},

	getContactsFromChat: function(chatId){
	    return contact;
	}
}
