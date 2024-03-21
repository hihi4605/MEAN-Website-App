var mongoose = require('mongoose');

var Blog = mongoose.model('Blog');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};
/* GET a list of all locations */
module.exports.blogList = async function(req, res) {
    console.log('Getting blog list');
    try {
        const results = await Blog.find().exec();
        if (!results || results.length === 0) {
            sendJSONresponse(res, 404, { "message": "No blogs found" });
            return;
        }
        console.log(results);
        sendJSONresponse(res, 200, buildBlogList(req, res, results));
    } catch (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
    }
};

const buildBlogList = function(req, res, results) {
    return results.map(obj => ({
        blogTitle: obj.blogTitle,
        blogEntry: obj.blogEntry,
        createdOn: obj.createdOn,
        _id: obj._id
    }));
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
    const blogid = req.params.id;

    if (!blogid) {
        return res.status(400).json({ message: "Missing blog ID" });
    }

    Blog.findById(blogid)
        .then(blog => {
            if (!blog) {
                return res.status(404).json({ message: "Blog not found" });
            }
            res.status(200).json(blog);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
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
    var blogid = req.params.id; // Use req.params.id to get the blog ID
    if (blogid) {
        Blog.findByIdAndDelete(blogid)
            .then(blog => {
                if (!blog) {
                    return res.status(404).json({ message: "Blog not found" });
                }
                // Redirect to the blog list page
                module.exports.blogList(req, res);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: "Internal server error" });
            });
    } else {
        res.status(400).json({ message: "Missing blog ID" }); // Send 400 Bad Request if ID is missing
    }
};

// a put function that updates blog when given an ID //


