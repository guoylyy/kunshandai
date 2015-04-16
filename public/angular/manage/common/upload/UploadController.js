define(['../../app'],function(app){
	return app.controller('UploadController', ['$scope', function($scope){
		$scope.ok = function () {
    		$modalInstance.close($scope.selected.item);
  		};	
	}]);
});