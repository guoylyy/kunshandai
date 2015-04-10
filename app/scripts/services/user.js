define(['../app','../resources/setting'],function(app,setting){

	return app.service('User', ['$scope','$location','$http', function($scope,$location,$http){
		
		this.login = function(user){
			
			return $http.post(setting.APIURL+"/login",JSON.stringify(user));
		}

	}]);
});