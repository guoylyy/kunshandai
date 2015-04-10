define(['app','../resources/text','../services/user'],function(app,text,User) {

	return app.controller('LoginController', ["$scope","$rootScope","$location","User",
	function($scope,$rootScope,$location,User){

		$rootScope.title = text.login;

		$scope.user = {
			mobilePhone:'',
			password:''
		}

		$scope.login = function(){
			// User.login(user).success(function(data){
			// 	if(data.err){
			// 		alert(data.err);
			// 	}
			// 	alert("登录成功");
			// });
		}
	}]);
});