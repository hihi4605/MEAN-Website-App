var mongoose = require('mongoose');

var sendJSONresponse = function(res, status, content) {	
	res.status(status);
	res.json(content);
};

module.exports.blogList = function(req, res) {
sendJSONresponse(res, 200, {"status" : "success"});
}

module.exports.blogReadOne = function(req, res) {
blogScema.findById(req.params.blogid).exec(function(err, blog) {
    sendJSONresponse(res, 200, blog);});
};




