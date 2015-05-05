define(['app'],function(app){
	return app.controller('ActiveLoanCtrl',function($scope,$modalInstance,LoanService,payments,loanId,numberWithName){
		
		$scope.payments = payments;

		$scope.loanId = loanId;

		$scope.numberWithName = numberWithName;

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
