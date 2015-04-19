/**
 * @author: Ethansure
 */
'use strict';

define(['angular','uiRouter','uiBootstrap','angularLoadingBar','uiUtils','angularFileUpload','angularSweetAlert'],function(angular){
	
	return angular.module('app',['ui.router','ui.bootstrap','angular-loading-bar','ui.utils','angularFileUpload','oitozero.ngSweetAlert'])
	.config(['$httpProvider',function($httpProvider) {
		$httpProvider.interceptors.push('sessionAuth');
		$httpProvider.interceptors.push('responseErr');
	}])
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



