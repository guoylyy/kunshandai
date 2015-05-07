'use strict'

define(['app'],function(app){
	
	return app.config(['$stateProvider','$urlRouterProvider','$locationProvider',
		function($stateProvider,$urlRouterProvider,$locationProvider){
		
		 
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
			.state('home',{
				url:"/home",
		    	controller:function(){
					document.location.reload(true);
				}
			})
		    .state('login', {
		    	url: "/login",
		    	templateUrl: "angular/account/login/login.html",
		    	controller:'LoginController'
		    })
		    .state('signup', {
		    	url: "/signup",
		    	templateUrl: "angular/account/signup/signup.html"
		      
		    })
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
		    		// pawn:function(loan,PawnService,$stateParams){
		    		// 	return PawnService.getPawn(loan.pawn.id).then(function(data){
		    		// 		return data;
		    		// 	})
		    		// },
		    		attachments:function($q,LoanService,ContactService,$stateParams){
		    			var attachments = {};

		    			var defferrd = $q.defer();

		    			LoanService.getLoan($stateParams.id).then(function(loanData){
		    				
		    				 ContactService.getAttachments(loanData.loaner.id).then(function(attachdata){
		    					attachments.br = attachdata;

		    				}).then(function(){
		    					if(loanData.assurer && loanData.assurer.id){
			    					
			    					ContactService.getAttachments(loanData.assurer.id).then(function(attachdata){
			    						attachments.gr = attachdata;
			    						defferrd.resolve(attachments);
			    					});
		    					}else{
		    						defferrd.resolve(attachments);
		    					}
		    				})
		    			})

		    			return defferrd.promise;
		    		}
		    	},
		    	controller:'ContractController'
		    })

		    .state('retrieve_password', {
		    	url: "/retrieve_password",
		    	templateUrl: "angular/account/retrieve_password/retrieve_password.html",
		    	controller:'RetrievePasswordController'
		    })
		     // manage module routes

		    .state('index',{
		    	url:"/manage",
    			templateUrl:  "/angular/manage/index/index.html",
    			controller: 'IndexController'
		    })

		    .state('fianceStatistics',{
		    	url:"/manage/fianceStatistics",
		    	templateUrl:  "/angular/manage/index/index.html",
		    	controller: 'IndexController'
		    })

		    .state('draftLoans',{
		    	url:"#loan/draft?page",
    			templateUrl: "/angular/manage/loan/draft/draft.html",
    			resolve:{
    				draftLoans:function(LoanService,$stateParams){
    					return LoanService.getDraft($stateParams.page || 1).then(function(data){
    						return data;
    					});
    				}	
    			},
    			controller: "DraftLoanCtrl"
		    })
		    .state('collectPending',{
		    	url:"#collect/pending?page&startDate&endDate&loanType",
    			templateUrl: "/angular/manage/collect/collect.html",
    			resolve:resolveObject("LoanService.getUnpayedList"),
    			controller: "CollectController"
		    })
		    .state('collectDone',{
		    	url:"#collect/done?page&startDate&endDate&loanType",
    			templateUrl: "/angular/manage/collect/collect.html",
    			resolve:resolveObject("LoanService.getPayedList"),
    			controller: "CollectController"
		    })

		    .state('allProjects',{
		    	url:"#projects/all?page&startDate&endDate&loanType",
    			templateUrl: "/angular/manage/project/project.html",
    			resolve:resolveObject("LoanService.getLoans"),
    			controller: "ProjectController"
		    })
 			.state('normalProjects',{
		    	url:"#projects/normal?page&startDate&endDate&loanType",
    			templateUrl: "/angular/manage/project/project.html",
    			resolve:resolveObject("LoanService.getNormalLoans"),
    			controller: "ProjectController"
		    })
 			.state('overdueProjects',{
		    	url:"#projects/overdue?page&startDate&endDate&loanType",
    			templateUrl: "/angular/manage/project/project.html",
    			resolve:resolveObject("LoanService.getOverdueLoans"),
    			controller: "ProjectController"
		    })
 			.state('badbillProjects',{
		    	url:"#projects/badbill?page&startDate&endDate&loanType",
    			templateUrl: "/angular/manage/project/project.html",
    			resolve:resolveObject("LoanService.getBadbillLoans"),
    			controller: "ProjectController"
		    })
 		    .state('completedProjects',{
		    	url:"#projects/completed?page&startDate&endDate&loanType",
    			templateUrl: "/angular/manage/project/project.html",
    			resolve:resolveObject("LoanService.getCompletedLoans"),
    			controller: "ProjectController"
		    })
		    .state('searchProjects',{
		    	url:"#projects/search?page&type&keyword",
				templateUrl: "/angular/manage/project/project.html",
				resolve:{
					loans:function(LoanService,$stateParams){
			    		return LoanService.search($stateParams.type,$stateParams.keyword).then(function(data){
			    			return data;
			    		})
			    	},
					loanTypes:function(DictService){
						return DictService.get('loanTypes');
					},
					timeRanges:function(DictService){
						return DictService.get("timeRanges");
					}	
				},
				controller: "ProjectController"
		    })
		    .state('contact',{
		    	url:"#contact",
    			templateUrl: "/angular/manage/contact/contact.html",
    			resolve:{
					contacts:function(ContactService){
		    			return ContactService.getAll();
		    		}
    			},
    			controller: "ContactController"
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
		    	templateUrl: "/angular/manage/index/index.html"
		    });

	}]);

});



