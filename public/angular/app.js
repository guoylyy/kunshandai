/**
 * @author: Ethansure
 */
'use strict';

define(['angular','uiRouter','uiBootstrap','angularLoadingBar','uiUtils','angularFileUpload','angularSweetAlert', 'highcharts-ng'],function(angular){
	
	return angular.module('app',['ui.router','ui.bootstrap','angular-loading-bar','ui.utils','angularFileUpload','oitozero.ngSweetAlert','highcharts-ng'])
	.config(['$httpProvider',function($httpProvider) {
		$httpProvider.interceptors.push('sessionAuth');
		$httpProvider.interceptors.push('responseErr');
	}])
	.run(function($rootScope,$state, $urlRouter,$window,AccountService) {
    	$rootScope.$on('$locationChangeSuccess', function(evt) {
      	// Halt state change from even starting
      	evt.preventDefault();
      	// Perform custom logic
      	// 
      	
		var userInfo 	= $window.sessionStorage['userInfo'];
		var loginStatus = $window.sessionStorage['loginStatus'];
		if(userInfo){
			userInfo = JSON.parse(userInfo);
			userInfo.expires  = new Date(userInfo.expires);
		}
		if(loginStatus){
			loginStatus = JSON.parse(loginStatus);
			loginStatus.sessionExpires = new Date(loginStatus.sessionExpires);
		}else{
			loginStatus = {logined:false};
			$window.sessionStorage['loginStatus'] = JSON.stringify(loginStatus);
		}

		var now 		= new Date();

		if(loginStatus.logined){
		    //session过期
			if(now > loginStatus.sessionExpires){
				loginStatus.logined = false;
				$window.sessionStorage['loginStatus'] = JSON.stringify(loginStatus);
				//记住登录状态
				if(userInfo){
					//记住状态期限外
					if(now > userInfo.expires){
						AccountService.login(userInfo).then(function(){
							$urlRouter.sync();
						},function(){
							console.log("自动登录失败");
						});

					}else{
						window.location = '/login';
					}

				}else{
					window.location = '/login';	
				}
			}else{
				if(window.location.pathname == '/login' 
					|| window.location.pathname == '/signup'  
					|| window.location.pathname == '/retrieve_password'){
					window.location = '/manage';		
				}
				$urlRouter.sync();
			}
		}else{

			if(window.location.pathname == '/login' 
				|| window.location.pathname == '/signup' 
				|| window.location.pathname == '/retrieve_password'){
				$urlRouter.sync();
			}else{
				$state.go('login');
				window.location = '/login';
			}
		}
		
    	})
    })
	.constant('datepickerPopupConfig', {
	  datepickerPopup: 'yyyy-MM-dd',
	   currentText: "今天",
	  clearText: "清除",
	  closeText: "关闭",
	  closeOnDateSelection: true,
	  appendToBody: false,
	  showButtonBar: true
	})

	.constant("ApiURL","/v1");

});



