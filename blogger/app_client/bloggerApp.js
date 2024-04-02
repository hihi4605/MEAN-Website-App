var app = angular.module('bloggerApp', ['ngRoute']);                

/* Route Provider */
app.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/home.html',
      controller: 'homeController',
      controllerAs: 'vm'
    })
    .when('/blog-add', {
      templateUrl: 'pages/blogAdd.html',
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
    })
    $locationProvider.html5Mode(true);
});

//*** REST Web API functions ***/

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

/* Home Controller */
app.controller('homeController', function() {
  var vm = this;
  vm.title = "Christians Blog Site"
  vm.message = 'Welcome to my blog!';
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
