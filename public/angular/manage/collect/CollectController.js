'use strict';

define(['app'],function(app) {

	return app.controller('CollectController', ["$scope","$state","$stateParams","$location",
		'loans','loanTypes','timeRanges','$modal','LoanService','DictService',
			function($scope,$state,$stateParams,$location,loans,loanTypes,timeRanges,$modal,LoanService,DictService){

			$scope.totalLoans 	= loans.totalNum;

			$scope.currentPage 	= $stateParams.page || 1;

			$scope.loans 		= loans.values;

			$scope.loanTypes	= loanTypes;

			$scope.timeRanges 	= timeRanges;

			$scope.currentState = $state.current;

			$scope.calendar 	= {};

			$scope.condition 	= {};

			var init = function(){
				var startDate = '',endDate = '';
				if($stateParams.startDate){
					startDate = new Date(parseInt($stateParams.startDate));
					endDate = new Date(parseInt($stateParams.endDate));
				}
				$scope.condition = {startDate:startDate,endDate:endDate};
			}

			init();
			// $scope.template = {
			// 	processCompleteUrl	:'/angular/manage/collect/template/processComplete.html',
			// 	processListUrl		:'/angular/manage/collect/template/processList.html',
			// 	processPayUrl		:'/angular/manage/collect/template/processPay.html'
			// }

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
						},
						payBackTypes: function(){
							return DictService.get('payBackTypes');
						},
						interestCalTypes:function(){
							return DictService.get('interestCalTypes');
						}
					}
				});

				collectModal.result.then(function(succ){
					if(succ){
						$state.reload();
					}
				});
			}

			//控制几个日历开关状态
			$scope.open = function($event,opened) {
			    $event.preventDefault();
			    $event.stopPropagation();
			    if(opened === 'openedstart'){
			    	$scope.calendar['openedstart'] = true;
			    	$scope.calendar['openedend'] = false;
			    }else{
			    	$scope.calendar['openedend'] = true;
			    	$scope.calendar['openedstart'] = false;
			    }

			}

			$scope.customTime = function(){
				if(_.isNull($scope.condition.startDate) || _.isNull($scope.condition.endDate)){
					return;
				}
				$state.go($state.current.name,{
					startDate:(new Date($scope.condition.startDate)).getTime(),
					endDate:(new Date($scope.condition.endDate)).getTime()
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
