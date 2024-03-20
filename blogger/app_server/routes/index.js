var express = require('express');

var router = express.Router();

var ctrlBlog = require('../controllers/blog');
/* Routes to blog and home */
router.get('/', ctrlBlog.home); 
router.get('/blog-list', ctrlBlog.blogList);
router.get('/blog-add', ctrlBlog.blogAdd);
router.get('/blogs/edit/:id', ctrlBlog.blogEdit);
router.get('/blogs/delete/:id', ctrlBlog.blogDelete);

module.exports = router;
