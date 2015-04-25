'use strict';

define(['app'],function(app) {

	return app.controller('CollectController', ["$scope","$state","$stateParams","$location",
		'loans','loanTypes','timeRanges','$modal','LoanService',
			function($scope,$state,$stateParams,$location,loans,loanTypes,timeRanges,$modal,LoanService){

			$scope.totalLoans = loans.totalNum;

			$scope.currentPage = $stateParams.page || 1;

			$scope.loans = 	loans.values;

			$scope.loanTypes = loanTypes;

			$scope.timeRanges = timeRanges;

			$scope.currentState = $state.current;
			
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

			$scope.collect = function(loanId){

				$scope.collectModal = $modal.open({
					templateUrl: '/angular/manage/collect/collectModal.html',
					controller:'CollectProcessCtrl',
					size:'lg',
					backdrop: true,
            		windowClass: 'modal',
					resolve:{
						loan:function(){
							return LoanService.getLoan(loanId);
						},
						paybacks:function(){
							return LoanService.getPaybacks(loanId);
						}
					}
				});

			}

	}]);
});