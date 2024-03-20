var mongoose = require('mongoose');

var request = require('request');

var Blog = mongoose.model('Blog');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

/* GET a list of all locations */
module.exports.blogList = function(req, res) {
    console.log('Getting blog list');
    Blog
        .find()
        .exec(function(err, results) {
          if (!results) {
            sendJSONresponse(res, 404, {
              "message": "no blogs found"
            });
            return;
          } else if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
          }
          console.log(results);
          sendJSONresponse(res, 200, buildBlogList(req, res, results));
        }); 
  };

var buildBlogList = function(req, res, results) {
    var Blogs = [];
    results.forEach(function(obj) {
      Blogs.push({
        blogTitle: obj.blogTitle,
        blogEntry: obj.blogEntry,
        createdOn: obj.createdOn,
        _id: obj._id
      });
    });
    return Blogs;
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

