var mongoose = require('mongoose');
var Blog = mongoose.model('Blog');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.blogList = function(req, res) {
    sendJSONresponse(res, 200, {"status": "success"});
};

module.exports.blogReadOne = function(req, res) {
    Blog.findById(req.params.blogid).exec(function(err, blog) {
        sendJSONresponse(res, 200, blog);
    });
};
