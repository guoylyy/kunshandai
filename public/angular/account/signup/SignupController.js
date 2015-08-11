'use strict';

define(['app','underscore'],function(app,_) {

	return app.controller('SignupController', ["$scope","$interval","$location","AccountService",
			function($scope,$interval,$location,AccountService){

				$scope.account = {
					mobilePhoneNumber:'',
					password:'',
					passwordConfirmation:''
				};
				
				$scope.isCodeSending = false;
				$scope.cutdown = 60;
				$scope.isSignuping = false;

				$scope.sendVerifyCode = function() {
					
					$scope.err = null;
					if($scope.account.password !== $scope.account.passwordConfirmation){
						$scope.err = "两次输入密码不一致";
						return false;
					}
					

					AccountService.signup(_.omit($scope.account,'passwordConfirmation'))
					.then(function(res){

						//验证码60s倒计时
						$scope.isCodeSending  = true;
						$interval(function(){
							$scope.cutdown--;
							if($scope.cutdown === 0){
								$scope.isCodeSending  = false;
								$scope.cutdown = 60;
							}
						},1000,60);
					},function(err){
						$scope.err = err;
					});
				};
				
				$scope.signup = function(){
					$scope.isSignuping = true;
					AccountService.verifyMobilePhone({code:$scope.code})
					.then(function(data){
						AccountService.login(_.omit($scope.account,'passwordConfirmation'))
						.then(
							function(){
								window.location = '/home';
						},
							function(err){
								$scope.err = err;
								$scope.isSignuping = false;
						});
					},function(err){
						$scope.err = err;
						$scope.isSignuping = false;
					});
				}
	}]);
});