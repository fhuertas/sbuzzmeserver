

var configFile = "config.properties";
var sec = require('./SbuzzMeSecurity');

var parser = require('properties-parser');
var properties = parser.createEditor(configFile);
global.myProperties = properties;

var restClient = require('./SbuzzMeRestClient');
var db = require('./SbuzzMeDAO');

var number = "(+34) 653264427"
var number = "666"
var number = "(+34) 653264427"
var code = "0000";
var key = sec.generatePrivateKey();




{
    var status = new Object();
    status.status= global.OK;
    var min = global.myProperties.get('minNumberRandom');
    var max = global.myProperties.get('maxNumberRandom');
    var authcode = parseInt((Math.random() * (max-min)) );//parseInt(max) - parseInt(min));
    authcode += parseInt(min);
    db.addNovalidate(number,authcode);
    status.authcode=  authcode ;

    console.log("Register OK, Account="+number+", AUTH CODE="+status.authcode);//, "Token=\"\""+status.authtoken);
    //db.addContact(fields.contact,key.toPrivatePem().toString(),status.authcode);
}

/*db.addNovalidate(number,"0000");
db.addAccount(number,key.toPrivatePem().toString(),"0000",function(results){
    console.log("%j",results);
    return;
})*/
/*db.getContact(number, function(results) {
    console.log("%j", results);
})*/


db.getGCMId(number, function(results) {
    console.log("-------------------------------------")
    console.log("%j", results);
})
//db.getContacts(function(results) {
//    console.log("-------------------------------------")
//    console.log("%j", results);
//    return;
//})

return;

var to = "(+34) 653264427"
var from = "(+34) 653264427"
var contact = db.get(to);
var tt = [];
tt[0] = contact.GCMId
console.log(tt);
restClient.sbuzz(tt,from);


from = "Periiirque"
contact = db.get(to);
tt = [];
tt[0] = contact.GCMId
console.log(tt);
restClient.sbuzz(tt,from);

from = "BumBum"
contact = db.get(to);
tt = [];
tt[0] = contact.GCMId
console.log(tt);
restClient.sbuzz(tt,from);

return;


var https = require('https');

console.log(contact)
var tt = "-"+contact;




var datas = '{ "data": { "message": "algo", "time": "now" }, "registration_ids": ["'+ contact.GMCId+'"] }'
var msg = JSON.parse(datas);

var leng = Buffer.byteLength(datas, 'utf8');



var postheaders = {
    'Content-Type' : 'application/json',
    'Authorization' : 'key=AIzaSyD4db5gqWO053uMJBbe8EQbizJ8qIcH5wc',
    'Content-Length' : Buffer.byteLength(datas, 'utf8')
};

var optionspost = {
    host : 'android.googleapis.com', // here only the domain name
    // (no http/https !)
    port : 443,
    path : '/gcm/send', // the rest of the url with parameters if needed
    method : 'POST', // do GET
    headers : postheaders
};


var reqPost = https.request(optionspost, function(res) {
    console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
//  console.log("headers: ", res.headers);

    res.on('data', function(d) {
        console.info('POST result:\n');
        process.stdout.write(d);
        console.info('\n\nPOST completed');
    });
});

reqPost.write(datas);
reqPost.end();
reqPost.on('error', function(e) {
    console.error(e);
});

return ;

