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
            createdOn: req.body.createdOn,
            author: req.body.author,
            authorEmail: req.body.authorEmail
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
    //when the response body is an array of blogs, map over the array and return a new array of blog objects
    const blogs = responseBody.map(blog => ({
        blogTitle: blog.blogTitle,
        blogEntry: blog.blogEntry,
        createdOn: blog.createdOn,
        author: blog.author,
        authorMail: blog.authorMail,
        _id: blog._id
    }));

    return blogs;
};


//returns a single blog when given an id //
// Read a blog
module.exports.blogReadOne = async function (req, res) {
    const blogId = req.params.blogid;
    console.log("Reading blog:", blogId);

    try {
        const blog = await Blog.findOne({_id: blogId});
        console.log("API:", blog);

        if (blog) {
            sendJSONresponse(res, 200, blog);
        } else {
            sendJSONresponse(res, 404, { "message": "Blog not found" });
        }
    } catch (err) {
        console.log(err);
        sendJSONresponse(res, 400, err);
    }
};


//updates a blog when given an id //
module.exports.blogUpdateOne = async function (req, res) {
    const blogId = req.params.blogid;
    console.log('Updating blog with ID:', blogId);

    const updates = {
        $set: {
            blogTitle: req.body.blogTitle,
            blogEntry: req.body.blogEntry
        }
    };

    try {
        const blog = await Blog.findByIdAndUpdate(blogId, updates, { new: true });
        if (!blog) {
            console.log(`No blog found with ID ${blogId}`);
            return sendJSONresponse(res, 404, { "message": "Blog not found" });
        }
        sendJSONresponse(res, 200, blog);
    } catch (err) {
        console.log('Error updating blog:', err);
        sendJSONresponse(res, 400, err);
    }
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


// Post a comment
module.exports.commentsCreate = async function(req, res) {
    const blogId = req.params.blogid;
    console.log("Adding comment to blog:", blogId);

    if (!req.payload._id) {
        res.status(401).json({ "message": "UnauthorizedError: private profile" });
        return;
    }

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            sendJSONresponse(res, 404, { "message": "Blog not found" });
            return;
        }
        blog.comments.push({
            commentText: req.body.commentText,
            author: req.payload.name,
            authorEmail: req.payload.email
        });

        // Using Promise-based save
        await blog.save();
        sendJSONresponse(res, 201, blog.comments[blog.comments.length - 1]);
    } catch (err) {
        sendJSONresponse(res, 400, err);
    }
};

// Get comments for a blog
module.exports.commentsReadOne = async function(req, res) {
    console.log('Getting comments from blog with ID:', req.params.blogid);

    try {
        const blog = await Blog.findById(req.params.blogid).select('comments');
        if (!blog) {
            sendJSONresponse(res, 404, { "message": "Blog not found" });
            return;
        }
        sendJSONresponse(res, 200, blog.comments);
    } catch (err) {
        sendJSONresponse(res, 400, err);
    }
};


// Post a reply to a comment
module.exports.repliesCreate = async function(req, res) {
    try {
        const blog = await Blog.findById(req.params.blogid);
        if (!blog) {
            return res.status(404).send({message: "Blog not found"});
        }
        const comment = blog.comments.id(req.params.commentid);
        if (!comment) {
            return res.status(404).send({message: "Comment not found"});
        }
        comment.replies.push({
            commentText: req.body.commentText,
            author: req.body.author,
            authorEmail: req.body.authorEmail,
            createdOn: new Date()
        });
        await blog.save();
        res.status(201).json(comment.replies[comment.replies.length - 1]);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Function to handle a like or dislike action
const handleReaction = async function (req, res, reactionType) {
    const blogId = req.params.blogid;
    const commentId = req.params.commentid;
    const userId = req.payload._id;

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return sendJSONresponse(res, 404, { "message": "Blog not found" });
        }

        const comment = blog.comments.id(commentId);
        if (!comment) {
            return sendJSONresponse(res, 404, { "message": "Comment not found" });
        }

        // Find if the user has already reacted
        const reactionIndex = comment.userReactions.findIndex(reaction => reaction.userId.equals(userId));

        // Reaction logic
        if (reactionIndex !== -1) {
            // User has already reacted
            if (comment.userReactions[reactionIndex].reaction === reactionType) {
                // Same reaction - toggle off
                comment.userReactions.splice(reactionIndex, 1);
                reactionType === 'like' ? comment.likes-- : comment.dislikes--;
            } else {
                // Different reaction - switch from like to dislike or vice versa
                comment.userReactions[reactionIndex].reaction = reactionType;
                if (reactionType === 'like') {
                    comment.likes++;
                    comment.dislikes--;
                } else {
                    comment.dislikes++;
                    comment.likes--;
                }
            }
        } else {
            // New reaction - add it
            comment.userReactions.push({ userId: userId, reaction: reactionType });
            reactionType === 'like' ? comment.likes++ : comment.dislikes++;
        }

        await blog.save();
        sendJSONresponse(res, 200, {
            likes: comment.likes,
            dislikes: comment.dislikes,
            userReactions: comment.userReactions
        });
    } catch (err) {
        sendJSONresponse(res, 400, err);
    }
};

module.exports.likeComment = function (req, res) {
    handleReaction(req, res, 'like');
};

module.exports.dislikeComment = function (req, res) {
    handleReaction(req, res, 'dislike');
};