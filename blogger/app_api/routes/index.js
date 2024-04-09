var express = require('express');
var router = express.Router();
var ctrlBlog = require('../controllers/blog');

/* Return a list of blogs */
router.get('api/blogs', ctrlBlog.blogList);

/* Return a single blog given an id */
router.get('api/blogs/:id',ctrlBlog.blogReadOne);

/* Add a blog */
router.post('api/blogs', ctrlBlog.blogCreate);

/* Update a blog given an id*/
router.put('api/blogs/:id', ctrlBlog.blogUpdateOne);

/* Delete a blog given an id */
router.delete('api/blogs/:id', ctrlBlog.blogDelete);


module.exports = router;