/*var ss = '{"contact":"ZiVgTjTC2N4FoYLONNIEJYCzQSopORXR6BSqbxdkvrDvRs3BaMug68RPJbZt9t8+tASxvl+mEdy9\nXyw9k4qY4pXgN7Mn0OfDeRgntDZP+6iafNQJVlWZ7nMYwwUd5gGr\/Ywy3W1tXTkAmE6jhByybFql\nCa9Si3s4Whq9iwTpBXM2q+XwMVwiT0YHP\/RFIkvB5JxBizhZv4cLyZukFKLazm0IAxUpBIr5SKY3\nir1Q1JShG4dY+5IT32Jdy307qZCnTRSGcn5ZbokRL+R2XVBolAZV3nuV2ZCSNFf7nPyen+2tyYhQ\nzT3xV4KIYZc47JnB1PHPxugoWQPHqsJsTPm5zA==\n","KeyChatId":"lpW7m24PdDUCpE0UJ2Zd6Qx+fGd6eKVAqL+HgYoSqTQm8Ztc1oVE6XoHQ5ZI9ktHfxwrUSXHw4b2\nrOWyCJa7TRZzOkaqROLEQDgCz87ktSZVJdX8LxaSjtbXWZ95hAeZvNf8CAYtf670WfsS\/E+gEXrG\nZxegYVx880CRyHQa+g+0M\/\/tN13XD\/Mx\/mluNfN4aySfKFD\/bWu2yUHrPPV2t3s\/Ql8uFLrUrMEQ\nvh730sPNfngs+nLqcnCH6LMc4uzGv0ejtk2JC9gUZDuCKmWNUbBSqQHW\/f8kLpPw+7noBJkp4fOu\nRb+kMwtimUzoZvElji0OPWS5iFkwWIanHL33iw==\n"}'
ss.replace(/\n/g,'')
var ee = JSON.parse(ss);
return ;

var ursa = require('ursa')
var sec = require('./SbuzzMeSecurity');

var sKey2 = "-----BEGIN RSA PRIVATE KEY-----\n" +
            "MIIEpAIBAAKCAQEAva8oN45h7PcR5hk/z/zwUleN7JW8T/Q7JFQTDKl/LbNSckv9\n" +
            "sBMC+M8SHMmKTmw6HBDFS2EE3TiiYz9H1ll4I8FjQAMxYV51Xt6x7+lq71JlviL+\n" +
            "rZc4mztKbwgSxbcgRqGJvXWpetvZhUdxypcBFq+yYse9OlxJJ6hofRYReCPk18XZ\n" +
            "RK+GiMfLPq8/DlHkskbbz+mHWWEoCc6hKAR6DV+Xm/gwAvY4Vni5nHCZUHqnn1b6\n" +
            "SGiRYfQszFxGbB5TS4vf7bvclkGZDtqOL9xi/2Uzr5WvrKID7SuPetNzLYUKFySU\n" +
            "IwA7qwIeKTe3maj1GVMTGZB9pZ3hfcj99GCQoQIDAQABAoIBAHou5KH8tjl04POt\n" +
            "2fv4uzjfKw11WkrKUHpTKb4jREfE1dvH9U7AwE5S3CDs9YkUj83aQ6wNf5ucSoXR\n" +
            "kk2RbiDiBjOKmvlUZhhJLKcUXQxxsBXs5s4ctZrQc17X/XecQU8d6OLAcv4vtYrz\n" +
            "fWn5IPtjC24zqUF5hqnkAgJo/7G5mGNraxKj/NIPTf9Ta7a3GIWeSrZCzGR4bKq0\n" +
            "0IA92h7TQZTjQMR/wuKtNXBbWwgVJTGTVtBaik/7GblFneK/9tJsvFRPzaKVKfVd\n" +
            "LRg6jUc9CE8+Zoo1Co+U/q+k80KLFuaFO30SC2jlSqkht99oEzH1oubr4nghNQJf\n" +
            "ZXwSNUECgYEA74LZVRtUY3sx37MQZse79hE/xefhHMnxYObpYXRR4gnrdDlpomc2\n" +
            "X1Tp6s/vdP7GW7x01ea4oXjWsU3OyiPtySvd3qxFb1ypnFpCmbGJq5ySYAbEERKs\n" +
            "Lr7GfKoXFTWioQdO/iiuBxa3TCKNSrC5OJjV7e6LLQ59BikznlkJO2kCgYEAyr4o\n" +
            "NAExReKxXDhqzTnXAvtwnNl84yUrNY1pARzwiZCBKu8dH928nPY6twSIZfrHbvBi\n" +
            "leGEsgW3rCOZjWF7+YO8TLluBaJRSAmpSjCxAWUNo92obUDckhn0gh6rQrNgBX15\n" +
            "YsH+XvyOR/2BqXEjfAoP7H6o0LVg5l6qcPvkHHkCgYAZ2GTbajeRBJo9KXV7odIG\n" +
            "m5XmJT+Fe8UwT7qfaY3sdmWSBSABBmI3p1IWpJmSZmvBOnThICSMSB3ixCKsbXQb\n" +
            "YUBv5ucXPUiQNq05KI9SlXK2KgS+UuWBpdSFX1VeVItYFRHRG1KsMSdWb+QPS0Kx\n" +
            "eMydAEDEe+vB3nBThggZAQKBgQCmOr9v1EJ4EGRnPoKi/feCpHIyyEeTXdhNskIT\n" +
            "/Yxi3i5p61+vzvhkoaaGhJrpMnLuTP4n8Z4A8Jsl8pJlzzX84Lw1FBxXVjzamcFJ\n" +
            "6R5YDGjgoE8GNRYkXE+TmF3G9JeYKMar6G8NpnlqITp8mR0FCKMBvt/fL7fhamDI\n" +
            "/l6L0QKBgQDAoDhV6D+lx9QZHwArBif8M/FvFXq43K1EMoXb+k63xfkiCKhsrpgk\n" +
            "8j8scb7OUmdEVH/t/4InvKWSjjen7lsO7XSAdIqfqt33piDRaiuTzoDz+cMhrzHP\n" +
            "5Nsr5el+k7jVYk8lHIVSrjjQB0xHK+I2ixmed0Dgx0d9/OaGQyyi5A==\n" +
            "-----END RSA PRIVATE KEY-----"
var sKey3 = "-----BEGIN PUBLIC KEY-----\n" +
            "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAva8oN45h7PcR5hk/z/zw\n" +
            "UleN7JW8T/Q7JFQTDKl/LbNSckv9sBMC+M8SHMmKTmw6HBDFS2EE3TiiYz9H1ll4\n" +
            "I8FjQAMxYV51Xt6x7+lq71JlviL+rZc4mztKbwgSxbcgRqGJvXWpetvZhUdxypcB\n" +
            "Fq+yYse9OlxJJ6hofRYReCPk18XZRK+GiMfLPq8/DlHkskbbz+mHWWEoCc6hKAR6\n" +
            "DV+Xm/gwAvY4Vni5nHCZUHqnn1b6SGiRYfQszFxGbB5TS4vf7bvclkGZDtqOL9xi\n" +
            "/2Uzr5WvrKID7SuPetNzLYUKFySUIwA7qwIeKTe3maj1GVMTGZB9pZ3hfcj99GCQ\n" +
            "oQIDAQAB\n" +
            "-----END PUBLIC KEY-----"

var account_name = "(+34) 6"
var _GCM = "IRuucSwnyBfsBwEcwYjzP/MnV2qNt5G0mps6Ca7n9nafSuK+9/xHbsVdtvKZTnIu6NKBLRzKMO8I\n" +
           "sJcwUi1fNrSZByem73Vn7/nF1pZt5KQEGqOWF8VQq80H2K0ZThHZGl1FZg88dTQWZF3TTB9CAbNf\n" +
           "MVxzg90E9IFwi1ZbYR5J6Qlo+JWxTUbsJl3zLn/IP+RAOLg1fNb4cD2yxfewTHgNrqGsqcFnxPpy\n" +
           "Me28izlYrVWyTTDFAZlWwcM9JpazZS0C+hw/LsFj8ynvadJU6ja53UPPM41D5HMrHhhCpU8yeJk6\n" +
           "85eW6EtFfikkYx8IHVUcBpgd1c6Zi/vStZzjFw=="
var bytes = [];

var origin = "APA91bFVk6sIm4rDnHdWKzn1KcF7ijxHr4qr_2IVXQF7Rcj2XJ8Hm5lOtkF1w1k7TwW0dY2q-8MZHAMl7EgwzbJlR8FfLDqr9hV_J5T8V7z8I3bSTaHymlgswbfuQkVOHWtLjfy1xo759dF_qRggAqVktFtAJCY2MA";
var cifrado = "Mf6NPTU+v9+q4jAm+qtxcu/28jHBA6tquk2xxhB50Eng27vmneG5AwSq2tciLMrhn8v4Lg+fjm06\n" +
              "l4VLgD+onHJVRlUQRrNEzaDQP2SgL9kdhM5yRjKy8z5ZAlVbpLLA+i7XUnj/4enbKldkEq5MfTh9\n" +
              "VlD59F3q2RqWIBbm8r2l9IrDhI6JoOStClu/ep8OmOmvsapOheNDhomnymPVTX7CsYpy/DVcJI0i\n" +
              "ii8OT7GHgcU8G4pOK8dn2iYcoTsd392XdkHdNlSJa877F/KSULD4cbyBBkIJzoZkNOYBXRkM6AUa\n" +
              "X03VWGz33dNn8I+/WJpnRjsVBvObimXF8gCDXQ==\n"


/*var origin_base64 = "QVBBOTFiRlZrNnNJbTRyRG5IZFdLem4xS2NGN2lqeEhyNHFyXzJJVlhRRjdSY2oyWEo4SG01bE90\n" +
                    "a0YxdzFrN1R3VzBkWTJxLThNWkhBTWw3RWd3emJKbFI4RmZMRHFyOWhWX0o1VDhWN3o4STNiU1Rh\n" +
                    "SHltbGdzd2JmdVFrVk9IV3RMamZ5MXhvNzU5ZEZfcVJnZ0FxVmt0RnRBSkNZMk1B\n"

var encode_base64 = "C7EYf4+31X4K0Tb1LK0MX61S1b+pzg/Gj3cZyrLGGkae4Tlkf0Ew/BLxlqiRJjSn6cZt+Lj6DTvg\n" +
                    "rs7LUolaJY2NNMKClGnN1Q+L0tcuPEd30XUJpFQ858ohv+WBgKwW4gr0YY4HVtJUnHBb/N6EZ11A\n" +
                    "ZM26F06QjPr0FjSHg//ru14RJtuNmgvcOEqxG2hcwhHEpQB4KRQ/N25IPFFsGAaVspQod07P0EG9\n" +
                    "qP3GQg3YJTKgcdOqIEwqDUiFP0xG+tkpW+XvBjuATNn19TmAZPle8s/X7h/QGc0V6nqa+7WUQ8OB\n" +
                    "Z6SlQ+XRvb6zR56mzbxFfWSKhs067PscFLWDvA==\n"
/*var encode_base64_2 = "C7EYf4+31X4K0Tb1LK0MX61S1b+pzg/Gj3cZyrLGGkae4Tlkf0Ew/BLxlqiRJjSn6cZt+Lj6DTvg" +
                        "rs7LUolaJY2NNMKClGnN1Q+L0tcuPEd30XUJpFQ858ohv+WBgKwW4gr0YY4HVtJUnHBb/N6EZ11A" +
                        "ZM26F06QjPr0FjSHg//ru14RJtuNmgvcOEqxG2hcwhHEpQB4KRQ/N25IPFFsGAaVspQod07P0EG9" +
                        "qP3GQg3YJTKgcdOqIEwqDUiFP0xG+tkpW+XvBjuATNn19TmAZPle8s/X7h/QGc0V6nqa+7WUQ8OB" +
                        "Z6SlQ+XRvb6zR56mzbxFfWSKhs067PscFLWDvA=="
*/
/*var recived_encode_base64 = "C7EYf4+31X4K0Tb1LK0MX61S1b+pzg/Gj3cZyrLGGkae4Tlkf0Ew/BLxlqiRJjSn6cZt+Lj6DTvg\n" +
                            "rs7LUolaJY2NNMKClGnN1Q+L0tcuPEd30XUJpFQ858ohv+WBgKwW4gr0YY4HVtJUnHBb/N6EZ11A\n" +
                            "ZM26F06QjPr0FjSHg//ru14RJtuNmgvcOEqxG2hcwhHEpQB4KRQ/N25IPFFsGAaVspQod07P0EG9\n" +
                            "qP3GQg3YJTKgcdOqIEwqDUiFP0xG+tkpW+XvBjuATNn19TmAZPle8s/X7h/QGc0V6nqa+7WUQ8OB\n" +
                            "Z6SlQ+XRvb6zR56mzbxFfWSKhs067PscFLWDvA==\n"
if (encode_base64 == recived_encode_base64)
    console.log("recibido OK")

if (new Buffer(origin_base64,'base64').toString('utf8') == origin){
    console.log("decode from base64 OK")
}                    */


