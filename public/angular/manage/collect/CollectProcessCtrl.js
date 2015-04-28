
define(['app'],function(app) {
	return app.controller('CollectProcessCtrl', function(LoanService,$scope,$modalInstance,loan,paybacks){
		
		$scope.loan = loan;
		$scope.paybacks = paybacks;

		$scope.process = {
			list:true,
			pay:false
		}

		$scope.startCollect = function(){
			$scope.process.list = false;
			$scope.process.pay = true;
		}

	})
})