define(['app'],function(app){
	return app.controller('HomeController', ['$scope','projects', function($scope,projects){
		
		$scope.projects = projects;


	}])
})