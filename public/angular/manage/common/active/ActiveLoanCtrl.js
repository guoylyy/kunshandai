define(['app'],function(app){
	return app.controller('ActiveLoanCtrl',function($scope,$modalInstance,LoanService,payment,loanId){
		
		$scope.payment = payment;

		$scope.loanId = loanId;

		$scope.activeModalCancel = function(){
				
				$modalInstance.dismiss('cancel');
		}

		$scope.activeModalFinish = function(loanId){
			
			LoanService.assure(loanId).then(function(res){
			
				$modalInstance.close(true);

			},function(res){
				
				$modalInstance.close(false);
			
			});
			
		}
		

	})
})
