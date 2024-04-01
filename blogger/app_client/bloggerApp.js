var app = angular.module('bloggerApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'ngResource']);                

/* Route Provider */
app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/home.html',
      controller: 'HomeController',
      controllerAs: 'vm'
    })
    .when('/blog-add', {
      templateUrl: '/blogAdd.html',
      controller: 'blogAddController',
      controllerAs: 'vm'
    })
    .when('/blog-list', {
      templateUrl: '/blogList.html',
      controller: 'blogListController',
      controllerAs: 'vm'
    })
    .when('/blog-edit/:id', {
      templateUrl: '/blogEdit.html',
      controller: 'blogEditController',
      controllerAs: 'vm'
    })
    .otherwise({
      redirectTo: '/'
    });
});



//*** REST Web API functions ***/

function getAllBlogs($http) {
  return $http.get('/api/blogs');
}

function getBlogbyId($http, id) {
    return $http.get('/api/blogs/' + id);
}

function updateBlogById($http, id, data) {
    return $http.put('/api/blogs/' + id, data);
}

/* Home Controller */
app.controller('HomeController', function HomeController() {
  var vm = this;
  vm.pageHeader = {
      title: 'Christians Blog',
      message: 'Welcome to my blog!'
    };
  
});

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

/* Blog List Controller */
app.controller('blogListController', function BlogListController() {
    var vm = this;
    vm.pageHeader = {
        title: 'Blog List'
    };
    vm.blogs = getBlogs().query();
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
