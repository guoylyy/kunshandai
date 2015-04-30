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
		
		$scope.deleteLoan = function(loanId){

			SweetAlert.swal({
			   title: "确定删除该合同?",
			   text: "删除后将不可恢复",
			   type: "warning",
			   showCancelButton: true,
			   confirmButtonColor: "#DD6B55",
			   confirmButtonText: "确定",
			   closeOnConfirm: false}, 
			function(isConfirm){ 
				if(isConfirm){
					LoanService.deleteDraftLoan(loanId).then(function(){
				   		SweetAlert.success("删除成功");
				   		$state.reload();
				    },function(){
						SweetAlert.error("删除失败","服务器开小差啦");
				    });
				}
			});
		}

		$scope.activeLoan = function(loanId){

			var activeModal = $modal.open({
				templateUrl: '/angular/manage/common/active/activeLoanModal.html',
				size:'lg',
				controller:'ActiveLoanCtrl',
				resolve:{
					payments:function(){
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