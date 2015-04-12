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
			//acount module routes
		    .state('login', {
		    	url: "/login",
		    	templateUrl: "angular/account/login/login.html",
		    	controller:'LoginController'
		    })
		    .state('signup', {
		    	url: "/signup",
		    	templateUrl: "angular/account/signup/signup.html"
		      
		    })

		     // manage module routes
		    .state('manage',{
		    	url:"/manage",
		    	views:{
		    		"main":{templateUrl: "/angular/manage/index/index.html"}
		    	}
		    })
		    .state('index',{
		    	url:"#index",
		    	views:{
		    		"main":{templateUrl:  "/angular/manage/index/index.html"}
		    	}
		    })
		    .state('loan',{
		    	url:"#loan",
		    	views:{
		    		"main":{templateUrl: "/angular/manage/loan/loan.html"}
		    	}
		    })
		    .state('collect',{
		    	url:"#collect",
		    	views:{
		    		"main":{templateUrl: "/angular/manage/collect/collect.html"}
		    	}
		    })
		    .state('collect.pendding',{
		    	url:"/pendding"
		    })
		    .state('collect.done',{
		    	url:"/done"
		    })
		    .state('project',{
		    	url:"#project",
		    	views:{
		    		"main":{templateUrl: "/angular/manage/project/project.html"}
		    	}
		    })
		    .state('client',{
		    	url:"#client",
		    	views:{
		    		"main":{templateUrl: "/angular/manage/client/client.html"}
		    	}
		    })
		    .state('createLoan',{
		    	url:"/createLoan",
		    	views:{
		    		"main":{templateUrl: "/angular/manage/loan/create_loanInfo.html"},
		    		"ctrl":{templateUrl: "/angular/manage/loan/loanInfo_ctrl.html"}
		    	}
		    })
		    .state('createLoanDetail',{
		    	url:"#detail",
		    	views:{
		    		"main":{templateUrl: "/angular/manage/loan/create_loan.html"},
		    		"ctrl":{templateUrl: "/angular/manage/loan/loan_ctrl.html"}
		    	}
		    })
		    ;

	}]);

});