key = ursa.generatePrivateKey()
var privKey1 = ursa.createPrivateKey(sKey2);
var privKey2 = ursa.createPrivateKey(sKey2);
var pubKey1 = ursa.createPublicKey(sKey3);
var pubKey2 = ursa.createPublicKey(sKey3);
pubKey = ursa.createPublicKey(key.toPublicPem());
privKey = ursa.createPrivateKey(key.toPrivatePem());
var crip1 = pubKey1.encrypt(new Buffer(origin), 'utf8', 'base64')
console.log(crip1);
var crip2 = pubKey2.encrypt(new Buffer(origin), 'utf8', 'base64')
console.log(crip2);
crip2 = "iPagSp3LXvRtxWAwDUlvlA5YHiVONe5oBQAmeVohBZVOiEtNjBXHAnwLFjOAqXsnqJdkVQLj3HyR"+
         "45f7sCwBmcv1+9R8Zn2OjZN/NK+q34CdewgPTE+mBFA/7V1YfO/wtuvz9tZ7735ALiaQU8Vt+jIY"+
         "slRUxDjDr9Tqat0PbjtwngKoLLVYKMQhxUSkbRKi17j+2QX6HIa8QSRgBjdkf94yu1c6HOg90uaX"+
         "XxmNlwSdigix8elLMqqf9s8uK4Ep4KFnI6jfTOhCfNkXKidrLdJQHokP4WQpCOtd8p8nT6kwAxd4"+
         "Zdlg/fSab6fAJd+OB1c6b9RVEvQZpqVgeU/D/A=="

