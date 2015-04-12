/**
 * @author: Ethansure
 */
'use strict';

define(['angular','uiRouter','angularSemantic'],function(angular){
	
	return angular.module('app',['ui.router','angularify.semantic'])
	.config(['$httpProvider',function($httpProvider) {
		$httpProvider.interceptors.push('sessionAuth');
		$httpProvider.interceptors.push('responseErr');
	}])
	.constant("ApiURL","/v1");

});



