var mongoose = require('mongoose');

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

  module.exports.blogCreate = async function(req, res) {
    try {
        console.log(req.body);
        const blog = await Blog.create({
            blogTitle: req.body.blogTitle,
            blogEntry: req.body.blogEntry,
        });
        console.log(blog);
        sendJSONresponse(res, 201, blog);
    } catch (err) {
        console.log(err);
        sendJSONresponse(res, 400, err);
    }
};


//returns a single blog when given an id //
module.exports.blogReadOne = function(req, res) {
    console.log("in blogReadOne");
    Blog.findById(req.params.blogid).exec(function(err, blog) {
        sendJSONresponse(res, 200, blog);
    });
};

module.exports.blogUpdateOne = function(req, res) {
    if (!req.params.blogid) {
        sendJSONresponse(res, 404, {
            "message": "Not found, blogid is required"
        });
        return;
    }
    Blog
        .findById(req.params.blogid)
        .exec(
            function(err, blog) {
                if (!blog) {
                    sendJSONresponse(res, 404, {
                        "message": "blogid not found"
                    });
                    return;
                } else if (err) {
                    sendJSONresponse(res, 400, err);
                    return;
                }
                blog.blogTitle = req.body.blogTitle;
                blog.blogEntry = req.body.blogEntry;
                blog.save(function(err, blog) {
                    if (err) {
                        sendJSONresponse(res, 404, err);
                    } else {
                        sendJSONresponse(res, 200, blog);
                    }
                });
            }
        );
};

module.exports.blogDelete = function(req, res) {
    var blogid = req.params.blogid;
    if (blogid) {
        Blog
            .findByIdAndRemove(blogid)
    }
}

// a put function that updates blog when given an ID //


