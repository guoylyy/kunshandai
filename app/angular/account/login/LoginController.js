'use strict';

define(['app','../AccountService'],function(app) {

	return app.controller('LoginController', ["$scope","$location","AccountService",
			function($scope,$location,AccountService){

				$scope.account = {
					mobilePhoneNumber:'',
					password:''
				};
				
				$scope.rememberMe = false;

				$scope.login = function(){
					$scope.err = null;
					AccountService.login($scope.account)
					.then(function(){
						window.location = '/manage';
					},function(err){
						$scope.err = err;
					});
					// .success(function(data){
						
					// }).error(function(data){
					// 	$scope.err = true;
					// 	$scope.errMsg = "账号或密码错误";
					// });
				};
	}]);
});