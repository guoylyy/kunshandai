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
		    			resolve:{
		    				loans:function(DictService,LoanService,$stateParams){
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
		    					return LoanService.getUnpayedList($stateParams.page || 1,startDate,endDate,loanType).then(function(data){
		    						return data;
		    					});
		    				},
		    				loanTypes:function(DictService){
		    					return DictService.get('loanTypes');
		    				},
		    				timeRanges:function(DictService){
		    					return DictService.get("timeRanges");
		    				}	
		    			},
		    			controller: "CollectController"
		    		}
		    	}
		    })
		    .state('collectDone',{
		    	url:"#collect/done?page&startDate&endDate&loanType",
		    	views:{
		    		"main":{
		    			templateUrl: "/angular/manage/collect/collect.html",
		    			resolve:{
		    				loans:function(DictService,LoanService,$stateParams){
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
		    					return LoanService.getPayedList($stateParams.page || 1,startDate,endDate,loanType).then(function(data){
		    						return data;
		    					});
		    				},
		    				loanTypes:function(DictService){
		    					return DictService.get('loanTypes');
		    				},
		    				timeRanges:function(DictService){
		    					return DictService.get("timeRanges");
		    				}	
		    			},
		    			controller: "CollectController"
		    		}
		    	}
		    })

		    .state('allProjects',{
		    	url:"#projects/all?page&startDate&endDate&loanType",
		    	views:{
		    		"main":{
		    			templateUrl: "/angular/manage/project/project.html",
		    			resolve:{
		    				loans:function(DictService,$stateParams,LoanService){
		    					return resolveLoans(LoanService.getLoans,DictService,$stateParams);
		    				},
		    				loanTypes:function(DictService){
		    					return DictService.get('loanTypes');
		    				},
		    				timeRanges:function(DictService){
		    					return DictService.get("timeRanges");
		    				}	
		    			},
		    			controller: "ProjectController"
		    		}
		    	}
		    })
 			.state('normalProjects',{
		    	url:"#projects/normal?page&startDate&endDate&loanType",
		    	views:{
		    		"main":{
		    			templateUrl: "/angular/manage/project/project.html",
		    			resolve:{
		    				loans:function(DictService,LoanService,$stateParams){
		    					return resolveLoans(LoanService.getNormalLoans,DictService,$stateParams);
		    				},
		    				loanTypes:function(DictService){
		    					return DictService.get('loanTypes');
		    				},
		    				timeRanges:function(DictService){
		    					return DictService.get("timeRanges");
		    				}	
		    			},
		    			controller: "ProjectController"
		    		}
		    	}
		    	
		    })
 			.state('overdueProjects',{
		    	url:"#projects/overdue?page&startDate&endDate&loanType",
		    	views:{
		    		"main":{
		    			templateUrl: "/angular/manage/project/project.html",
		    			resolve:{
		    				loans:function(DictService,LoanService,$stateParams){
		    					return resolveLoans(LoanService.getOverdueLoans,DictService,$stateParams);
		    				},
		    				loanTypes:function(DictService){
		    					return DictService.get('loanTypes');
		    				},
		    				timeRanges:function(DictService){
		    					return DictService.get("timeRanges");
		    				}	
		    			},
		    			controller: "ProjectController"
		    		}
		    	}
		    })
 			.state('badbillProjects',{
		    	url:"#projects/badbill?page&startDate&endDate&loanType",
		    	views:{
		    		"main":{
		    			templateUrl: "/angular/manage/project/project.html",
		    			resolve:{
		    				loans:function(DictService,LoanService,$stateParams){
		    					return resolveLoans(LoanService.getBadbillLoans,DictService,$stateParams);
		    				},
		    				loanTypes:function(DictService){
		    					return DictService.get('loanTypes');
		    				},
		    				timeRanges:function(DictService){
		    					return DictService.get("timeRanges");
		    				}	
		    			},
		    			controller: "ProjectController"
		    		}
		    	}
		    })
 		    .state('completedProjects',{
		    	url:"#projects/completed?page&startDate&endDate&loanType",
		    	views:{
		    		"main":{
		    			templateUrl: "/angular/manage/project/project.html",
		    			resolve:{
		    				loans:function(DictService,LoanService,$stateParams){
		    					return resolveLoans(LoanService.getCompleteLoans,DictService,$stateParams);
		    				},
		    				loanTypes:function(DictService){
		    					return DictService.get('loanTypes');
		    				},
		    				timeRanges:function(DictService){
		    					return DictService.get("timeRanges");
		    				}	
		    			},
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
		    	templateUrl: "/angular/manage/common/contract.html",
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



