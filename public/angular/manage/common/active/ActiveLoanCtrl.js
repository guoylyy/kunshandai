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
			console.log($scope.loanData);
			var amount = parseFloat($scope.loanData.amount);
			LoanService.assure(loanId, amount).then(function(res){
			
				$modalInstance.close(true);

			},function(res){
				
				$scope.status.loaning = false;
				$modalInstance.close(false);
			
			});
			
		}
		

	})
})