//crip = "AtlhbMENuJrDRatLCijrRS+v+aD0RowETFQVw3QuGKEQXiBwmkc/FqFTuXhOSD3KvYQSmL8Esh6wHqfALR94tWeWHK8EQDqGL3SIeMKiXZyZmNvBkEM+3fQY0eRaM0QIereaW/pPzHd5VcSm54MjsKQolM/tO8Ybk2DbEwvZ4AEg4XTJ9Qnw50AJbRijk1TDydRkv7AH0auX+tLCsjygwvgHfPUn9q+wA9ULb+qujR9bj/8ERsDotFsXkH/LzV8irE60D6ZVVMCVIN86fY3xtAQzquGsu4Z8fymNElAK3ZUWrKvD168W1HiMOH1IZujR3nLMa0jN1S+0x5xqJkBeoQ=="
var decrip1 = privKey2.decrypt(crip1,'base64','utf8')
var decrip2 = privKey1.decrypt(crip2,'base64','utf8')
var decrip1 = privKey1.decrypt(crip1,'base64','utf8')
console.log(decrip1)
console.log(decrip2)






//console.log(privKey.decrypt(recived_encode_base64, 'base64', "utf8"))





//var decode = sec.decode(buf,privKey);
//console.log(decode)

//console.log(new Buffer(origin_base64,'base64').toString('utf8'));

