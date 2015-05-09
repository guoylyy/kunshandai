define(['app'],function(app){
	return app.controller('ActiveLoanCtrl',function($scope,$modalInstance,LoanService,payments,loan){
		
		$scope.payments = payments;

		$scope.loan = loan;

		$scope.loanData = {};

		$scope.status = {loaning:false};

		$scope.activeModalCancel = function(){
				
				$modalInstance.dismiss('cancel');
		}

		$scope.activeModalFinish = function(loanId){
			
			$scope.status.loaning = true;

			LoanService.assure(loanId,$scope.loanData.amount).then(function(res){
			
				$modalInstance.close(true);

			},function(res){
				
				$scope.status.loaning = false;
				$modalInstance.close(false);
			
			});
			
		}
		

	})
})
