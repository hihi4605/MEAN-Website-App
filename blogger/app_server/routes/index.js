var express = require('express');

var router = express.Router();

var ctrlBlog = require('../controllers/blog');
/* Routes to blog and home */
 
//router.get('/blog-list', ctrlBlog.blogList);
//router.get('/blog-add', ctrlBlog.blogAdd);
//router.post('/blog-add', ctrlBlog.doAddBlog);
//router.get('/blog-edit/:id', ctrlBlog.editBlog);
//router.post('/blog-edit/:id', ctrlBlog.doBlogEdit);
//router.get('/blog-delete/:id', ctrlBlog.getDeleteBlog);
//router.post('/blog-delete/:id', ctrlBlog.doDeleteBlog);

module.exports = router;
