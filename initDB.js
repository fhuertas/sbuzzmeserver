var pg = require('pg');
//or native libpq bindings
//var pg = require('pg').native

account = '(+34) 653264427';
privateKey =
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
GCMId = "APA91bFYymANKUJg8u_Kte15r3yADzCen_0IkxjkU7m_RR1ixpIDoljLGHeLLyY57sb0teEdPRx5kaXF2SJgSkLtxHQadI1tWcm0-q4-ByKFHHiUCyvqvuM0uWvZw20SXI8y926k7YmgNge9omJLl2IgWSQ-BqkMWw";

var conString =  process.env.DATABASE_URL || { 
	host: 'ec2-23-21-196-147.compute-1.amazonaws.com',
	port: '5432', 
	user: 'bqatgfwygpobil',
	password: 'KtdCcNmFYvYAghMzjogFjQ8Z6t',
	database: 'd14166nrb986gg',
	ssl: true };

var SQL_CREATE_TABLE = 'CREATE TABLE users ('+
    'id             serial primary key,' +
    'account        varchar(40) unique,' +
    'privateKeyid   varchar(2800),' +
    'GCMId          varchar(200)' +
')';
var SQL_DROP_TABLE = 'DROP TABLE users'

var SQL_ADD_ROW = "INSERT INTO users (account, privateKeyid, GCMId) VALUES ('"+account+"', '"+privateKey+"', '"+GCMId+"');"

var SQL_SELECT_ALL = "SELECT * FROM users";

var consult =     SQL_CREATE_TABLE;
var consult =     SQL_SELECT_ALL;
var consult =     SQL_ADD_ROW;
var consult =     SQL_DROP_TABLE;
var consult =     SQL_CREATE_TABLE;
console.log(consult)
//var host = "postgres://ec2-23-21-196-147.compute-1.amazonaws.com:5432/d14166nrb986gg'
// Create DB connection params
var client = new pg.Client(conString);
client.connect(function(err) {
    if(err) {
        return console.error('could not connect to postgres', err);
    }

    client.query(consult, function(err, result) {
            if(err) {
                return console.error('error running query', err);
                client.end();
            }else {
                console.log("OK:"+result)
                console.log("%j",result)

//                for (var e  result){
//                    console.log("-"+e)
//                }

        //        console.log(result.rows[0].theTime);
                //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
                client.end();
            }
        });
});

