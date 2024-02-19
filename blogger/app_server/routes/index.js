var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlBlogAdd = require('../controllers/blog');
var ctrlBlogList = require('../controllers/blog');
/* GET home page. */

/* Routes to blog and home */
router.get('/', ctrlHome.home);
router.get('/blogList', ctrlBlogList.blogList);
router.get('/blogAdd', ctrlBlogAdd.blogAdd);
module.exports = router;
