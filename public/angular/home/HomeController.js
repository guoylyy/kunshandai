define(['app','underscore','moment'],function(app,_,moment){
	return app.controller('HomeController', ['$scope','projects','$stateParams','LoanService', 'DictService','$modal','$state',
		function($scope,projects,$stateParams,LoanService,DictService,$modal,$state){
		
		var dataDisplay;

		$scope.totalLoans 	= projects.totalNum;

		$scope.currentPage 	= $stateParams.page || 1;

		$scope.projects = projects.values;

		dataDisplay();

		function dataDisplay() {
			
			_.each($scope.projects,function(project,index){
				$scope.projects[index].week = moment($scope.projects[index].payDate).format("dddd");
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

		$scope.collect = function(loanId){
			collectModal(loanId,'list');
		}

		$scope.complete = function(loanId){
			collectModal(loanId,'complete');
		}
	}]);
})