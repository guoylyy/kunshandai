'use strict';

define(['app',"underscore"],function(app,_) {

	function userInfo(){
		return {
				name:'',
				certificateNum:'',
				mobilePhoneNum:'',
				email:'',
				qq:'',
				wechat:'',
				address:''
			};
	}
	return app.controller('createLoanCtrl', ["$scope","$location",
			function($scope,$location){
			
			$scope.br = userInfo();
			
			$scope.gr = userInfo();

	}]);
});