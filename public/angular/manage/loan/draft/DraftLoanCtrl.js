define(['app'],function(app){
	return app.controller('DraftLoanCtrl', ['$scope','$state','$stateParams','LoanService','draftLoans','SweetAlert', '$modal',
		function($scope,$state,$stateParams,LoanService,draftLoans,SweetAlert,$modal){
		
		$scope.totalLoans = draftLoans.totalNum;

		$scope.currentPage =  $stateParams.page || 1;

		$scope.loans = 	draftLoans.values;

		$scope.pageChanged = function(){
			
			$stateParams.page = $scope.currentPage;

			 $state.go($state.current, {page:$scope.currentPage}, {reload: true});
		}
		

		$scope.activeLoan = function(loanId){

			var activeModal = $modal.open({
				templateUrl: '/angular/manage/common/active/activeLoanModal.html',
				size:'lg',
				controller:'ActiveLoanCtrl',
				resolve:{
					payment:function(){
						return LoanService.getPayments(loanId);
					},
					loanId:function(){
						return loanId;
					}
				}
			});

			activeModal.result.then(function(actived){
				if(actived){
					SweetAlert.swal(
						{  
							title: "放款成功",  
						 	type: "success",
						 	confirmButtonColor: "#DD6B55",
						 	confirmButtonText: "好的",  
						 	closeOnConfirm: true 
					 	}, 
					 	function(){ 
					 	  	$state.go($state.current,{},{reload:true});
						}	
					);

				}
			},function(){

			})
		}
	}])
});