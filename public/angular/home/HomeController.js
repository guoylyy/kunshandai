define(['app','underscore','moment'],function(app,_,moment){
	return app.controller('HomeController', ['$scope','preProjects','projects','laterProjects','timeRanges','$stateParams','LoanService','BLoanService', 'DictService','$modal','$state',
		function($scope,preProjects,projects,laterProjects,timeRanges,$stateParams,LoanService,BLoanService,DictService,$modal,$state){
		
		var dataDisplay;

		$scope.totalLoans 	= projects.totalNum;

		$scope.currentPage 	= $stateParams.page || 1;

		$scope.projects = projects.values;
		
		$scope.preProjects = preProjects.values;
		
		$scope.lateProjects = laterProjects.values;

		$scope.timeRangeValues 	=  [
										{
											start:new Date(timeRanges[0].startDate),
											end:new Date(timeRanges[0].endDate)
										},
										{
											start:new Date(timeRanges[1].startDate),
											end:new Date(timeRanges[1].endDate)
										},
										{
											start:new Date(timeRanges[2].startDate),
											end:new Date(timeRanges[2].endDate)
										}
									]

		dataDisplay();

		function dataDisplay() {
			
			_.each($scope.projects,function(project,index){
				$scope.projects[index].week = moment($scope.projects[index].payDate).format("dddd");
			})
			_.each($scope.preProjects,function(project,index){
				$scope.preProjects[index].week = moment($scope.preProjects[index].payDate).format("dddd");
			})
			_.each($scope.lateProjects,function(project,index){
				$scope.lateProjects[index].week = moment($scope.lateProjects[index].payDate).format("dddd");
			})
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

		var repayModal = function(loanId,processName){
			var repayModal = $modal.open({
		          templateUrl: '/angular/borrow/repay/repayModal.html',
		          controller:'CollectProcessCtrl',
		          size:'lg',
		          backdrop: true,
		          windowClass: 'modal',
		          resolve:{
		            loan:function(){
		              return BLoanService.getLoan(loanId);
		            },
		            paybacks:function(){
		              return BLoanService.getPaybacks(loanId);
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

			repayModal.result.then(function(succ){
				if(succ){
					$state.reload();
				}
			});
		}

		$scope.collect = function(loanId){
			collectModal(loanId,'list');
		}

		$scope.repay = function(loanId){
			repayModal(loanId,'list');
		}

		$scope.repayComplete = function(loanId){
			repayModal(loanId,'complete');
		}

		$scope.complete = function(loanId){
			collectModal(loanId,'complete');
		}
	}]);
})