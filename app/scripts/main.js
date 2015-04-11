/**
 * Created with Sublimetext
 * @author	: Ethansure
 * Date		: 2015/4/10
 * Time		: 23:40
 */

require.config({

	paths:{
		underscore:'../lib/underscore',
		angular:'../lib/angular/angular',
		angularRoute:'../lib/angular-route/angular-route',
		angularSemantic:'../lib/angular-semantic-ui/dist/angular-semantic-ui',
		text:'../lib/requirejs-text/text',
		semantic:'../lib/semantic-ui/dist/semantic'
	},
	shim:{
		'angular':{
			exports:'angular'
		},
		'angularRoute':{
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
		 'controllers/login',
		 'services/user'
],function(angular) {
	
	// var $html = angular.element(document.getElementsByTagName('html')[0]);
	
	angular.element(document).ready(function() {
		angular.bootstrap(document, ['app']);
	});
});
