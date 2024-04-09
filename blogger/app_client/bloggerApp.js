var app = angular.module('bloggerApp', ['ui.router']);              
//Router provider
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        })
        .state('blogList', {
            url: '/blogList',
            templateUrl: '/blogList.html',
            controller: 'ListController',
            controllerAs: 'vm'
        })
        .state('blogAdd', {
            url: '/blogAdd',
            templateUrl: '/blogAdd.html',
            controller: 'AddController',
            controllerAs: 'vm'
        })
        .state('blogEdit', {
            url: '/blogEdit/:blogid',
            templateUrl: '/blogEdit.html',
            controller: 'EditController',
            controllerAs: 'vm'
        })
        .state('blogDelete', {
            url: '/blogDelete/:blogid',
            templateUrl: '/blogDelete.html',
            controller: 'DeleteController',
            controllerAs: 'vm'
        })
        .state('register', {
            url: '/register',
            templateUrl: '/register.html',
            controller: 'RegisterController',
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
app.controller('AddController', ['$http', '$location', function($http, $location) {
    var vm = this;
    vm.pageHeader = {
        title: 'Add Blog'
    };

    vm.submitBlog = function() {
        var newBlog = {
            blogTitle: vm.blogTitle,
            blogEntry: vm.blogEntry
        };

        // Use $http.post to send the new blog data to the server
        $http.post('/api/blogs', newBlog)
            .then(function(response) {
                // If successful, redirect to the blog list page
                $location.path('/blogList');
            })
            .catch(function(error) {
                // Handle error if necessary
                console.error('Error adding blog:', error);
            });
    };
}]);

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
