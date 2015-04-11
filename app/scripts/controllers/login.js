'use strict';

define(['app','services/user'],function(app) {

	return app.controller('LoginController', ["$scope","$location","User",
			function($scope,$location,User){
				"use strict";

				$scope.user = {
					mobilePhone:'',
					password:''
				};
				
				$scope.rememberMe = false;

				$scope.login = function(){
					User.login($scope.user).success(function(data){
						
					}).error(function(data){
						$scope.err = true;
						$scope.errMsg = "账号或密码错误";
					});
				};

			}]);
});