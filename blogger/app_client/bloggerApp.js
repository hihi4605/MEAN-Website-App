var app = angular.module('bloggerApp', ['ngRoute'])           

/* Route Provider */
app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'home.html',
      controller: 'HomeController',
      controllerAs: 'vm'
    })
    .when('/blog-add', {
      templateUrl: 'blog-add.html',
      controller: 'AddController',
      controllerAs: 'vm'
    })
    .when('/blog-list', {
      templateUrl: 'blog-list.html',
      controller: 'ListController',
      controllerAs: 'vm'
    })
    .when('/blog-edit/:id', {
      templateUrl: 'blog-edit.html',
      controller: 'EditController',
      controllerAs: 'vm'
    })
    .otherwise({
      redirectTo: '/'
    })
  $routeProvider.html5Mode({enabled: true, requireBase: false});  
});         

/*** REST Web API functions ***/

function getBlogbyId($http, id) {
  return $http.get('/api/blogs/' + id);
}

function listBlogs($http) {
  return $http.get('/api/blogs');
}

function addBlog($http, data) {
  return $http.post('/api/blogs', data);
}

function deleteBlog($http, id) {
  return $http.delete('/api/blogs/' + id);
}

function updateBlogById($http, id, data) {
  return $http.put('/api/blogs/' + id, data);
}

//Controllers
app.controller('HomeController', [function() {
  var vm = this;
  vm.title = 'Christians Blogsite';
  vm.message = 'Blogsite for Web Development class';
}]);

/* Blog List Controller */
app.controller('blogListController', function($http, $scope) {
  var vm = this;
  
    vm.title = "Blog List";
    listBlogs($http).then(function callback(response)
    {
    vm.blogs = response.data;
    vm.message = "getting data";
}, function(error)
{
  vm.message = "Error Listing Blogs"
  console.log("Controller Accessed")
});});

/* Blog Add Controller */
app.controller('blogAddController', function BlogAddController($location) {
    var vm = this;
    vm.pageHeader = {
        title: 'Add Blog'
    };
    vm.blog = {};
    vm.save = function() {
        getBlogs().save(vm.blog, function() {
            $location.path('/blog-list');
        });
    };
});

/* Blog Edit Controller */
app.controller('blogEditController', function BlogEditController($location, $routeParams) {
    var vm = this;
    vm.pageHeader = {
        title: 'Edit Blog'
    };
    vm.blog = getBlogs().get({ id: $routeParams.id });
    vm.save = function() {
        getBlogs().update({ id: $routeParams.id }, vm.blog, function() {
            $location.path('/blog-list');
        });
    };
});
