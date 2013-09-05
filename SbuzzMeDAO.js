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
                                   "MIIEpQIBAAKCAQEA1ce3VChfpvP1SBFLuCh9KUuRS2JgdfHOI65ObTrjXUVeAvRa\n"+
                                   "FyyMPCC02OiQkcjR7lkt2BfAT6lmkoUqmI3OlbNuhBGX98CK65ysFtJKXy6Hiues\n"+
                                   "DzUBXhWf5pHBXl7A+So68kPsqSzR7CSxo+3ZV+GrzUj14F0MOH7/l15lrHjSijbb\n"+
                                   "l2mwllMGCXxW7NbpXPX4nwOoqhtCF2ggYgjTjCceTmOS3+JbFOe9ZbyEi5FklC6M\n"+
                                   "Mh/Iw/vngdop4n1gYI9m6HRj4Ldljgny+D8PVruglmLZDwn2qQFJR60Wi3mOcQUw\n"+
                                   "6gv0xrb99x1GYqNZp3/zOadG+JXEPXrXVgRP2QIDAQABAoIBAES8gmW81YSIzETv\n"+
                                   "yrjby+KLOZxTdVB2/yDZ2r2kQZarxx6MEquA11Y97egQXuuA9n78jZD9kggLH7/c\n"+
                                   "sWV7swDPQKmWPpaaghBfv7VWyDLycwJmmxwInvfxXAh2tQXy0XlL6sgaru12S8jx\n"+
                                   "w2xB/bAUD3liDCynvlYr/2JcJ7TcTYC0JoopQvU8LN2Ka7jEmDG3phMvFzqGyPr9\n"+
                                   "TtVz8iANHUCcrDA1XFYISQprUEEursbjzkwC0ICcAZ4wne70OozC4ZquAbVpnHiJ\n"+
                                   "ryO4yEIG9r0gNjkwitQQpFdB7s6E7jqGE4piqxuKdXZxOPhiiBCpFUPkC3MCJN0E\n"+
                                   "zZZl4EECgYEA+3wuCul8bw10g+XLh3ZOnfPJ4YAK59/nCa5cRyURW7bsIqszi8FN\n"+
                                   "JZTHyN5H+XDwdfpLr+rUSGv6LrgKWLWes5i0rL8aZhft+9gH3sO7HkRWCEyVG3l2\n"+
                                   "fbQ4XxU4QVl9V6B67czQeX6oNyPN9OkG8RG/FX6zL9rXagKMti4UREcCgYEA2Z4+\n"+
                                   "w97pysk4SXTafWU6h8lkj4F1ztzjgnKwXr6Vy/OQJ5hgRfFF8YXmbfwH8vI11Bj6\n"+
                                   "5pU6cCslp8DX1XT1fxbN6vsX8hR1ORbt9uKVreEIkv2FlZ82gmzF5aFfLsyqztPK\n"+
                                   "0fqOnCdVhOtU9mNP0R+OQUpLLlsyfyw78pAVet8CgYEAxbaHbETMc3Kcm+XZ8ZHt\n"+
                                   "lPjJSuQjrtC1D0NpgPV/hB933nnCeKlsQZOKzj0TUOSd5+L0BkYUxys88eX3HG8N\n"+
                                   "ah0wTm+gDYvaqhjZdyViwxTunm+2+nav1XwOpZJFO/tjM7UTcEmJzTrqfQ9FKLrb\n"+
                                   "nkNZe0i1D3Z5zPpcLg5kGJkCgYEAibkAd+2ngFMAcFynuhxKgo0OO1PvPs/EnFYB\n"+
                                   "ELUFEGJApQ5mP12GqmfXgVuznCl1r5lvkGZ46WwlFJmS/uBaTegcwc3PRcF0voCo\n"+
                                   "cUrM95InXv9bf2mXkctNIxqRpoiYwPSAs4sinei20rwstRH8/Zg+60sdcWT9/EX+\n"+
                                   "WnCdZ3kCgYEArf9TKU5VswfpryRSvtKsKLfz4lQWpi/4meT+4w59sglJb6Rcu7Gy\n"+
                                   "IvokDOYNt6GjnoVl2ytEVW7clm6FWAVMeB0s+I+qdL6AKejkgEycAG11B82ZbO7P\n"+
                                   "wkYOX2/ZfCImveq+QJjzzN6y1TdIVScIn3BK4Xcr4EtwHxCocSBmrGs=\n"+
                                   "-----END RSA PRIVATE KEY-----"
db['(+34) 653264427'].GCMId = "APA91bFYymANKUJg8u_Kte15r3yADzCen_0IkxjkU7m_RR1ixpIDoljLGHeLLyY57sb0teEdPRx5kaXF2SJgSkLtxHQadI1tWcm0-q4-ByKFHHiUCyvqvuM0uWvZw20SXI8y926k7YmgNge9omJLl2IgWSQ-BqkMWw";

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
                db[account].GCMId = "";
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
	setGCMId : function(account,GCMId){
        if (typeof (db[account]) !== 'undefined')
            db[account].GCMId = GCMId;
	},

    getGCMId : function (account){
        if (typeof (db[account]) !== 'undefined')
            return db[account].getGCMId;
        return "";
    },

	getContactsNovalidate: function () {
		return db_2;
	},

	getContactsFromChat: function(chatId){
	    return contact;
	}
}
