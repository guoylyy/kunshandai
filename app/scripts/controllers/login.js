define(['app','../resources/text','../services/user'],function(app) {

	return app.controller('LoginController', ["$scope","$location","User",
	function($scope,$location,User){
		$scope.user = {
			mobilePhone:'',
			password:''
		};
		$scope.login = function(){
			User.login($scope.user).success(function(data){
				if(data.err){
					alert(data.err);
				}
				alert("登录成功");
			});
		};

	}]);
});