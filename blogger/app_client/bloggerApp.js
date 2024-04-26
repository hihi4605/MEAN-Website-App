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
        .state('/blogEdit', {
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
        })
        .state('login', {
            url: '/login',
            templateUrl: '/login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        })
        .state('chatRoom', {
            url: '/chatRoom',
            templateUrl: '/chatRoom.html',
            controller: 'ChatRoomController',
            controllerAs: 'vm'
        })
        .state('blogPost', {
            url: '/blogPost/:blogid',
            templateUrl: '/blogPost.html',
            controller: 'ViewController',
            controllerAs: 'vm'
        })
    // Default fallback for unmatched urls
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);


//Service for API calls
app.service('BlogService', ['$http', 'authentication', function($http, authentication) {
    var apiBaseUrl = '/api/blogs';

    var makeAuthHeader = function() {
        var token = authentication.getToken();
        return { headers: { 
            Authorization: 'Bearer ' + token } };
    };

    this.listBlogs = function() {
        return $http.get(apiBaseUrl);
    };

    this.addBlog = function(blog) {
        return $http.post(apiBaseUrl, blog,  makeAuthHeader());
    };

    this.getBlog = function(blogId) {
        return $http.get(apiBaseUrl + '/' + blogId);
    };

    this.updateBlog = function(blogId, blog) {
        return $http.put(apiBaseUrl + '/' + blogId, blog,  makeAuthHeader());
    };

    this.deleteBlog = function(blogId) {
        return $http.delete(apiBaseUrl + '/' + blogId,  makeAuthHeader());
    };

    this.addComment = function (blogId, comment) {
        return $http.post(apiBaseUrl + '/' + blogId + '/comments', comment, makeAuthHeader());
    };

    this.getComments = function (blogId) {
        return $http.get(apiBaseUrl + '/' + blogId + '/comments');
    };
     
    this.likeBlog = function (blogId) {
        return $http.post(apiBaseUrl + '/' + blogId + '/likes', {}, makeAuthHeader());   
    };

    this.dislikeBlog = function (blogId) {
        return $http.post(apiBaseUrl + '/' + blogId + '/dislikes', {}, makeAuthHeader());
    };

    this.likeComment = function (blogId, commentId) {
        return $http.post(apiBaseUrl + '/' + blogId + '/comments/' + commentId + '/like', {}, makeAuthHeader());
    };

    this.dislikeComment = function (blogId, commentId) {
        return $http.post(apiBaseUrl + '/' + blogId + '/comments/' + commentId + '/dislike', {}, makeAuthHeader());
    };
}]);

//Controllers
app.controller('HomeController', [function() {
    var vm = this;
    vm.title = 'Christian Michel Blog';
    vm.message = 'Welcome to my blogsite!';
}]);

//Controller for listing blogs
app.controller('ListController', ['BlogService','authentication', 
    function ListController(BlogService, authentication) {
    var vm = this;
    vm.blogs = {};
    vm.title = 'Blog List';

    vm.isLoggedIn = function() {
        return authentication.isLoggedIn();
    };

    vm.logout = function() {
        authentication.logout();
    };

    vm.currentUser = function() {
        return authentication.currentUser();
    };

    console.log('Current user is' + authentication.currentUser());

    BlogService.listBlogs().then(function(response) {
        vm.blogs = response.data;
    }, function(error) {
        console.error('Error fetching blogs:', error);
    });
}]);



app.controller('AddController', ['$location', 'BlogService', 'authentication', 
    function AddController($location, BlogService, authentication) {
        var vm = this;
        vm.blog = {};
        vm.title = 'Add Blog';

        vm.addBlog = function() {
            // Get the current user
            var user = authentication.currentUser();
            vm.blog.author = user.name;
            vm.blog.authorEmail = user.email;


            BlogService.addBlog(vm.blog)
                .then(function(response) {
                    vm.message = 'Blog added successfully';
                    $location.path('/blogList');
            }, function(error) {
                vm.message = 'Error adding blog something went wrong' + vm.blogId;
            });
        };
}]);

// Controller for editing blogs
app.controller('EditController', ['$stateParams', '$location', 'BlogService', 'authentication', 
    function EditController($stateParams, $location, BlogService, authentication) {
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
app.controller('DeleteController', ['$stateParams', '$location', 'BlogService', 'authentication', 
    function DeleteController($stateParams, $location, BlogService, authentication)  {
        var vm = this;
        vm.blog = {};
        var blogId = $stateParams.blogid;
        vm.title = 'Delete Blog';

        BlogService.getBlog(blogId).then(function(response) {
            vm.blog = response.data;
            vm.message = "Blog found";
        }, function(error) {
            vm.message = 'Error fetching blog' + vm.blogId + 'delete blog failed';
        });

        vm.deleteBlog = function() {
            BlogService.deleteBlog(blogId).then(function(response) {
                $location.path('/blogList');
            }, function(error) {
                vm.message = 'Error deleting blog ' + vm.blogId;
            });
        };
}]);

// Controller for viewing a blog
app.controller('ViewController', ['$stateParams', 'BlogService', 'authentication', '$interval', '$timeout', function ViewController($stateParams, BlogService, authentication, $interval, $timeout) {
    var vm = this;
    vm.blog = { comments: [] };
    vm.newCommentText = '';
    vm.newReplyTexts = {};  
    vm.showButtons = false;
    vm.replyVisibility = {};  

    /**
     * Refreshes the blog data by making a request to the server and updating the UI accordingly.
     */
    function refreshBlog() {
        BlogService.getBlog($stateParams.blogid).then(function (response) {
            let newData = response.data;
            // Update the blog data but preserve comments' reply visibility and text areas
            vm.blog.blogTitle = newData.blogTitle;
            vm.blog.blogEntry = newData.blogEntry;
            vm.blog.author = newData.author;
            vm.blog.createdOn = newData.createdOn;

            newData.comments.forEach(newComment => {
                let existingComment = vm.blog.comments.find(c => c._id === newComment._id);
                if (existingComment) {
                    // Update details but preserve UI states
                    existingComment.likes = newComment.likes;
                    existingComment.dislikes = newComment.dislikes;
                    existingComment.replies = newComment.replies;
                } else {
                    // New comment found, add to array
                    vm.blog.comments.push(newComment);
                    vm.newReplyTexts[newComment._id] = '';  // Initialize reply textarea
                    vm.replyVisibility[newComment._id] = false;  // Initialize reply visibility
                }
            });

           
            vm.blog.comments = vm.blog.comments.filter(com => newData.comments.some(nc => nc._id === com._id));
        }, function (error) {
            console.error('Error fetching blog:', error);
        });
    }

    // Initial fetch and setup interval
    refreshBlog();
    var refreshInterval = $interval(refreshBlog, 3000);

    vm.$onDestroy = function () {
        $interval.cancel(refreshInterval);
    };

    // Manage reply form visibility
    vm.toggleReplyForm = function(commentId) {
        vm.replyVisibility[commentId] = !vm.replyVisibility[commentId];
    };

    // Function to cancel the reply
    vm.cancelReply = function(commentId) {
        vm.newReplyTexts[commentId] = '';  // Clear the textarea
        var commentIndex = vm.blog.comments.findIndex(c => c._id === commentId);
        if(commentIndex >= 0) {
            vm.blog.comments[commentIndex].showReply = false;
        }
    };

        // Function to add a comment
    vm.addComment = function () {
        if (!vm.newCommentText.trim()) {
            alert("Comment cannot be empty.");
            return;
        }
        var comment = {
            commentText: vm.newCommentText,
            author: authentication.currentUser().name,
            authorEmail: authentication.currentUser().email
        };
        BlogService.addComment($stateParams.blogid, comment).then(function (response) {
            vm.blog.comments.push(response.data);
            $timeout(function () {
                vm.newCommentText = '';
                vm.showButtons = false;
            });
        }, function (error) {
            console.error('Error adding comment:', error);
        });
    };

    // Function to like a comment
    vm.likeComment = function (comment) {
        // Check if the user has already liked the comment
        var hasAlreadyLiked = vm.hasLiked(comment);
        BlogService.likeComment($stateParams.blogid, comment._id)
            .then(function (response) {
                // Toggle the like
                if (hasAlreadyLiked) {
                    // User unlikes the comment
                    comment.likes--;
                } else {
                    // User likes the comment
                    comment.likes++;
                    if (vm.hasDisliked(comment)) {
                        // If previously disliked, decrease the dislikes count
                        comment.dislikes--;
                    }
                }
                // Update the user reactions list to reflect this change
                refreshReactions(comment, 'like', hasAlreadyLiked);
            })
            .catch(function (error) {
                console.error('Error processing like:', error);
            });
    };

    // Function to dislike a comment
    vm.dislikeComment = function (comment) {
        // Check if the user has already disliked the comment
        var hasAlreadyDisliked = vm.hasDisliked(comment);
        BlogService.dislikeComment($stateParams.blogid, comment._id)
            .then(function (response) {
                // Toggle the dislike
                if (hasAlreadyDisliked) {
                    // User undislikes the comment
                    comment.dislikes--;
                } else {
                    // User dislikes the comment
                    comment.dislikes++;
                    if (vm.hasLiked(comment)) {
                        // If previously liked, decrease the likes count
                        comment.likes--;
                    }
                }
                // Update the user reactions list to reflect this change
                refreshReactions(comment, 'dislike', hasAlreadyDisliked);
            })
            .catch(function (error) {
                console.error('Error processing dislike:', error);
            });
    };

    // Function to check if the user has liked a comment
    vm.hasLiked = function (comment) {
        var userId = authentication.currentUser()._id;
        return comment.reactions && comment.reactions.some(function (reaction) {
            return reaction.userId === userId && reaction.reaction === 'like';
        });
    };

    // Function to check if the user has disliked a comment
    vm.hasDisliked = function (comment) {
        var userId = authentication.currentUser()._id;
        return comment.reactions && comment.reactions.some(function (reaction) {
            return reaction.userId === userId && reaction.reaction === 'dislike';
        });
    };

    // Utility function to update the reactions array
    function refreshReactions(comment, reactionType, hasAlreadyReacted) {
        var userId = authentication.currentUser()._id;
        if (hasAlreadyReacted) {
            // Remove the reaction from the reactions array
            comment.reactions = comment.reactions.filter(function (reaction) {
                return reaction.userId !== userId;
            });
        } else {
            // Add or change the reaction in the reactions array
            var existingReaction = comment.reactions.find(function (reaction) {
                return reaction.userId === userId;
            });
            if (existingReaction) {
                existingReaction.reaction = reactionType;
            } else {
                comment.reactions.push({
                    userId: userId,
                    reaction: reactionType
                });
            }
        }
    }
        // Function to like a blog
        vm.likeBlog = function (blog) {
            console.log('Blog liked');
        BlogService.likeBlog($stateParams.blogid)
            .then(function (response) {
                blog.likes++;
            
            })
            .catch(function (error) {
                console.error('Error processing like:', error);
            });
    };

    // Function to dislike a blog
    vm.dislikeBlog = function (blog) {
        BlogService.dislikeBlog($stateParams.blogid)
            .then(function (response) {
                blog.dislikes++;

            }
            )
            .catch(function (error) {
                console.error('Error processing dislike:', error);
            }
            );
    };
       
    
        // Function to check if the user has liked a blog
        vm.hasLikedBlog = function (blog) {
            var userId = authentication.currentUser()._id;
            return blog.userReactions && blog.userReactions.some(function (reaction) {
                return reaction.userId === userId && reaction.reaction === 'like';
            });
        };

        // Function to check if the user has disliked a blog
        vm.hasDislikedBlog = function (blog) {
            var userId = authentication.currentUser()._id;
            return blog.userReactions && blog.userReactions.some(function (reaction) {
                return reaction.userId === userId && reaction.reaction === 'dislike';
            });
        }

    // Function to show the buttons
    vm.cancelComment = function () {
        vm.newCommentText = '';
        vm.showButtons = false;
    };

    // Function to check if the user is logged in
    vm.isLoggedIn = function () {
        return authentication.isLoggedIn();
    };

    vm.checkBlur = function () {
        if (!vm.newCommentText.trim()) {
            $timeout(function () {
                vm.showButtons = false;
            });
        }
    };
    
}]);

/*
app.controller('ChatRoomController', ['$stateParams', '$location', 'BlogService', 'authentication', function ChatRoomController($stateParams, $location, BlogService, authentication) {
    var vm = this;
    vm.title = 'Chat Room';
    vm.message = 'Welcome to the chat room';
    vm.messages = [];
    vm.messageText = '';
    var socket = io();

    socket.on('connection', function(socket) {
        console.log(socket.id);
    });

    socket.on('receive-message', function(message) {
        vm.messages.push(message);
    });

    vm.sendMessage = function() {
        if (vm.messageText != '') {
            socket.emit('send-message', vm.messageText);
            vm.messages.push(vm.messageText);
            vm.messageText = '';
        }
    };
}]);
*/