/**
 * @author: Ethansure
 */
'use strict';

define(['angular','uiRouter','uiBootstrap','angularLoadingBar','uiUtils','angularFileUpload','angularSweetAlert', 'highcharts-ng','angularBusy','uiSelect','angualrSanitize'],function(angular){
	var changeUrl = function(evt){
		if(window.location.pathname == '/login'
			|| window.location.pathname == '/signup'
			|| window.location.pathname == '/help'
			|| window.location.pathname == '/retrieve_password'){
			return;
		}else{
			evt.preventDefault();
			window.location = '/login';
			return;
		}
	}
	return angular.module('app',['ui.router','ui.bootstrap','angular-loading-bar','ui.utils','angularFileUpload','oitozero.ngSweetAlert','highcharts-ng','cgBusy','ui.select','ngSanitize'])
	.config(['$httpProvider',function($httpProvider) {
		$httpProvider.interceptors.push('sessionAuth');
		$httpProvider.interceptors.push('responseErr');
	}])
	.value('cgBusyDefaults',{
	  message:'请求数据中...',
	  backdrop: true,
	  // templateUrl: 'my_custom_template.html',
	  delay: 0,
	  minDuration: 0
	})
	.run(function($rootScope,$state, $urlRouter,$window,$location,AccountService) {
    	$rootScope.$on('$locationChangeStart', function(evt) {
      	// Halt state change from even starting
      	// Perform custom logic
      	//

		var userInfo 	= $window.localStorage['userInfo'];
		var loginStatus = $window.localStorage['loginStatus'];
		if(userInfo){
			userInfo = JSON.parse(userInfo);
			userInfo.expires  = new Date(userInfo.expires);
		}
		if(loginStatus){
			loginStatus = JSON.parse(loginStatus);
			loginStatus.sessionExpires = new Date(loginStatus.sessionExpires);
		}else{
			loginStatus = {logined:false};
			$window.localStorage['loginStatus'] = JSON.stringify(loginStatus);
		}

		var now 		= new Date();


		//自动登录情况
		if(userInfo){
			//session过期
			if(now > loginStatus.sessionExpires){
				loginStatus.logined = false;
				$window.localStorage['loginStatus'] = JSON.stringify(loginStatus);

				//记住状态期限内则重新登录，否则跳到登录页面
				if(now < userInfo.expires){
					AccountService.login(userInfo).then(function(){
						document.location.reload(true);
					},function(){
						console.log("自动登录失败");
					});

				}else{

					changeUrl(evt);
				}

			}else{
				return;
			}
		}else{
			//session过期
			if(now > loginStatus.sessionExpires){
				loginStatus.logined = false;
				$window.localStorage['loginStatus'] = JSON.stringify(loginStatus);
				changeUrl(evt);
				return;
			}else{
				return;
			}
		}
    // //自动登录情况或 不自动登录情况下用户已登录
		// if(loginStatus.logined || userInfo){
		//     //session过期
		// 	if(now > loginStatus.sessionExpires){
		// 		loginStatus.logined = false;
		// 		$window.localStorage['loginStatus'] = JSON.stringify(loginStatus);
		// 		//记住登录状态
		// 		if(userInfo){
		// 			//记住状态期限内
		// 			if(now < userInfo.expires){
		// 				AccountService.login(userInfo).then(function(){
		// 					// $urlRouter.sync();
		// 					document.location.reload(true);
		// 				},function(){
		// 					console.log("自动登录失败");
		// 				});
		//
		// 			}else{
		//
		// 				evt.preventDefault();
		// 				window.location = '/login';
		// 				return;
		// 			}
		//
		// 		}else{
		// 			evt.preventDefault();
		// 			window.location = '/login';
		// 		}
		//
		// 	}else{
		// 		if(window.location.pathname == '/login'
		// 			|| window.location.pathname == '/signup'
		// 			|| window.location.pathname == '/retrieve_password'){
		//
		// 			evt.preventDefault();
		// 			window.location = '/manage';
		// 			return;
		// 		}else{
		// 			// $urlRouter.sync();
		// 			return;
		// 		}
		//
		// 	}
		// }else{
		//
		// 	if(window.location.pathname == '/login'
		// 		|| window.location.pathname == '/signup'
		// 		|| window.location.pathname == '/help'
		// 		|| window.location.pathname == '/retrieve_password'){
		// 		// $urlRouter.sync();
		// 	}else{
		// 		// $state.go('login');
		// 		evt.preventDefault();
		// 		window.location = '/login';
		// 		// $location.path('/login');
		//
		// 		return;
		// 	}
		// }

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
