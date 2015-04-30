'use strict'

define(['app'],function(app){
	
	return app.config(['$stateProvider','$urlRouterProvider','$locationProvider',
		function($stateProvider,$urlRouterProvider,$locationProvider){
		
		  // $urlRouterProvider.when('/createLoan','/createLoan#info');
		$locationProvider.html5Mode({
		  enabled: true,
		  requireBase: false
		});
		var resolveLoans = function(fn,DictService,$stateParams){
		    var startDate, endDate,loanType;
			if(!$stateParams.startDate){
				var timeRanges = DictService.get('timeRanges');
				startDate = timeRanges[0].startDate;
				endDate = timeRanges[0].endDate;
				$stateParams.startDate = startDate;
				$stateParams.endDate = endDate;
			} 
		    startDate = new Date(parseInt($stateParams.startDate));
		    endDate = new Date(parseInt($stateParams.endDate));
		    loanType = $stateParams.loanType;
		    $stateParams.page = $stateParams.page || 1
		    return fn.call(this,$stateParams.page,startDate,endDate,loanType).then(function(data){
		    	return data;
		    });
			
		};
		var resolveObject = function(fn){
			return {
				loans:function(DictService,LoanService,$stateParams){
		    		return resolveLoans(eval(fn),DictService,$stateParams);
		    	},
				loanTypes:function(DictService){
					return DictService.get('loanTypes');
				},
				timeRanges:function(DictService){
					return DictService.get("timeRanges");
				}	
			}
		};

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
<<<<<<< HEAD
		    .state('loan',{
		    	url:'/loan?id',
		    	templateUrl: "angular/manage/common/contract/contract.html",
		    	resolve:{
		    		loan:function(LoanService,$stateParams){
		    			return LoanService.getLoan($stateParams.id).then(function(data){
		    				return data;
		    			})
		    		},
		    		paybacks:function(LoanService,$stateParams){
		    			return LoanService.getPaybacks($stateParams.id).then(function(data){
		    				return data;
		    			})
		    		},
		    		payments:function(LoanService,$stateParams){
		    			return LoanService.getPayments($stateParams.id).then(function(data){
		    				return data;
		    			})
		    		},
		    		pwan:function(PwanService,$stateParams){
		    			return PwanService.getPawn($stateParams.id).then(function(data){
		    				return data;
		    			})
		    		},
		    		attachments:function(LoanService,ContactService,$stateParams){
		    			var attachments = {};
		    			return LoanService.getLoan($stateParams.id).then(function(data){
		    				ContactService.getAttachments(data.loaner.id).then(function(data){
		    					attachments.br = data;
		    				});
		    				if(data.assurer.id){
		    					ContactService.getAttachments(data.assurer.id).then(function(data){
		    						attachments.gr = data;
		    					});
		    				}
		    				return attachments;
		    			})
		    		}
		    	},
		    	controller:'ContractController'
		    })
=======
		    .state('retrieve_password', {
		    	url: "/retrieve_password",
		    	templateUrl: "angular/account/retrieve_password/retrieve_password.html",
		    	controller:'RetrievePasswordController'
		    })

>>>>>>> origin/master
		     // manage module routes
		    
		    .state('index',{
		    	url:"/manage",
		    	views:{
		    		"main":{
		    			templateUrl:  "/angular/manage/index/index.html",
		    			controller: 'IndexController'
		    		}
		    	}
		    })
		    // .state('loan',{
		    // 	url:"#loan",
		    // 	views:{
		    // 		"main":{templateUrl: "/angular/manage/loan/loan.html"}
		    // 	}
		    // })
		    .state('draftLoans',{
		    	url:"#loan/draft?page",
		    	views:{
		    		"main":{
		    			templateUrl: "/angular/manage/loan/draft/draft.html",
		    			resolve:{
		    				draftLoans:function(LoanService,$stateParams){
		    					return LoanService.getDraft($stateParams.page || 1).then(function(data){
		    						return data;
		    					});
		    				}	
		    			},
		    			controller: "DraftLoanCtrl"
		    		}
		    	}
		    	
		    })
		    .state('collectPending',{
		    	url:"#collect/pending?page&startDate&endDate&loanType",
		    	views:{
		    		"main":{
		    			templateUrl: "/angular/manage/collect/collect.html",
		    			resolve:resolveObject("LoanService.getUnpayedList"),
		    			controller: "CollectController"
		    		}
		    	}
		    })
		    .state('collectDone',{
		    	url:"#collect/done?page&startDate&endDate&loanType",
		    	views:{
		    		"main":{
		    			templateUrl: "/angular/manage/collect/collect.html",
		    			resolve:resolveObject("LoanService.getPayedList"),
		    			controller: "CollectController"
		    		}
		    	}
		    })

		    .state('allProjects',{
		    	url:"#projects/all?page&startDate&endDate&loanType",
		    	views:{
		    		"main":{
		    			templateUrl: "/angular/manage/project/project.html",
		    			resolve:resolveObject("LoanService.getLoans"),
		    			controller: "ProjectController"
		    		}
		    	}
		    })
 			.state('normalProjects',{
		    	url:"#projects/normal?page&startDate&endDate&loanType",
		    	views:{
		    		"main":{
		    			templateUrl: "/angular/manage/project/project.html",
		    			resolve:resolveObject("LoanService.getNormalLoans"),
		    			controller: "ProjectController"
		    		}
		    	}
		    	
		    })
 			.state('overdueProjects',{
		    	url:"#projects/overdue?page&startDate&endDate&loanType",
		    	views:{
		    		"main":{
		    			templateUrl: "/angular/manage/project/project.html",
		    			resolve:resolveObject("LoanService.getOverdueLoans"),
		    			controller: "ProjectController"
		    		}
		    	}
		    })
 			.state('badbillProjects',{
		    	url:"#projects/badbill?page&startDate&endDate&loanType",
		    	views:{
		    		"main":{
		    			templateUrl: "/angular/manage/project/project.html",
		    			resolve:resolveObject("LoanService.getBadbillLoans"),
		    			controller: "ProjectController"
		    		}
		    	}
		    })
 		    .state('completedProjects',{
		    	url:"#projects/completed?page&startDate&endDate&loanType",
		    	views:{
		    		"main":{
		    			templateUrl: "/angular/manage/project/project.html",
		    			resolve:resolveObject("LoanService.getCompletedLoans"),
		    			controller: "ProjectController"
		    		}
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
		    	templateUrl: "/angular/manage/loan/create_loanDetail.html",
		    	resolve:{
		    		loanTypes:function(DictService){
		    			 return DictService.get('loanTypes');
		    		},
		    		repayTypes:function(DictService){
		    			 return DictService.get('payBackWays');
		    		},
		    		steps:function(){
		    			return [true,false,false];
		    		}
		    	},
		    	controller: "CreateLoanCtrl"

		    })
		    .state('createLoanContact',{
		    	url:"#contact",
		    	templateUrl: "/angular/manage/loan/create_loanInfo.html",
		    	resolve:{
		    		loanTypes:function(){
		    			 return '';
		    		},
		    		repayTypes:function(){
		    			 return '';
		    		},
		    		steps:function(){
		    			return [false,true,false];
		    		}
		    	},
		    	controller:"CreateLoanCtrl"

		    })
		 	 .state('contractCreated',{
		    	url:"#contract",
		    	templateUrl: "/angular/manage/common/contract/contract.html",
		    	resolve:{
		    		loanTypes:function(){
		    			 return '';
		    		},
		    		repayTypes:function(){
		    			 return '';
		    		},
		    		steps:function(){
		    			return [false,false,true];
		    		}
		    	},
		    	controller: "CreateLoanCtrl"

		    }).state('manage',{
		    	url:"/manage",
		    	views:{
		    		"main":{templateUrl: "/angular/manage/index/index.html"}
		    	}
		    });

	}]);

});



