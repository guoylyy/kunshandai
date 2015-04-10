/**
 * Created with Sublimetext
 * @author	: Ethansure
 * Date		: 2015/4/10
 * Time		: 23:40
 */

require.config({

	paths:{
		jquery:'../lib/jquery/dist/jquery.min',
		underscore:'../lib/underscore-min',
		angular:'../lib/angular.min',
		angularResource:'../lib/angular-resource/angular-resource',
		text:'../lib/requirejs-text/text',
		semantic:'../lib/semantic-ui/dist/semantic.min'
	},
	shim:{
		'angular':{exports:'angular'},
		'underscore':{exports:'_'}
	}
});

require(['angular',
		 'app',
		 'jquery',
		 'controllers/layout',
		 'controllers/login',
		 'routes'
],function(angular) {
	angular.bootstrap(document,['app']);
});
