var app = angular.module('bloggerApp', ['ngRoute']);              

 
/* Route Provider */
app.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home.html',
        controller: 'homeController',
        controllerAs: 'vm'
      })
      .when('/blog-add', {
        templateUrl: 'blogAdd.html',
        controller: 'blogAddController',
        controllerAs: 'vm'
      })
      .when('/blog-list', {
        templateUrl: 'blogList.html',
        controller: 'blogListController',
        controllerAs: 'vm'
      })
      .when('/blog-edit/:id', {
        templateUrl: 'blogEdit.html',
        controller: 'blogEditController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
     
      });
      $routeProvider.html5Mode(true);
      
  });
  
 

/* Home Controller */
app.controller('homeController', function () {
    var vm = this;
    vm.pageHeader = {
        title: 'A to Z blogs',
        strapline: 'A to Z blogs'
    };
    vm.message = 'Welcome to my blog';
});

//Controller for listing blogs
app.controller('ListController',
    function ListController(blogs, authentication) {
        var vm = this;
        vm.title = 'Blog List';

        blogs.listBlogs().then(function(response) {
            vm.blogs = response.data;
            vm.message = "Blogs found";
        }, function(error) {
            vm.message = 'Error fetching blog ';
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

function addBlog($http, data) {
    return $http.post('/api/blogs', data);
}


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
