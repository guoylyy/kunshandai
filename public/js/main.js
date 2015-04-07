
var DEBUG = true;

require.config({

	paths: {
	    jquery: '../lib/jquery/dist/jquery.min',
	    underscore: '../lib/underscore/underscore-min',
	    backbone: '../lib/backbone/backbone',
	    semantic:'../lib/semantic-ui/dist/semantic.min',
	    text:'../lib/requirejs-text/text',
	    backboneValidation:'../lib/backbone-validation/dist/backbone-validation-amd'
	}

});

require([
	'accountApp',
	'models/session',
	'views/account'
], function(accountApp,Session,AccountView){

	accountApp.session = new Session({});

	new AccountView();
});