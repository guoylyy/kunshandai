
define(['app'],function(app) {
	return app.controller('CollectProcessCtrl', function(LoanService,$scope,$modalInstance,loan,paybacks){
		
		$scope.loan = loan;
		$scope.paybacks = paybacks;

	})
})