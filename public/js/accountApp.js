define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

	
	var accountApp = {

        API : "/api"                   // Base API URL (used by models & collections)
    };

 	// Global event aggregator
    accountApp.eventAggregator = _.extend({}, Backbone.Events);

    return accountApp;

});