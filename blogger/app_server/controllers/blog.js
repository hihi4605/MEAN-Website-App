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
      res.redirect('/blog-list');
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
      module.exports.renderEditBlog(req, res, body);
    }
  });
};

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

  // Make a PUT request to update the blog
  request(requestOptions, function(err, response, body) {
    if (err) {
      // Handle error from the request
      console.error('Error updating blog:', err);
      return res.status(500).send("Error updating blog: " + err);
    }
    
    if (response.statusCode === 200) {
      // Redirect to the blog list page upon successful update
      res.redirect('/blog-list');
    } else {
      // Handle errors if any
      res.status(response.statusCode).send("Error updating blog: " + body);
    }
  });
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
      // Correct reference to the renderDeleteBlog function
      module.exports.renderDeleteBlog(req, res, body);
    }
  });
}

module.exports.renderDeleteBlog = function(req, res, blogdata) {
  res.render('blogDelete', {title: 'Delete Blog', blog: blogdata});
};

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
      res.redirect('/blog-list');
    }
  });

}
module.exports.blogDelete = function(req, res) {
  res.render('blogDelete', {title: 'Blog Delete'});
}

module.exports.blogList = function(req, res) {
  var requestOptions, path;
  path = '/api/blogs';
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };
  request(requestOptions, function(err, response, body) {
    if (response.statusCode === 200) {
      res.render('blogList', {title: 'Blog List', blogs: body});
    }
  });
}
