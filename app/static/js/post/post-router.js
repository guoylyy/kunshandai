'use strict';

angular.module('mylife')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/posts', {
        templateUrl: 'views/post/posts.html',
        controller: 'PostController',
        resolve:{
          resolvedPost: ['Post', function (Post) {
            return Post.query();
          }]
        }
      })
    }]);
