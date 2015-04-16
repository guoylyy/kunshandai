'use strict'

define(['app'],function(app){
	
	return app.config(['$stateProvider','$urlRouterProvider','$locationProvider',
		function($stateProvider,$urlRouterProvider,$locationProvider){
		
		  // $urlRouterProvider.when('/createLoan','/createLoan#info');
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
		    .state('collectPendding',{
		    	url:"#collect/pendding",
		    	views:{
		    		"main":{templateUrl: "/angular/manage/collect/collect.html"}
		    	}
		    })
		    .state('collectDone',{
		    	url:"#collect/done",
		    	views:{
		    		"main":{templateUrl: "/angular/manage/collect/collect.html"}
		    	}
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
		    	templateUrl: "/angular/manage/loan/create_loanInfo.html",
		    	resolve:{
		    		loanTypes:function(DictService){
		    			 return {};
		    		},
		    		repayTypes:function(DictService){
		    			 return {};
		    		}
		    	},
		    	controller:"CreateLoanCtrl"

		    })
		    .state('createLoanDetail',{
		    	url:"#detail",
		    	templateUrl: "/angular/manage/loan/create_loanDetail.html",
		    	resolve:{
		    		loanTypes:function(DictService){
		    			 return DictService.get('loanTypes').then(function(res){
		    			 	return res.data;
		    			 });
		    		},
		    		repayTypes:function(DictService){
		    			  return DictService.get('payBackWays').then(function(res){
		    			 	return res.data;
		    			 });
		    		}
		    	},
		    	controller: "CreateLoanCtrl"
		    	// controller:function($scope,loanTypes,repayTypes){
		    	// 	$scope.loanTypes = loanTypes.data.data;
		    	// 	$scope.loanTypes = repayTypes.data.data;
		    	// }
		    });

	}]);

});



