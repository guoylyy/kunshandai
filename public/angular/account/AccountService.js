define(['app','underscore'],function(app,_){

	return app.factory('AccountService', ['$http','ApiURL', '$q','$window',
		function($http,ApiURL,$q,$window){

		var accountUrl = '/account';

		var logined = false;

		var currentUser;

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
						sessionExpiresTime.setHours(sessionExpiresTime.getHours() + 23);
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

				var deferred = $q.defer();
				if(currentUser){
					deferred.resolve(currentUser);
				}else{
					$http.get(ApiURL+accountUrl+"/isLogin")
					.then(function(res){
						currentUser = res.data;
						deferred.resolve(currentUser);
					},function(res){
						deferred.reject(res);
					});
				}
				return deferred.promise;
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
			},
			getProfile: function(){
				var deferred = $q.defer();

				$http.get(ApiURL+accountUrl+'/profile').then(function(res){
					deferred.resolve(res.data.data);
				},function(res){
					deferred.reject(res);
				})

				return deferred.promise;
			},
			updateProfile: function(profile){
				var deferred = $q.defer();

				$http.put(
					ApiURL+accountUrl+'/profile',
					JSON.stringify({infoObject:profile})
				).then(function(res){
					deferred.resolve(res.data);
				},function(res){
					deferred.reject(res);
				})

				return deferred.promise;
			},
			updateAvatar: function(avatarId){
				var deferred = $q.defer();

				$http.put(
					ApiURL+accountUrl+'/profile/icon',
					JSON.stringify({icon_id:avatarId})
				).then(function(res){
					deferred.resolve(res.data);
				},function(res){
					deferred.reject(res);
				})

				return deferred.promise;
			},
			updatePassword: function(oldPassword,newPassword){
				var deferred = $q.defer();

				$http.put(
					ApiURL+accountUrl+'/profile/resetPassword',
					JSON.stringify({
						oldPassword:oldPassword,
						newPassword:newPassword
						})
				).then(function(res){
					var userInfo 	= $window.localStorage['userInfo'];
	    		if(userInfo){
	    			userInfo = JSON.parse(userInfo);
	          userInfo.password = newPassword;
	    			userInfo.expires  = new Date(userInfo.expires);
						$window.localStorage['userInfo'] = JSON.stringify(userInfo);
	    		}
					deferred.resolve(res.data);
				},function(res){
					deferred.reject(res);
				})

				return deferred.promise;
			},
			getAttachments: function(accountId){
				var deferred = $q.defer();

				$http.put(
					ApiURL+accountUrl+'/'+accountId+'/attachments'
				).then(function(res){
					deferred(res.data.data);
				},function(res){
					deferred.reject(res);
				})

				return deferred.promise;
			},
			addAttachment: function(accountId,attachmentId){
				var deferred = $q.defer();

				$http.put(
					ApiURL+accountUrl+'/'+accountId+'/attachments/'+attachmentId
				).then(function(res){
					deferred(res.data.data);
				},function(res){
					deferred.reject(res);
				})

				return deferred.promise;
			},
			removeAttachment: function(accountId,attachmentId){
				var deferred = $q.defer();

				$http.delete(
					ApiURL+accountUrl+'/'+accountId+'/attachments/'+attachmentId
				).then(function(res){
					deferred(res.data.data);
				},function(res){
					deferred.reject(res);
				})

				return deferred.promise;
			}

		}

	}]);
});
