'use strict';

define(['app','../AccountService'],function(app) {

	return app.controller('LoginController', ["$scope","$location","AccountService",
			function($scope,$location,AccountService){

				$scope.account = {
					mobilePhoneNumber:'',
					password:'',
					rememberMe:false
				};
				
				$scope.rememberMe = false;

				$scope.login = function(){
					$scope.err = null;
					$scope.logining = true;

					AccountService.login($scope.account,$scope.account.rememberMe).then(function(res){
							window.location = '/home';
						},
						function(err){
							$scope.err = err;
							$scope.logining = false;
						}
					);

				};

	}]);
});