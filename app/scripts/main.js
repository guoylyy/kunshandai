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
		text:'../lib/requirejs-text/text',
		semantic:'../lib/semantic-ui/dist/semantic'
	},
	shim:{
		'angular':{exports:'angular'},
		'underscore':{exports:'_'}
	}
});

require(['angular',
		 'app',
		
		 'routes'
],function(angular) {
	// angular.bootstrap(document,['app']);
	var $html = angular.element(document.getElementsByTagName('html')[0]);
	angular.element().ready(function() {
			// bootstrap the app manually
			angular.bootstrap(document, ['app']);
		});
});
