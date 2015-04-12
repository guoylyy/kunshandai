'use strict'

define(['app'],function(app){
	
	return app.config(['$stateProvider','$urlRouterProvider','$locationProvider',
		function($stateProvider,$urlRouterProvider,$locationProvider){
		
		 // $urlRouterProvider.otherwise("/login");
		 $locationProvider.html5Mode({
		  enabled: true,
		  requireBase: false
		});
		$stateProvider
		    .state('login', {
		    	url: "/login",
		    	templateUrl: "angular/account/login/login.html",
		    	controller:'LoginController'
		    })
		    .state('signup', {
		    	url: "/signup",
		    	templateUrl: "angular/account/signup/signup.html"
		      
		    }).state('manage.index',{
		    	url:"/manage/index",
		    	templateUrl: "angular/manage/index/index.html"
		    }).state('manage.loan',{
		    	url:"/manage/loan",
		    	templateUrl: "angular/manage/loan/loan.html"
		    }).state('manage.collect',{
		    	url:"/manage/collect",
		    	templateUrl: "angular/manage/collect/collect.html"
		    });

	}]);

});



