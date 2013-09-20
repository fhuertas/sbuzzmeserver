// REQUIRES
require('./SbuzzMeConstants');
var pg = require('pg');

var db_2 = new Object();

/* DATABASE INFO */
var conString =  {
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
        var consult = SQL_SELECT.replace("%select", "account, gcmid");
        consult = consult.replace("%from", "users")
        if (contacts.length   > 0){
            var where = "account IN ('"+ contacts[0]+"'";
            for (var i = 1; i < contacts.length ; i++){
                where += ",'"+contacts[i]+"'";
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
                        result.contacts = [];
                        result.contacts
                        for (var i = 0; i < results.result.rows.length; i++){
                            var contact = new Object
                            contact.account = results.result.rows[i].account;
                            contact.gmcid= results.result.rows[i].gmcid;
                            result.contacts.push(contact);
//                            result.contacts[i] = new Object
//                            result.contacts[i].account = results.result.rows[i].account;
//                            result.contacts[i].GMCId = results.result.rows[i].gmcid;
                        }
                        result.contacts = results.result.rows;
                    }
                    console.log("%j", result)
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
