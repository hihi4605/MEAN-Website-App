var app = angular.module('bloggerApp', ['ngRoute']);              

 
/* Route Provider */
app.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home.html',
        controller: 'homeController',
        controllerAs: 'scope'
      })
      .when('/blog-add', {
        templateUrl: 'blogAdd.html',
        controller: 'blogAddController',
        controllerAs: 'scope'
      })
      .when('/blogList', {
        templateUrl: 'blogList.html',
        controller: 'blogListController',
        controllerAs: 'scope'
      })
      .when('/blog-edit/:id', {
        templateUrl: 'blogEdit.html',
        controller: 'blogEditController',
        controllerAs: 'vm'
      })

      $routeProvider.otherwise({redirectTo: '/'});
 

  });
  
 

  app.controller('homeController', function($scope) {
    $scope.message = "Hello from AngularJS!";
    $scope.title = "AngularJS Test";
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
