var app = angular.module('bloggerApp', ['ngRoute'])           

/* Route Provider */
app.config(function($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: 'home.html',
      controller: 'homeController',
      controllerAs: 'vm'
    })
    .when('/blog-add', {
      templateUrl: '/blog-add.html',
      controller: 'blogAddController',
      controllerAs: 'vm'
    })
    .when('/blog-list', {
      templateUrl: '/blog-list.html',
      controller: 'blogListController',
      controllerAs: 'vm'
    })
    .when('/blog-edit/:id', {
      templateUrl: '/blog-edit.html',
      controller: 'blogEditController',
      controllerAs: 'vm'
    })
    .otherwise({
      redirectTo: '/'
    })
    
});
          
      
/*** REST Web API functions ***/
function getAllBlogs($http) {
  return $http.get('/api/blogs');
}

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

/*Home Controller */
app.controller("myHomeController", function($scope) {
  $scope.title = "Christians Website!";
  $scope.message = "Welcome to Christians Website"
});       

/* Blog List Controller */
app.controller('blogListController', function BlogListController($http, $scope) {
  var vm = this;
  
    vm.title = "Blog List";
    getAllBlogs($http).then(function callback(response)
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
