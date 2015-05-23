define(['app'],function(app){
	return app.controller('ActiveLoanModalCtrl',function($scope,$modalInstance,LoanService,payments,loan){

		$scope.payments = payments;

		$scope.loan = loan;

		$scope.loanData = {};

		$scope.status = {loaning:false};

		$scope.calendar = {opened:false,format:"yyyy-MM-dd"};

		$scope.activeModalCancel = function(){

				$modalInstance.dismiss('cancel');
		}

		$scope.openCld = function($event){

			$event.preventDefault();
			$event.stopPropagation();
			$scope.calendar.opened = true;
		}

		$scope.activeModalFinish = function(loanId){

			$scope.status.loaning = true;
			var amount = parseFloat($scope.loanData.amount);
			var outDate = new Date($scope.loanData.outDate);
			LoanService.assure(loanId, amount, outDate).then(function(res){

				$modalInstance.close(true);

			},function(res){

				$scope.status.loaning = false;
				$modalInstance.close(false);

			});

		}


	})
})
