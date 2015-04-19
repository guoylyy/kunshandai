define(['../app'],function(app){

	return app.factory('AccountService', ['$http', 'ApiURL',
		function($http,ApiURL){
		
		var accountUrl = '/account';

		var logined = false;
		
		return{
			login : function(user){
				return $http.post(ApiURL+accountUrl+"/login",JSON.stringify(user));
			},
			logout : function(){
				logined = false;
				return $http.get(ApiURL+accountUrl+"/logout");
			},
			isLogin: function(){
				
				if(logined === true){
					return true;
				}
				return $http.get(ApiURL+accountUrl+"/isLogin").then(function(res){
					if(res.status === 200){
						return true;
					}else{
						return false;
					}
				});
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