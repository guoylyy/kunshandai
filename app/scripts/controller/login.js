define(['resources/text'],function(text) {

	var LoginController = ["$scope","$rootScope","$location",function($scope,$rootScope,$location){

		$rootScope.title = text.login;

		$scope.user = {
			mobilePhone:'',
			password:''
		}

		$scope.login = function(){

			
		}
	}]
});