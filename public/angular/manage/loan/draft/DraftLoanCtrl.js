define(['app'],function(app){
	return app.controller('DraftLoanCtrl', ['$scope','$state','$stateParams','LoanService','draftLoans','SweetAlert', '$modal',
		function($scope,$state,$stateParams,LoanService,draftLoans,SweetAlert,$modal){
		
		$scope.totalLoans = draftLoans.totalNum;

		$scope.currentPage = draftLoans.page || 1;

		$scope.loans = 	draftLoans.values;

		$scope.pageChanged = function(){
			
			$stateParams.page = $scope.currentPage;

			$state.go($state.current, {page:$scope.currentPage}, {reload: true});
		}
		
		$scope.activeModalCancel = function(){
				
			$scope.activeModal.dismiss('cancel');
		}

		$scope.activeModalFinish = function(loanId){
			
			var activeFlag = false;
			LoanService.assure(loanId).then(function(res){
			
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

			},function(res){
				
				SweetAlert.error("放款失败", "服务器内部错误");
			
			});

			$scope.activeModal.close();
		}
		

		$scope.activeLoan = function(loanId){

			$scope.activeModal = $modal.open({
				templateUrl: '/angular/manage/common/active/activeLoanModal.html',
				size:'lg',
				scope:$scope,
				resolve:{
					payments:function(){
						return LoanService.getPayments(loanId).then(function(data){
							$scope.payments =  data[0];
						});
					},
					loanId:function(){
						$scope.loanId = loanId;
					}
				}
			});

			$scope.activeModal.result.then(function (activeFlag) {
		      	if(activeFlag){


				}else{

					
				}

		    }, function () {
		      
		    	console.log("放款窗口关闭");
		    
		    });

		}
	}])
});