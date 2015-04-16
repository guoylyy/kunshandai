'use strict';

define(['app','../account/AccountService'],function(app) {

	return app.controller('AccountController', ["$scope","AccountService",
			function($scope,AccountService){

				$scope.logout = function(){
					$scope.err = null;
					AccountService.logout().then(function(res){
							window.location = '/login';
						},
						function(err){
							$scope.err = err;
						}
					);

			};
	}]);
});