'use strict';

define(['app','underscore'],function(app,_) {

	return app.controller('SignupController', ["$scope","$location","AccountService",
			function($scope,$location,AccountService){

				$scope.account = {
					mobilePhoneNumber:'',
					password:'',
					passwordConfirmation:''
				};
								
				$scope.sendVerifyCode = function() {
					$scope.err = null;
					if($scope.account.password !== $scope.account.passwordConfirmation){
						$scope.err = "两次输入密码不一致";
						return false;
					}

					AccountService.signup(_.omit($scope.account,'passwordConfirmation'))
					.success(function(data){
						$scope.code = true;
					}).error(function(data){
						$scope.err = "发送验证码失败";
					});
				};
				
				$scope.signup = function(){

					AccountService.verifyMobilePhone({code:$scope.code}).success(function(data){
						AccountService.login(_.omit($scope.account,'passwordConfirmation'))
						.success(function(){

							window.location = '/manage';
						});

					}).error(function(data){
						$scope.err = "注册失败或验证码错误";
					});
				};
	}]);
});