'use strict';

angular.module('mylife')
  .factory('Post', ['$resource', function ($resource) {
    return $resource('mylife/posts/:id', {}, {
      'query': { method: 'GET', isArray: true},
      'get': { method: 'GET'},
      'update': { method: 'PUT'}
    });
  }]);