/*var buffer_decode = new Buffer(encode_base64_2);

if (buffer_decode.toString('base64') == origin_base64){
    console.log("Base64 OK")
}   else {
    console.log(buffer_decode.toString('base64'))
    console.log(origin_base64)
}*/


/*for (var i = 0; i < _GCM.length; ++i)
{
   bytes.push(_GCM.charCodeAt(i));
}
var cifrado = new Buffer("IRuucSwnyBfsBwEcwYjzP/MnV2qNt5G0mps6Ca7n9nafSuK+9/xHbsVdtvKZTnIu6NKBLRzKMO8I" +
                       "sJcwUi1fNrSZByem73Vn7/nF1pZt5KQEGqOWF8VQq80H2K0ZThHZGl1FZg88dTQWZF3TTB9CAbNf" +
                       "MVxzg90E9IFwi1ZbYR5J6Qlo+JWxTUbsJl3zLn/IP+RAOLg1fNb4cD2yxfewTHgNrqGsqcFnxPpy" +
                       "Me28izlYrVWyTTDFAZlWwcM9JpazZS0C+hw/LsFj8ynvadJU6ja53UPPM41D5HMrHhhCpU8yeJk6" +
                       "85eW6EtFfikkYx8IHVUcBpgd1c6Zi/vStZzjFw===", 'base64')
var privKey = sec.regeneratePrivateKey(sPrivateKey);
var decode = sec.decode(cifrado,privKey);
console.log(decode)

console.log(new Buffer("Hello World").toString('base64'));

console.log(new Buffer("SGVsbG8gV29ybGQ=", 'base64').toString('ascii'))   */
