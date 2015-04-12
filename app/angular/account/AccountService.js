define(['../app'],function(app){

	return app.factory('AccountService', ['$http', 'ApiURL',
		function($http,ApiURL){
		
		var accountUrl = '/account';
		
		return{
			login : function(user){
				return $http.post(ApiURL+accountUrl+"/login",JSON.stringify(user));
			},
			isLogin: function(){
				return $http.get(ApiURL+accountUrl+"/isLogin");
			},
			signup : function(user){
				return $http.post(ApiURL+accountUrl+"/register",JSON.stringify(user));
			},
			verifyMobilePhone: function(code){
				return $http.post(ApiURL+accountUrl+"/verifyUserMobilePhoneNumber",JSON.stringify(code));
			}
		}
		

	}]);
});