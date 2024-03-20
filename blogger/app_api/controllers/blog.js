var mongoose = require('mongoose');

var request = require('request');

var Blog = mongoose.model('Blog');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.blogList = function(req, res) {
    console.log("in blogList");
    Blog.find({}).exec(function(err, blogs) {
        if (err) {
            sendJSONresponse(res, 500, err);
            return;
        }
        sendJSONresponse(res, 200, blogs);
    });
};

//returns a single blog when given an id //
module.exports.blogReadOne = function(req, res) {
    console.log("in blogReadOne");
    Blog.findById(req.params.blogid).exec(function(err, blog) {
        sendJSONresponse(res, 200, blog);
    });
};

// a put function that updates blog when given an ID //

module.exports.blogReadOne = function(req, res) {
	console.log("in blogReadOne");
    Blog.findById(req.params.blogid).exec(function(err, blog) {
        sendJSONresponse(res, 200, blog);
    });
};