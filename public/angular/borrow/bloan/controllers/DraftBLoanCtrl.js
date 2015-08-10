define(['app','underscore'],function(app,_){
	return app.controller('DraftBLoanCtrl', ['$scope','$state','$stateParams','BLoanService','draftLoans','SweetAlert', '$modal',
		function($scope,$state,$stateParams,BLoanService,draftLoans,SweetAlert,$modal){

		$scope.totalLoans = draftLoans.totalNum;

		$scope.currentPage =  $stateParams.page || 1;

		$scope.loans = 	draftLoans.values;

		$scope.pageChanged = function(){

			$stateParams.page = $scope.currentPage;

			 $state.go($state.current, {page:$scope.currentPage}, {reload: true});
		}

		$scope.deleteLoan = function(loanId){

			SweetAlert.swal({
			   title: "确定删除该融资项目?",
			   text: "删除后将不可恢复",
			   type: "warning",
			   showCancelButton: true,
			   confirmButtonColor: "#DD6B55",
			   confirmButtonText: "确定",
			   closeOnConfirm: false},
			function(isConfirm){
				if(isConfirm){
					BLoanService.deleteDraftLoan(loanId).then(function(){
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
				templateUrl: '/angular/borrow/common/partial/activeBLoanModal.html',
				size:'lg',
				controller:'ActiveLoanModalCtrl',
				resolve:{
					payments:function(){
						return BLoanService.getPayments(loanId);
					},
					loan:function(){
						var index =_.findIndex($scope.loans,{objectId:loanId})
						return $scope.loans[index];
					}
				}
			});

			activeModal.result.then(function(actived){
				if(actived){
					SweetAlert.swal(
						{
							title: "操作成功",
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
