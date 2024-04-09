var express = require('express');
var router = express.Router();
var ctrlBlog = require('../controllers/blog');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Blogger' });
});

/* Return a list of blogs */
router.get('/api/blogs', ctrlBlog.blogList);

/* Return a single blog given an id */
router.get('/blogs/:id',ctrlBlog.blogReadOne);

/* Add a blog */
router.post('/blogs', ctrlBlog.blogCreate);

/* Update a blog given an id*/
router.put('/blogs/:id', ctrlBlog.blogUpdateOne);

/* Delete a blog given an id */
router.delete('/blogs/:id', ctrlBlog.blogDelete);


module.exports = router;
