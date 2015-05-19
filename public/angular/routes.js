'use strict'

define(['app','underscore'],function(app,_){

	return app.config(['$stateProvider','$urlRouterProvider','$locationProvider',
		function($stateProvider,$urlRouterProvider,$locationProvider){


		$locationProvider.html5Mode({
		  enabled: true,
		  requireBase: false
		});

		var resolveLoans = function(fn,LoanService,DictService,$stateParams){
		    var startDate, endDate, loanType;
			if(!$stateParams.startDate){
				var timeRanges = DictService.get('timeRanges');
				startDate = timeRanges[0].startDate;
				endDate = timeRanges[0].endDate;
				$stateParams.startDate = startDate;
				$stateParams.endDate = endDate;
				// if(fn === LoanService.getLoans){
				// 	endTimeRS = new Date(parseInt(startDate));
				// 	endTimeRE = new Date(parseInt(endDate));
				// 	$stateParams.endTimeRS = startDate;
				// 	$stateParams.endTimeRE = endDate;
				// }
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
		    		return resolveLoans(eval(fn),LoanService,DictService,$stateParams);
		    	},
				loanTypes:function(DictService){
					return DictService.get('loanTypes');
				},
				timeRanges:function(DictService){
					return DictService.get("timeRanges");
				}
			}
		},
		resolveLoan = function(){
			return{
				loan:function(LoanService,$stateParams){
					var loanId = $stateParams.ref || $stateParams.id
					if(loanId){
						return LoanService.getLoan(loanId).then(function(data){
		    				return data;
		    			})
					}else{
						return null;
					}

		    	}
			}
		},

		resolveSelectItems = function(){
			return {
	    		loanTypes:function(DictService){
	    			 return DictService.get('loanTypes');
	    		},
	    		repayTypes:function(DictService){
	    			 return DictService.get('payBackWays');
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
		    	url:"/manage?startDate&endDate",
    			templateUrl:  "/angular/manage/index/index.html",
    			resolve: {
    				incomeStatistics: function(LoanService, $stateParams){
    					if(!$stateParams.startDate || !$stateParams.endDate) {
    						var currDate = new Date();
    						var startDate = new Date(currDate.getFullYear(),
    																		 currDate.getMonth(),
    																		 1);
    						var endDate = new Date(currDate.getFullYear(),
    																	 currDate.getMonth(),
    																	 new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0).getDate());
    						return LoanService.statictics('income', startDate, endDate).then(function(data){
	    						return data;
	    					});
    					}else{
								return LoanService.statictics('income', $stateParams.startDate, $stateParams.endDate).then(function(data){
	    						return data;
	    					});
    					}
    				},
    				outcomeStatistics: function(LoanService, $stateParams){
    					if(!$stateParams.startDate || !$stateParams.endDate) {
    						var currDate = new Date();
    						var startDate = new Date(currDate.getFullYear(),
    																		 currDate.getMonth(),
    																		 1);
    						var endDate = new Date(currDate.getFullYear(),
    																	 currDate.getMonth(),
    																	 new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0).getDate());
    						return LoanService.statictics('outcome', startDate, endDate).then(function(data){
	    						return data;
	    					});
    					}else{
								return LoanService.statictics('outcome', $stateParams.startDate, $stateParams.endDate).then(function(data){
	    						return data;
	    					});
    					}
    				}
    			},
    			controller: 'IndexController'
		    })

		    .state('fianceStatistics',{
		    	url:"/manage/fianceStatistics",
		    	templateUrl:  "/angular/manage/index/index.html",
		    	controller: 'IndexController'
		    })

		    .state('draftLoans',{
		    	url:"/manage/loan/draft?page",
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
		    	url:"/manage/collect/pending?page&startDate&endDate&loanType",
    			templateUrl: "/angular/manage/collect/collect.html",
    			resolve:resolveObject("LoanService.getUnpayedList"),
    			controller: "CollectController"
		    })
		    .state('collectDone',{
		    	url:"/manage/collect/done?page&startDate&endDate&loanType",
    			templateUrl: "/angular/manage/collect/collect.html",
    			resolve:resolveObject("LoanService.getPayedList"),
    			controller: "CollectController"
		    })

		    .state('allProjects',{
		    	url:"/manage/projects/all?page&startDate&endDate&loanType",
    			templateUrl: "/angular/manage/project/project.html",
    			resolve:resolveObject("LoanService.getLoans"),
    			controller: "ProjectController"
		    })
 			.state('normalProjects',{
		    	url:"/manage/projects/normal?page&loanType",
    			templateUrl: "/angular/manage/project/project.html",
    			resolve:resolveObject("LoanService.getNormalLoans"),
    			controller: "ProjectController"
		    })
 			.state('overdueProjects',{
		    	url:"/manage/projects/overdue?page&loanType",
    			templateUrl: "/angular/manage/project/project.html",
    			resolve:resolveObject("LoanService.getOverdueLoans"),
    			controller: "ProjectController"
		    })
 			.state('badbillProjects',{
		    	url:"/manage/projects/badbill?page&loanType",
    			templateUrl: "/angular/manage/project/project.html",
    			resolve:resolveObject("LoanService.getBadbillLoans"),
    			controller: "ProjectController"
		    })
 		    .state('completedProjects',{
		    	url:"/manage/projects/completed?page&loanType",
    			templateUrl: "/angular/manage/project/project.html",
    			resolve:resolveObject("LoanService.getCompletedLoans"),
    			controller: "ProjectController"
		    })
		    .state('searchProjects',{
		    	url:"/manage/projects/search?page&type&keyword",
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
		    	url:"/manage/contact?page",
    			templateUrl: "/angular/manage/contact/contact.html",
    			resolve:{
						contacts:function(ContactService, $stateParams){
		    			return ContactService.getByPage($stateParams.page || 1).then(function(data){
    						return data;
    					});
		    		}
    			},
    			controller: "ContactController"
		    })
		    .state('searchContact',{
		    	url:"/manage/contact/search?type&keyword",
    			templateUrl: "/angular/manage/contact/contact.html",
    			resolve:{
						contacts:function(ContactService, $stateParams){
		    			return ContactService.search($stateParams.type,$stateParams.keyword).then(function(data){
			    			return data;
			    		})
		    		}
    			},
    			controller: "ContactController"
		    })
  			.state('createProject',{
		    	url:"/createProject?ref",
    			templateUrl: "/angular/manage/loan/create_loanDetail.html",
    			resolve:_.extend(resolveSelectItems(),resolveLoan()),
    			controller: "LoanFormCtrl"
		    })
		    .state('createProjectMore',{
		    	url:"/createProject?ref#more",
				templateUrl: "/angular/manage/loan/create_loanInfo.html",
		    	controller:"LoanContactFormCtrl"
		    })
		 	 .state('createProjectFinal',{
		    	url:"/createProject?ref#projectDetail",
		    	templateUrl: "/angular/manage/common/contract/contract.html",
		    	controller: "LoanDetailCtrl"
		    })
		 	 // 调整项目
		 	.state('modifyProject',{
		    	url:"/loan/:id/modify",
		    	templateUrl: "/angular/manage/loan/create_loanDetail.html",
		    	resolve:_.extend(resolveSelectItems(),resolveLoan()),
		    	controller: "LoanFormCtrl"

		    })
		    .state('modifyProjectMore',{
		    	url:"#more",
		    	templateUrl: "/angular/manage/loan/create_loanInfo.html",
		    	controller: "LoanContactFormCtrl"

		    })
		    .state('modifyProjectFinal',{
		    	url:"#final",
		    	templateUrl: "/angular/manage/common/contract/contract.html",
		    	resolve:resolveSelectItems(),
		    	controller: "ModifyLoanFinalCtrl"
		    })
		 	.state('manage',{
		    	url:"/manage",
		    	templateUrl: "/angular/manage/index/index.html"
		    })
		    .state('help',{
		    	url:"/help",
		    	templateUrl: "/angular/common/template/help.html"
		    });

	}]);

});
