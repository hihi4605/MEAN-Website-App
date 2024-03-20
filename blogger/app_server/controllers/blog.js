var express = require('express');
var request = require('request');
const {render } = require('../../app');
const Blog = require('../../app_api/models/blog');

var apiOptions = {
  server: "http://localhost"
};

module.exports.home = function(req, res) {
  res.render('home', {title: 'Home Page'});
};

module.exports.blogAdd = function(req, res) {
  res.render('blogAdd', {title: 'Add Blog'});
};

module.exports.doAddBlog = function(req, res) {
  var requestOptions, path, postdata;
  path = '/api/blogs';
  postdata = {
    blogTitle: req.body.blogTitle,
    blogEntry: req.body.blogEntry
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: "POST",
    json: postdata
  };
  request(requestOptions, function(err, response, body) {
    if (response.statusCode === 201) {
      res.redirect('/blogList');
    }
  });
}

module.exports.renderEditBlog = function(req, res, blogdata) {
  res.render('blogEdit', {title: 'Edit Blog ', blog: blogdata});
};

module.exports.editBlog = function(req, res) {
  var requestOptions, path;
  path = '/api/blogs/' + req.params.id;
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };
  request(requestOptions, function(err, response, body) {
    if (response.statusCode === 200) {
      renderEditBlog(req, res, body);
    }
  });
}

module.exports.doBlogEdit = function(req, res) {
  var requestOptions, path, postdata;
  path = '/api/blogs/' + req.params.id;
  postdata = {
    blogTitle: req.body.blogTitle,
    blogEntry: req.body.blogEntry
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: "PUT",
    json: postdata
  };
  request(requestOptions, function(err, response, body) {
    if (response.statusCode === 200) {
      res.redirect('/blogList');
    } 
  });
}

module.exports.renderDeleteBlog = function(req, res, blogdata) {
  res.render('blogDelete', {title: 'Delete Blog', blog: blogdata});
};

module.exports.getDeleteBlog = function(req, res) {
  var requestOptions, path;
  path = '/api/blogs/' + req.params.id;
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };
  request(requestOptions, function(err, response, body) {
    if (response.statusCode === 200) {
      renderDeleteBlog(req, res, body);
    }
  });
}

module.exports.doDeleteBlog = function(req, res) {
  var requestOptions, path;
  path = '/api/blogs/' + req.params.id;
  requestOptions = {
    url: apiOptions.server + path,
    method: "DELETE",
    json: {}
  };
  request(requestOptions, function(err, response, body) {
    if (response.statusCode === 204) {
      res.redirect('/blogList');
    }
  });
}
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
