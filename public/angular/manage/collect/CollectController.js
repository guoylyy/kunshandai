'use strict';

define(['app'],function(app) {

	return app.controller('CollectController', ["$scope","$location",'loans',
			function($scope,$location,loans){

			$scope.totalLoans = loans.totalNum;

			$scope.currentPage = loans.page || 1;

			$scope.loans = 	loans.values;

			$scope.loans = loans.values;
		
			$scope.pageChanged = function(){
				
				$stateParams.page = $scope.currentPage;
				
				$state.transitionTo($state.current, $stateParams, {
				    reload: true,
				    inherit: false,
				    notify: true
				});
			}

	}]);
});