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
		angularAnimate:'../lib/angular-animate/angular-animate',
		uiBootstrap:'../lib/angular-bootstrap/ui-bootstrap-tpls',
		uiRouter:'../lib/angular-ui-router/release/angular-ui-router',
		uiUtils:'../lib/angular-ui-utils/ui-utils',
		i18nZh:'../lib/i18n/angular-locale_zh-cn',
		'highcharts-ng': '../lib/highcharts-ng/dist/highcharts-ng',
		angularLoadingBar:'../lib/angular-loading-bar/build/loading-bar',
		angularFileUpload:'../lib/ng-file-upload/angular-file-upload',	
		angularSweetAlert:'../lib/angular-sweetalert/SweetAlert',
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
		'uiUtils':{
			deps:['angular']
		},
		'underscore':{
			exports:'_'
		},
		'i18nZh':{
			deps:['angular']
		},
		'angularLoadingBar':{
			deps:['angular']
		},
		'angularFileUpload':{
			deps:['angular']
		},
		'angularSweetAlert':{
			deps:['angular']
		},
		'highcharts-ng':{
			deps:['angular']
		}

	}
});

require([
		 'angular',
		 'app',
		 'i18nZh',
		 
		 'account/AccountService',
		 'account/AccountController',
		 'account/login/LoginController',
		 'account/signup/SignupController',
		 'account/retrieve_password/RetrievePasswordController',

		 'manage/index/IndexController',

		 'manage/DictService',
		 'manage/common/upload/UploadController',
		 'manage/common/upload/UploadService',
		 'manage/common/active/ActiveLoanCtrl',
		 'manage/common/contract/ContractController',
		
		 'manage/loan/CreateLoanCtrl',
		 'manage/loan/draft/DraftLoanCtrl',
		 'manage/loan/LoanService',
		 'manage/loan/pwan/PwanService',

		 'manage/collect/CollectProcessCtrl',
		 'manage/collect/CollectController',

		 'manage/project/ProjectController',
		 
		 'manage/contact/ContactService',
		 'manage/nav/NavController',
		 
		 'common/interceptors/responseErr',
		 'common/interceptors/sessionAuth',
		 'common/directive/numberInput',
		 'common/directive/floatNumberInput',
		 'common/filter/cDisplay',
		 
		 'routes'
],function(angular) {
	
	// var $html = angular.element(document.getElementsByTagName('html')[0]);
	
	angular.element(document).ready(function() {
		angular.bootstrap(document, ['app']);
	});
});
