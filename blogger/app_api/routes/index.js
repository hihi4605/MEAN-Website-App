var express = require('express');
var router = express.Router();
 
var jwt = require('express-jwt');
var auth = jwt({
	secret: process.env.JWT_SECRET,
	userProperty: 'payload'
});
var ctrlBlog = require('../controllers/blog')
var ctrlAuth = require('../controllers/authentication');  // Lab 6

// Define routes for blog operations
router.get('/blogs', ctrlBlog.blogList);    // GET /api/blogs
router.post('/blogs', auth, ctrlBlog.blogCreate); // POST /api/blogs
router.get('/blogs/:blogid', ctrlBlog.blogReadOne); // GET /api/blogs/:blogid
router.put('/blogs/:blogid', auth, ctrlBlog.blogUpdateOne); // PUT /api/blogs/:blogid
router.delete('/blogs/:blogid', auth,ctrlBlog.blogDeleteOne);    // DELETE /api/blogs/:blogid
router.post('/register', ctrlAuth.register);  // Lab 6
router.post('/login', ctrlAuth.login);  // Lab 6

// Lab 8 Comment Routes
router.post('/blogs/:blogid/comments', auth, ctrlBlog.commentsCreate);
router.get('/blogs/:blogid/comments', ctrlBlog.commentsReadOne);
router.post('/blogs/:blogid/comments/:commentid/replies', auth, ctrlBlog.repliesCreate);

router.post('/blogs/:blogid/comments/:commentid/like', auth, ctrlBlog.likeComment);
router.post('/blogs/:blogid/comments/:commentid/dislike', auth, ctrlBlog.dislikeComment);

module.exports = router;