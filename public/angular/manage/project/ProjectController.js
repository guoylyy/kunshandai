'use strict';

define(['app'],function(app) {
	return app.controller('ProjectController', ['$scope','$state','$stateParams','loans','loanTypes','timeRanges','$modal','LoanService',
	 function($scope,$state,$stateParams,loans,loanTypes,timeRanges,$modal,LoanService){
		
		$scope.currentState = $state.current;
		
		$scope.totalLoans = loans.totalNum;

		$scope.currentPage = $stateParams.page || 1;

		$scope.loans = loans.values;

		$scope.loanTypes = loanTypes;
		
		$scope.timeRanges = timeRanges;


		$scope.pageChanged = function(){
			$state.go($state.current, {page:$scope.currentPage}, {reload: true});
		}

	}])
})