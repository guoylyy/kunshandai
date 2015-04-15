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
		uiBootstrap:'../lib/angular-bootstrap/ui-bootstrap-tpls',
		uiRouter:'../lib/angular-ui-router/release/angular-ui-router',
		text:'../lib/requirejs-text/text'
	},
	shim:{
		'angular':{
			exports:'angular'
		},
		'uiRouter':{
			deps:['angular']

		},
		'uiBootstrap':{
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
		 'manage/DictService',
		 'account/AccountService',
		 'manage/loan/LoanService',
		 'manage/contact/ContactService',
		 'account/login/LoginController',
		 'account/signup/SignupController',
		 'manage/loan/CreateLoanCtrl',
		 'common/interceptors/responseErr',
		 'common/interceptors/sessionAuth',
		 'common/directive/numberInput',
		 'routes'
],function(angular) {
	
	// var $html = angular.element(document.getElementsByTagName('html')[0]);
	
	angular.element(document).ready(function() {
		angular.bootstrap(document, ['app']);
	});
});
