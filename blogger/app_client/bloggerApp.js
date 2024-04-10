var app = angular.module('bloggerApp', ['ui.router']);              
//Router provider
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('/', {
            url: '/',
            templateUrl: '/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        })
        .state('/blogList', {
            url: '/blogList',
            templateUrl: '/blogList.html',
            controller: 'ListController',
            controllerAs: 'vm'
        })
        .state('/blogAdd', {
            url: '/blogAdd',
            templateUrl: '/blogAdd.html',
            controller: 'AddController',
            controllerAs: 'vm'
        })
        .state('/blogEdit/:blogid', {
            url: '/blogEdit/:blogid',
            templateUrl: '/blogEdit.html',
            controller: 'blogEditController',
            controllerAs: 'vm'
        })
        .state('blogDelete/:blogid', {
            url: '/blogDelete/:blogid',
            templateUrl: '/blogDelete.html',
            controller: 'DeleteController',
            controllerAs: 'vm'
        });
    // Default fallback for unmatched urls
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
//Service for API calls
app.service('BlogService', ['$http', function($http) {
    var apiBaseUrl = '/api/blogs';

    this.listBlogs = function() {
        return $http.get(apiBaseUrl);
    };

    this.addBlog = function(blog) {
        return $http.post(apiBaseUrl, blog);
    };

    this.getBlog = function(blogId) {
        return $http.get(apiBaseUrl + '/' + blogId);
    };

    this.updateBlog = function(blogId, blog) {
        return $http.put(apiBaseUrl + '/' + blogId, blog);
    };

    this.deleteBlog = function(blogId) {
        return $http.delete(apiBaseUrl + '/' + blogId);
    };
}]);
//Controller for navigation
app.controller('NavController', ['$location', 
    function NavigationController($location){
        var vm = this;
        vm.currentPath = $location.path();
}]);

//Controllers
app.controller('HomeController', [function() {
    var vm = this;
    vm.title = 'Christians Blogsite';
    vm.message = 'Welcome to my blogsite!';
}]);

//Controller for listing blogs
app.controller('ListController', ['BlogService', function(BlogService) {
    var vm = this;
    vm.blogs = [];
    vm.title = 'Blog List';

    BlogService.listBlogs().then(function(response) {
        vm.blogs = response.data;
    }, function(error) {
        console.error('Error fetching blogs:', error);
    });
}]);



// Add a controller for the Add Blog page
app.controller('AddController', ['BlogService', '$location', function(BlogService, $location) {
    var vm = this;
    vm.blog = {};
    vm.title = 'Add Blog';

    vm.addBlog = function() {
        BlogService.addBlog(vm.blog).then(function(response){
            $location.path('/blogList');
        }, function(error){
            console.error('Error adding blog:', error);
        }); 
    };
}]);

// Controller for editing blogs
app.controller('EditController', ['$stateParams', '$location', 'BlogService', 
    function EditController($stateParams, $location, BlogService) {
        var vm = this;
        var blogId = $stateParams.blogid;
        vm.blog = {};
        vm.title = 'Edit Blog';

        BlogService.getBlog(blogId).then(function(response) {
            vm.blog = response.data;
        }, function(error) {
            console.error('Error fetching blog:', error);
        });

        vm.editBlog = function() {
            BlogService.updateBlog(blogId, vm.blog).then(function(response) {
                $location.path('/blogList');
            }, function(error) {
                vm.message = 'Error updating blog ' + vm.blogId;
            });
        };
}]);



// Controller for deleting blogs
app.controller('DeleteController', ['$stateParams', '$location', 'BlogService', 
    function DeleteController($stateParams, $location, BlogService) {
        var vm = this;
        vm.blog = {};
        var blogId = $stateParams.blogid;
        vm.title = 'Delete Blog';

        BlogService.getBlog(blogId).then(function(response) {
            vm.blog = response.data;
            vm.message = "Blog found";
        }, function(error) {
            vm.message = 'Error fetching blog' + vm.blogId + 'for deletion';
        });

        vm.deleteBlog = function() {
            BlogService.deleteBlog(blogId).then(function(response) {
                $location.path('/blogList');
            }, function(error) {
                vm.message = 'Error deleting blog ' + vm.blogId;
            });
        };
}]);