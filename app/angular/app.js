/**
 * @author: Ethansure
 */
'use strict';

define(['angular','uiRouter','angularSemantic'],function(angular){
	
	return angular.module('app',['ui.router','angularify.semantic'])
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



