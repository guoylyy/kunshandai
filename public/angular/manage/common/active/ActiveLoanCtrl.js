define(['app'],function(app){
	return app.controller('ActiveLoanCtrl', ['$scope','$modalInstance','LoanService',
		function($scope,$modalInstance,LoanService,payments,loanId){
		
		$scope.payments = payments;

		$scope.loanId = loanId;

		$scope.activeModalCancel = function(){
				
				$modalInstance.dismiss('cancel');
		}

		$scope.activeModalFinish = function(loanId){
			
			var activeFlag = false;
			LoanService.assure(loanId).then(function(res){
			
				activeFlag =  true;

			},function(res){
				
				activeFlag =  false;
			
			});

			$scope.activeModal.close(activeFlag);
		}
		


	}])
})
