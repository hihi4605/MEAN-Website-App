var express = require('express');

var router = express.Router();

var ctrlBlog = require('../controllers/blog');
/* Routes to blog and home */
router.get('/', ctrlBlog.home); 
router.get('/blog-list', ctrlBlog.blogList);
router.get('/blog-add', ctrlBlog.blogAdd);
router.post('/blog-add', ctrlBlog.doAddBlog);
router.get('/blogs/:id', ctrlBlog.editBlog);
router.post('/blogs/:id', ctrlBlog.doBlogEdit);
router.get('/blogs/delete/:id', ctrlBlog.blogDelete);
router.post('/blogs/delete/:id', ctrlBlog.doDeleteBlog);

module.exports = router;
