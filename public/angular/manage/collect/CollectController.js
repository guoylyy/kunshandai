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

			$scope.template = {
				processCompleteUrl	:'/angular/manage/collect/template/processComplete.html',
				processListUrl		:'/angular/manage/collect/template/processList.html',
				processPayUrl		:'/angular/manage/collect/template/processPay.html'
			}
			
			var collectModal = function(loanId,processName){
				var collectModal = $modal.open({
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
						},
						process:function(){
							var process =  {
									list:false,
									pay:false,
									complete:false
								}
							process[processName] = true;
							return process;
						}
					}
				});

				collectModal.result.then(function(succ){
					if(succ){
						$state.reload();
					}
				});
			}

			$scope.pageChanged = function(){
				$state.go($state.current, {page:$scope.currentPage}, {reload: true});
			}

			$scope.collect = function(loanId){
				collectModal(loanId,'list');
			}

			$scope.complete = function(loanId){
				collectModal(loanId,'complete');
			}


	}]);
});