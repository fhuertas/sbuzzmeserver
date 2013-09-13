// REQUIRES
require('./SbuzzMeConstants');
var pg = require('pg');


/* DATABASE INFO */
var conString =  process.env.DATABASE_URL || {
	host: 'ec2-23-21-196-147.compute-1.amazonaws.com',
	port: '5432',
	user: 'bqatgfwygpobil',
	password: 'KtdCcNmFYvYAghMzjogFjQ8Z6t',
	database: 'd14166nrb986gg',
	ssl: true };
var client = new pg.Client(conString);
// TABLE
// id       | account   | privateKeyId | GCMId      |
//          |           |              |            |
//          |           |              |            |
//          |           |              |            |
//          |           |              |            |


/* SQL Sentences */

var SQL_CREATE_TABLE = 'CREATE TABLE users ('+
    'id             serial primary key,' +
    'account        varchar(40) unique,' +
    'privateKeyid   varchar(2800),' +
    'GCMId          varchar(200)' +
')';


var SQL_DROP_TABLE = 'DROP TABLE users'

// NOTA, nadie tienta % en los datos
var SQL_ADD_ROW = "INSERT INTO users (account, privateKeyid, GCMId) VALUES ('%1', '%2', '%3');"

var SQL_SELECT_ALL = "SELECT * FROM users";

var SQL_SELECT_WHERE = "SELECT * FROM users WHERE %1"

var SQL_UPDATE = "UPDATE users SET %1 WHERE %2"

var logger = require('./log.js');

var SQL_SELECT = "SELECT %select FROM %from WHERE %where"

// Base de datos temporal, posiblemente luego si esta establecido guarde el socket o offline si esta desctivada
// Problemas paises
var db = new Object();
db['(+34) 653264427'] = new Object();
//db['(+34) 653264427'].privateKey = new Object()
db['(+34) 653264427'].privateKey =
"-----BEGIN RSA PRIVATE KEY-----\n"+
"MIIEowIBAAKCAQEA8eHtIWugOA0Fg1rvgFvnKwKgluqWptNn75Pb0gSxD/xhpIza\n"+
"IbXkyDDww73X4TF07hYwg6gHG469riQpqL8r6YjNpLmSrgyMCVmpPqgxe3T8/8TX\n"+
"Rj6Jkl8H5gOR/vsJyjmslKceiGBf7o7lgah86CAQQi7tnpjTi/Xpz9EvUeNpF6vy\n"+
"GYAv831iAHaEdKiJZKjImMvitjIznMyUHNMhKazUEFnrS02DprKvZjUm+lk/bvBd\n"+
"xQJ0dqQKU7OTGMqWB8uhgLAAvnsYzFHj7u1YoL+2LOsrhIit7xlxl2w2wO4xELi5\n"+
"K76cvhGXU1gXsrgbJsei1+sZYQgoXUTltD/Y1wIDAQABAoIBADE9GYWNIC9ozy9/\n"+
"KnQJwVQrE7/E/2f0bxsBEWV+WQD1EndpyNnF6k2qUMi386M+6xuwXq3eXZwJgala\n"+
"aTSVvf2rQJmAwVA286bPnrlHidMk7H+wdVYyUtT+DWCQZ37tYX/OH8ifAIMogz7P\n"+
"zf6H6u1h4Y1nei2n1KCQLcmFPsm/SQU2u1I6ZfrLpvwRcebtL1qvLipQg4BkvuxA\n"+
"WTTIA3Bv36Wz422I7R2Sgz7nsUW7sEGPWACeKUxFidqh2m8RaGhCx7yWS4HtGoRI\n"+
"ffH6WT9YS5m++HJhb6ce2R6sxYC+GWLdAQd4Xfuvd9IeTEInVCBf9WCwwG0tQyQK\n"+
"yuqYL/ECgYEA/tacRnuVRYxY4Cxx981aFVPB5RhqKma34ZNY41qW68qTbdi+YdCW\n"+
"5RlHWnOacg8l49Ud0PWM0N55XYyZ+fxYynQCA1FFHoDUHybUlsKBCH58YZgJ8vVF\n"+
"FYqudtkKClDOUm5t9+Zr0aU6hZM3/f916yKiqp/qDIgwAPaClo91SH8CgYEA8vwy\n"+
"X3nPM+mAFMNzDyt1jhujMWFIViQ4nIJlD0f1eUXIcH3PSYOv3x0dBnAGS7xhWp4S\n"+
"JpKDIWh8OcF7tcMB/b5dQgN5Y4gmuhDj0t+L5MvwzLkPJ9bcPiybVL/EZgOjQQkj\n"+
"K5GNtsZgYDjcLvPz1WldVRS2jm53eUtIHVdGg6kCgYAPEVtuI3KBCTpcDuSyNTcl\n"+
"Wa12QUpNtYMb2F2CG+IekPzEmvMuz2mMpED+zSUNp22jGf/IUiyAURc1+9FC4bPS\n"+
"TKet0IlYs19XdDFPtLJycSAjmRzFe9EY4/lK16xrTbnVT+g6pyoq3C0oprrBzvAG\n"+
"9iZOFmR9VzQXanvwMQ1LOwKBgBJcLBI6ygVKJ3tqKU+EISXTwMkCaMzZf82TrL8y\n"+
"2MGJHFQjrX4IjUl2kbLi1Bb07QZD22s+ttnXY0uZ6xcY3RWnRLSwPoPezc5RaGWO\n"+
"rqtjHZbahOKlwY6RIEuPEfADZlqLrjSkkui0pKOgqEKD/HCrvXmoTwMEJdLsdU6C\n"+
"QbnBAoGBAO1k6zHCpWmzZb7yPBC4GPg9TemPNMmHmAP7sEocDJYvcN2Jak7Pp0Yu\n"+
"4cUbnvLVohimHbQ7yiFFAEJi/4RV5flIMu8iytWWoMGuD+t5JCykoxwIqjgrt1Ea\n"+
"5dbmWWAP8E9Dzg05+kqc/gcLnrylttSZUxTWxmqRjc/UfE8qylmH\n"+
"-----END RSA PRIVATE KEY-----"
db['(+34) 653264427'].GCMId = "APA91bFYymANKUJg8u_Kte15r3yADzCen_0IkxjkU7m_RR1ixpIDoljLGHeLLyY57sb0teEdPRx5kaXF2SJgSkLtxHQadI1tWcm0-q4-ByKFHHiUCyvqvuM0uWvZw20SXI8y926k7YmgNge9omJLl2IgWSQ-BqkMWw";

