'use strict';

define(['app','../AccountService'],function(app) {

	return app.controller('LoginController', ["$scope","$location","AccountService",
			function($scope,$location,AccountService){
				"use strict";

				$scope.account = {
					mobilePhoneNumber:'',
					password:''
				};
				
				$scope.rememberMe = false;

				$scope.login = function(){
					AccountService.login($scope.account).success(function(data){
						
					}).error(function(data){
						$scope.err = true;
						$scope.errMsg = "账号或密码错误";
					});
				};
	}]);
});