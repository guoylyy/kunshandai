define(['../../app'],function(app){

	return app.factory('responseErr', ['$q','$injector', function($q,$injector){
		var responseErr = {
			response: function(response) {
				//login error
				if(response.status === 211){
					console.log('login error: mobilephone number or password is wrong');
					return $q.reject('账号或密码错误');
				}
				
				else{
					return response;
				}
			},
			responseError:function(response){
				if(response.status === 501){
					window.location = "/login";
				}
			}
		}
		return responseErr;
	}])

});