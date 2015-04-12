define(['../../app'],function(app){

	return app.factory('sessionAuth', ['$q','$injector', function($q,$injector){
		return {
			request: function(config) {
				
				var cookies = document.cookies;
				console.log(cookies);
				// if(cookies){	
				// 	// console.log('login error: mobilephone number or password is wrong');
				// 	// return $q.reject('账号或密码错误');
				// 	// console.log('cookies:'+cookies);
				// 	return request;
				// }
				// else{
				// 	$q.reject("user hasn't loined");
				// 	console.log(request);
				// 	// window.location = '/login';
				// }
				return config;
			}
		}
	}]);

});