/**
 * @author: Ethansure
 */
'use strict';

define(['angular','uiRouter','uiBootstrap'],function(angular){
	
	return angular.module('app',['ui.router','ui.bootstrap'])
	// .run(function($rootScope, $urlRouter) {
	//     $rootScope.$on('$locationChangeSuccess', function(evt) {
	//       evt.preventDefault();
	//      $urlRouter.sync();
	//     });
	// })
	.config(['$httpProvider',function($httpProvider) {
		$httpProvider.interceptors.push('sessionAuth');
		$httpProvider.interceptors.push('responseErr');
	}])
	.constant("ApiURL","/v1");

});



