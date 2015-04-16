define(['../../app'],function(app){
	return app.controller('NavController', ['$scope', function($scope){
		$scope.logout = function () {
    		$modalInstance.close($scope.selected.item);
  		};	
	}]);
});