define(['../app'],function(app){

	return app.factory('User', ['$http', 'ApiURL',
		function($http,ApiURL){
		
		var accountUrl = '/account';
		
		return{
			login : function(user){
				return $http.post(ApiURL+accountUrl+"/login",JSON.stringify(user));
			}
		}
		

	}]);
});