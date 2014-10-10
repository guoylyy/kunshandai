'use strict';

angular.module('mylife')
  .factory('User', ['$resource', function ($resource) {
    return $resource('mylife/users/:id', {}, {
      'query': { method: 'GET', isArray: true},
      'get': { method: 'GET'},
      'update': { method: 'PUT'}
    });
  }]);
