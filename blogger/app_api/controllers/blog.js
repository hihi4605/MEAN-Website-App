var mongoose = require('mongoose');

var request = require('request');



var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.blogList = function(req, res) {
	console.log("in blogList");
    sendJSONresponse(res, 200, {"status": "success"});
};

module.exports.blogReadOne = function(req, res) {
	console.log("in blogReadOne");
    Blog.findById(req.params.blogid).exec(function(err, blog) {
        sendJSONresponse(res, 200, blog);
    });
};