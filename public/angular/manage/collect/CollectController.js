'use strict';

define(['app'],function(app) {

	return app.controller('CollectController', ["$scope","$state","$stateParams","$location",'loans','loanTypes','timeRanges',
			function($scope,$state,$stateParams,$location,loans,loanTypes,timeRanges){

			$scope.totalLoans = loans.totalNum;

			$scope.currentPage = $stateParams.page || 1;

			$scope.loans = 	loans.values;

			$scope.loanTypes = loanTypes;

			$scope.timeRanges = timeRanges;
			
			$scope.selected = {};

			$scope.dateRange = function(rangeId){

			}

			$scope.changeLoanType = function(loanType){
				$scope.selected.loanType = loanType;
				$stateParams.loanType = loanType;
			    $state.go($state.current, {loanType:loanType}, {reload:true});
			}

			$scope.pageChanged = function(){
				$state.go($state.current, {page:$scope.currentPage}, {reload: true});
			}

	}]);
});