/**
 * Created with Sublimetext
 * @author	: Ethansure
 * Date		: 2015/4/10
 * Time		: 23:40
 */

require.config({

	paths:{
		underscore:'../lib/underscore/underscore',
		angular:'../lib/angular/angular',
		uiRouter:'../lib/angular-ui-router/release/angular-ui-router',
		angularSemantic:'../lib/angular-semantic-ui/dist/angular-semantic-ui',
		text:'../lib/requirejs-text/text'
	},
	shim:{
		'angular':{
			exports:'angular'
		},
		'uiRouter':{
			deps:['angular']

		},
		'angularSemantic':{
			deps:['angular']
		},
		'underscore':{
			exports:'_'
		}
	}
});

require([
		 'angular',
		 'app',
		 'account/AccountService',
		 'account/login/LoginController',
		 'account/signup/SignupController',
		 'manage/loan/createLoanCtrl',
		 'common/interceptors/responseErr',
		 'common/interceptors/sessionAuth',
		 'routes'
],function(angular) {
	
	// var $html = angular.element(document.getElementsByTagName('html')[0]);
	
	angular.element(document).ready(function() {
		angular.bootstrap(document, ['app']);
	});
});
