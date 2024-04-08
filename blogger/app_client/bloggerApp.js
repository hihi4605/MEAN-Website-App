var app = angular.module('bloggerApp', ['ui.router']);              

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

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.controller('HomeController', [function() {
    var vm = this;
    vm.title = 'Christian\'s Blogsite';
    vm.message = 'Welcome to my blogsite!';
}]);

app.controller('ListController', ['$http', function($http) {
    var vm = this;
    vm.pageHeader = {
        title: 'Blog List'
    };
    
    // Fetch all blogs from the API
    getAllBlogs($http)
        .then(function(response) {
            vm.blogs = response.data;
        })
        .catch(function(error) {
            console.error('Error fetching blogs:', error);
        });

    // Function to edit a blog
    vm.editBlog = function(blogId) {
        console.log('Editing blog with ID:', blogId);
        // Redirect to the blog edit page
        // Example: $state.go('blogEdit', { blogid: blogId });
    };

    // Function to delete a blog
    vm.deleteBlog = function(blogId) {
        console.log('Deleting blog with ID:', blogId);
        // Implement logic to delete the blog
    };
}]);

function getAllBlogs($http) {
    return $http.get('/api/blogs');
}
