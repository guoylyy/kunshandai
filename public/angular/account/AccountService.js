define(['app','underscore'],function(app,_){

	return app.factory('AccountService', ['$http','ApiURL', '$q','$window',
		function($http,ApiURL,$q,$window){
		
		var accountUrl = '/account';

		var logined = false;
		
		return{
			login : function(user,rememberMe){
				var deferred = $q.defer();
				user = _.pick(user,'mobilePhoneNumber','password');
				$http.post(
					ApiURL+accountUrl+"/login",
					JSON.stringify(user)
				).then(function(res){
					var resUser = res.data;
					resUser.password = user.password;
					//设置自动登录
					if(rememberMe){
						// var userInfo = $window.sessionStorage['userInfo'];
						var  expiresDate = new Date();
						expiresDate.setDate(expiresDate.getDate() + 7);
						resUser.expires = expiresDate;
						$window.localStorage['userInfo'] = JSON.stringify(_.pick(resUser,'mobilePhoneNumber','password','expires'));
					}
					//设置登录状态
					var sessionExpiresTime = new Date();
						sessionExpiresTime.setHours(sessionExpiresTime.getHours() + 1);
					var loginStatus = {logined:true,sessionExpires:sessionExpiresTime};	
					$window.localStorage['loginStatus'] = JSON.stringify(loginStatus);

					deferred.resolve(resUser);
				},function(){
					deferred.reject("登录失败");
				});
				return deferred.promise;
			},
			logout : function(){
				logined = false;
				$window.localStorage['loginStatus'] = JSON.stringify({logined:false});
				delete($window.localStorage['userInfo']);
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
			},
			requestResetPasswordBySmsCode: function(mobilePhoneNumber){
				return $http.post(ApiURL+accountUrl+'/requestResetPasswordBySmsCode',JSON.stringify(mobilePhoneNumber));
			},
			resetPasswordBySmsCode: function(data){
				return $http.post(ApiURL+accountUrl+'/resetPasswordBySmsCode',JSON.stringify(data));
			}

		}
		

	}]);
});