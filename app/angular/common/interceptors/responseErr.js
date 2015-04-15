define(['../../app'],function(app){

	return app.factory('responseErr', ['$q','$injector', function($q,$injector){
		var responseErr = {
			response: function(response) {
				if(response.status !== 200){
					if(response.status === 1){
						return $q.reject('验证码错误');
					}
					else if(response.status === 210){
					
						return $q.reject('密码错误');
					}
					else if(response.status === 211){
						
						return $q.reject('账号不存在');
					}
					 
					else if(response.status === 214){
						return $q.reject('该手机号已经注册');
					}
					else{
						return $q.reject('未知错误');
					}
				}else{
					return response;
				}
				
			},
			responseError:function(response){
				if(response.status === 501){
					window.location = "/login";
				}else{
					return $q.reject(response.data.message);
				}
			}
		}
		return responseErr;
	}])

});