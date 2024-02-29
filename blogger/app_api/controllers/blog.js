var mongoose = require('mongoose');
var blogSchema = mongoose.model('blogSchema');

var sendJSONresponse = function(res, status, content) {	
	res.status(status);
	res.json(content);
};

module.exports.blogList = function(req, res) {
sendJSONresponse(res, 200, {"status" : "success"});
}

