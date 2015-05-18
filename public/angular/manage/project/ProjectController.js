'use strict';

define(['app','underscore'],function(app) {
	return app.controller('ProjectController', ['$scope','$state','$stateParams','loans','loanTypes','timeRanges','$modal','LoanService','DictService',
	 function($scope,$state,$stateParams,loans,loanTypes,timeRanges,$modal,LoanService,DictService){

		$scope.currentState	= $state.current;

		$scope.currentPage 	= $stateParams.page || 1;
		$scope.totalLoans 	= loans.totalNum;

		$scope.loans 		= loans.values;
		$scope.loanTypes 	= loanTypes;
		$scope.timeRanges 	= timeRanges;

		$scope.calendar 	= {};

		$scope.condition 	= {
			startDate:new Date(parseInt($stateParams.startDate)),
			endDate:new Date(parseInt($stateParams.endDate)),
			endTimeRS:new Date(parseInt($stateParams.endTimeRS)),
			endTimeRE:new Date(parseInt($stateParams.endTimeRE))
		};

		$scope.search = {
			type:{
				text:'',
				value:''
			},
			keyword:''
		}

		$scope.$watch('search',function(){
			if($stateParams.keyword){
				$scope.search.keyword = $stateParams.keyword;
			}
			if($stateParams.type){
				$scope.changeSearchType($stateParams.type);
			}else{
				$scope.changeSearchType('id');
			}
		})

		$scope.pageChanged = function(){
			$state.go($state.current, {page:$scope.currentPage}, {reload: true});
		}

		$scope.changeSearchType = function(type){
			if(type === 'id'){
				$scope.search.type.value = 'id';
				$scope.search.type.text = '项目号';
			}else{
				$scope.search.type.value = 'name';
				$scope.search.type.text = '贷款人';
			}
		}

		$scope.startSearch = function(){
			$state.go(
				"searchProjects",
				{keyword:$scope.search.keyword,type:$scope.search.type.value},
				{reload: true});
		}

		$scope.collectModal = function(loanId,processName){
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
				 	_.each($scope.calendar,function(val,key){
						$scope.calendar[key] = false;
					})
					$scope.calendar[opened] = true;				
			}

			$scope.customTime = function(){
				$state.go($state.current.name,{
					startDate:(new Date($scope.condition.startDate)).getTime(),
					endDate:(new Date($scope.condition.endDate)).getTime(),
					endTimeRS:(new Date($scope.condition.endTimeRS)).getTime(),
					endTimeRE:(new Date($scope.condition.endTimeRE)).getTime()
				});
			}

	}])
})
