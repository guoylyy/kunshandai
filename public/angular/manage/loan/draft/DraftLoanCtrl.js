define(['app'],function(app){
	return app.controller('DraftLoanCtrl', ['$scope','$state','$stateParams','draftLoans', 
		function($scope,$state,$stateParams,draftLoans){
		
		$scope.totalLoans = draftLoans.totalNum;

		$scope.currentPage = draftLoans.page || 1;

		$scope.loans = 	draftLoans.values;

		$scope.pageChanged = function(){
			
			$stateParams.page = $scope.currentPage;
			
			$state.transitionTo($state.current, $stateParams, {
			    reload: true,
			    inherit: false,
			    notify: true
			});
		}
	}])
});