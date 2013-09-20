var logger = require('./log.js');
formidable = require('formidable')

function _sbuzzme(direction){
	return false;
}


module.exports = {
    getUrl: function(request, response) {
        logger.log("Start: getUrl");
        var form = new formidable.IncomingForm()
        var status = new Object();
        form.parse(request, function(err, fields, files) {
            var result = new Object();
            var version = fields.version;
            var url = global.myProperties.get(version);
            if (typeof (url) === 'undefined'){// || url == null || url == ''){
                url = global.myProperties.get('default');
            }
            result.status = global.OK;
            result.server = url;
            response.send(result)


        });
        logger.log("End: getUrl");

    }

}


