var mongoose = require('mongoose');

var Blog = mongoose.model('Blog');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};
// GET /api/blogs
module.exports.blogList = async function (req, res) {
    console.log("Getting blogList");

    try {
        const blogs = await Blog.find().exec();

        if (!blogs || blogs.length === 0) {
            // If no blogs are found, send a 404 response with a message.
            return res.status(404).json({ "message": "blogs not found" });
        }

        // When blogs are found, send a 200 response with the blogs data.
        res.status(200).json(blogs);
    } catch (err) {
        console.error(err);
        // If there's an error in the process, respond with a 500 status code and the error.
        res.status(500).json({ "message": "Error listing blogs", error: err });
    }
};


const buildBlogList = async function(req, res, results) {
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

// Render blog list
const renderBlogList = function(req, res, responseBody) {
    // Use map to transform each blog into the desired format
    const blogs = responseBody.map(blog => ({
        blogTitle: blog.blogTitle,
        blogText: blog.blogText,
        _id: blog._id
    }));

    return blogs;
};


//returns a single blog when given an id //
module.exports.blogReadOne = async function(req, res) {
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


module.exports.blogUpdateOne = async function(req, res) {
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
module.exports.blogDeleteOne = async function (req, res) {
    const blogId = req.params.blogid;
    console.log("Deleting blog: " + blogId);
    try {
        const blog = await Blog.findByIdAndDelete(blogId).exec();
        if (!blog) {
            console.log("Blog not found: " + blogId);
            sendJSONresponse(res, 404, { "message": "Blog not found" });
            return;
        }
        console.log("Blog id " + blogId + " deleted");
        sendJSONresponse(res, 204, null);
    } catch (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
    }
};


// a put function that updates blog when given an ID //