var db_2 = new Object();
db_2['(+34) 653264427'] = new Object();
db_2['(+34) 653264427'].code = "0000";


var sql_exec = function (consult, callback){
    var client = new pg.Client(conString);
    console.log(consult)
    client.connect(function(err) {
        if(err) {
            result = new Object
            logger.log (err)
            result.status = global.ERR;
            callback(result);
        }
        var query = client.query(consult, function(err, result) {
            var results = new Object();
            if(err) {

                logger.log (err)
                results.status = global.ERR;
                callback(results);
            } else {
                results.status = global.OK;
                results.result = result;
//                    console.log("OK:"+result)
//                console.log("Results: %j",result)
                callback(results)
            }
            return;
        });
        query.on('end', function() {
            client.end();
        });
        return;
    });
    return;
}

var getContact = function(contact, callback){

    var consult = SQL_SELECT_WHERE.replace('%1', "account='"+contact+"'")
    sql_exec(consult,function(results){
        if (results.status != global.OK){
            callback(result);
        }else {
            var res = new Object
            if (results.result.rowCount > 0) {
                res.status = global.OK;
                res.result = results.result.rows[0];
            } else {
                res.status = global.OK;
            }
            callback(res);
        }

    })


}

module.exports = {
	getContact: getContact,
	
	addAccount: function (account,privateKey,code, callback) {
	    result = new Object()
        if (typeof(db_2[account]) !== 'undefined'){
            if (db_2[account].code != code){
                db_2[account].attempts--;
                if (db_2[account].attempts <= 0){
                    logger.log("Incorrect code, Exceeded the number of attempts. Account="+account+" Attempts="+db_2[account].attempts+"Stored="+db_2[account].code+"Sended="+code);//, "Token=\"\""+status.authtoken);
                    delete db_2[account];
                    result.status =  global.CODE_MAX_MISTAKES;
                    callback(result);
                }   else {
                    logger.log("Incorrect code. Account="+account+" attempts="+db_2[account].attempts+"Stored="+db_2[account].code+", Sended="+code);//, "Token=\"\""+status.authtoken);
                    result.status = global.CODE_INCORRECT;
                    callback(result);
                }
            } else {

                var consult = SQL_SELECT_WHERE.replace('%1'," account = '"+ account+"'");
//                console.log(consult);
                sql_exec(consult,function(results){
                    if (results.status != global.OK) {
                        callback(result);
                    }
                    else { // check if 0 return results
                        // REMOVE
                        // -----BEGIN RSA PRIVATE KEY-----
                        // -----END RSA PRIVATE KEY-----
                        privateKey = privateKey.split("-----")[2]
                        if (typeof (results.result.rowCount) !== 'undefined') {
                            if ((results.result.rowCount) == 0) {
                                var consult = SQL_ADD_ROW.replace('%1', account)
                                consult = consult.replace('%2',  privateKey)
                                consult = consult.replace('%3', '')
                                sql_exec(consult,callback );
                            } else {
                                //var result = //if ((results.length) > 0) {
                                var consult = SQL_UPDATE.replace('%1',"privateKeyid='"+privateKey+"',GCMId=''")// YA existe
                                consult = consult .replace('%2',"account='"+account+"'")// YA existe
//                                console.log(consult);
                                sql_exec(consult,callback);
                            }
                        }
                    }
                })
                delete db_2[account];
                // El código de autenticación y los intentos guardar en memoria siempre,
            }
        }
        else {
              logger.log("Incorrect Account. account="+account+", Code="+code);
              result.status = CODE_UNDEFINED;
              callback(result)
        }
        return;
	},
	
	addNovalidate: function (account,code) {
		db_2[account] = new Object();
		db_2[account].code = code;
		db_2[account].attempts = global.myProperties.get('attempts');
    	logger.log("Added to db_2 OK, Account="+account+", AUTH CODE="+code+", ATTEMPS="+global.myProperties.get('attempts'));//, "Token=\"\""+status.authtoken);

	},
    checkContacts: function (contacts, callback) {
        var consult = SQL_SELECT.replace("%select", "account");
        consult = consult.replace("%from", "users")
        if (contacts.length   > 0){
            var where = "account IN ('"+ contacts[0]+"'";
            for (var i = 1; i < contacts.length ; i++){
                where += ",'"+contacts[1]+"'";
            }
            where += " )"
            consult = consult.replace("%where", where)
            console.log(consult);
            sql_exec(consult,function (results){
                console.log("despues consulta"+results.status)
                if (results.status == global.OK) {
                    // TODO comprobar si no hay resultados y si se hace consulta
                    var result = new Object
                    result.status = global.OK;
                    console.log("%j",results)
                    if (typeof (results.result) !== 'undefined') {
                        result.contacts = results.result.rows;
                    }
                    callback(result);
                }
                else {
                    var result = new Object
                    result.status = results.status;
                    callback(result)
                }
            });
        } else {
            var result = new Object
            result.status = global.ERR
            callback(result)
        }


   },

	
	getContacts: function (callback) {
        sql_exec(SQL_SELECT_ALL,function(results){
            callback(results);
        })
	},
	setGCMId : function(account, GCMId, callback){
        getContact(account, function (result){
//            console.log("(getGCMId)Results: %j",result)
            if (result.status != global.OK){
               callback(result);
            } else if (typeof (result.result) !=='undefined') {
                var consult = SQL_UPDATE.replace('%1',"GCMId='"+GCMId+"'")// YA existe
                consult = consult .replace('%2',"account='"+account+"'")// YA existe
                sql_exec(consult,callback);
            } else {
                result.status = global.ERR
                callback(result);
            }
        })
	},

    getGCMId : function(account,callback){
        getContact(account, function (result){
//            console.log("(getGCMId)Results: %j",result)
            if (result.status != global.OK){
               callback(result);
            } else if (typeof (result.result) !=='undefined') {
//                console.log("%j",result.result)
                results = new Object()
                results.status = global.OK;
                results.GCMId = result.result.gcmid;
                callback(results)
            } else {
                result.status = global.ERR
                callback(result);
            }
        })

    },


    getPrivateKey : function(account,callback){
        getContact(account, function (result){

            if (result.status != global.OK){
               callback(result);
            } else if (typeof (result.result) !=='undefined') {
                results = new Object()
                results.status = global.OK;
                results.privateKeyId = result.result.privatekeyid;
                callback(results)
            } else {
                result.status = global.ERR
                callback(result);
            }
        })

    },

	getContactsNovalidate: function () {
		return db_2;
	},

	getContactsFromChat: function(chatId){
	    return chatId;
	}
}
