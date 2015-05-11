'use strict';

define(['app'],function(app){
	return app.factory('sessionAuth', ['$q','$injector','$window',
	 function($q,$injector,$window){
		return {
			request: function(config) {
				
				return config;
			}
		}
	}]);

});