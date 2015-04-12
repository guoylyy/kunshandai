/**
 * @author: Ethansure
 */
'use strict';

define(['angular','uiRouter','angularSemantic'],function(angular){
	
	return angular.module('app',['ui.router','angularify.semantic'])
	.constant("ApiURL","/v1");

});



