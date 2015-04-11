/**
 * @author: Ethansure
 */
'use strict';

define(['angular','angularRoute','angularSemantic'],function(angular){
	
	return angular.module('app',['ngRoute','angularify.semantic'])
	.constant("ApiURL","/v1");

});



