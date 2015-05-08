define(['app'],function(app){
	return app.controller('ActiveLoanCtrl',function($scope,$modalInstance,LoanService,payments,loan){
		
		$scope.payments = payments;

		$scope.loan = loan;

		$scope.loanData = {};

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
