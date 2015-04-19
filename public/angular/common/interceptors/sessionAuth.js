'use strict';

define(['app'],function(app){
	return app.factory('sessionAuth', ['$q','$injector',
	 function($q,$injector,$cookies,AccountService){
		return {
			request: function(config) {
				
				// var cookies = $cookies['avos.sess'];
				// console.log(cookies);
				
				// if(AccountService.isLogin() !== true){
				// 	windown.location = "/login";
				// } 
				
				
				return config;
			}
		}
	}]);

});