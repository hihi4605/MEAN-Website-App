const { model } = require('mongoose');
const Blog = require('../models/schema');

module.exports.home = function(req, res) {
  res.render('home', {title: 'Home Page'});
};

module.exports.blogAdd = function(req, res) {
  res.render('blogAdd', {title: 'Add Blog'});
};

module.exports.blogEdit = function(req, res) {
  res.render('blogEdit', {title: 'Edit Blog'});
};

module.exports.blogDelete = function(req, res) {
  res.render('blogDelete', {title: 'Delete Blog'});
}

const { v4: uuidv4 } = require('uuid');
module.exports.blogList = async (req, res) => {
  res.render('blogList', { 
      title: 'Blog List', 
      blogs: [
          { id: uuidv4(), blogTitle: "First Blog", blogText: "First Post!", createdOn: new Date() },
          { id: uuidv4(), blogTitle: "Second Blog", blogText: "Second Text.", createdOn: new Date() },
          { id: uuidv4(), blogTitle: "Third Blog", blogText: "More Text!!!!", createdOn: new Date() },
      ]
  });
};