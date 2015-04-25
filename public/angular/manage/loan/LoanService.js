'use strict';

define(['../../app','underscore'],function(app,_){

	return app.factory('LoanService', ['$http','$q','ApiURL','$log',
		function($http,$q,ApiURL,$log){
		
		var loanUrl = '/loan';

		var model = {
				objectId:'', 
				loanType:'', 
				amount:'',    			//number
				spanMonth:'', 			//number
				startDate:'',
				endDate:'',
				payCircle:'', 			//number
				payTotalCircle:'',		//number
				interests:'',			//number
				assureCost:'',			//number
				serviceCost:'',			//number
				overdueCostPercent:'',	//number
				otherCost:'',			//number
				otherCostDesc:'',
				keepCost:'',			//number
				keepCostDesc:'',
				payWay:'',
				firstPayDate:'',
				paybacks:[]
			},
			

			localLoan = _.extend({},model),

			typeTransform = function(loan){

				//format string to float
				loan.amount = Number.parseFloat(loan.amount);
				loan.interests = Number.parseFloat(loan.interests) / 100;
				loan.assureCost = Number.parseFloat(loan.assureCost);
				loan.serviceCost = Number.parseFloat(loan.serviceCost);
				loan.overdueCostPercent = Number.parseFloat(loan.overdueCostPercent) / 1000;
				loan.otherCost = Number.parseFloat(loan.otherCost);
				loan.keepCost = Number.parseFloat(loan.keepCost);
				
				//format string to number
				loan.spanMonth = Number.parseInt(loan.spanMonth);
				loan.payCircle = Number.parseInt(loan.payCircle);
				loan.payTotalCircle = Number.parseInt(loan.payTotalCircle);
				
				//format string to date
				loan.startDate = new Date(loan.startDate);
				loan.endDate = new Date(loan.endDate);
				loan.firstPayDate = new Date(loan.firstPayDate);

				return loan;
			};

		var LoanService = {
			getCorrectFormat:function(loan){
				return typeTransform(loan);
			},
			getLocal:function(){
				return localLoan;
			},
			getLoan:function(loanId){
				return $http.get(ApiURL+loanUrl+"/"+loanId)
				.then(function(res){
					return typeTransform(res.data.data);
				},function(res){
					$log.error(res);
				});
			},
			getLoans:function(page){
				return $http.get(ApiURL+loanUrl+"/all/"+page)
				.then(function(res){
					return res.data.data;
				},function(res){
					$log.error(res);
				});
			},
			getDraft:function(page){
				var deferred = $q.defer();

				$http.get(ApiURL+loanUrl+"/draft/"+page)
				.then(function(res){
					deferred.resolve(res.data.data);
				},function(res){
					deferred.reject(res.data);
				});

				return deferred.promise;
			},
			getUnpayedList:function(page,startDate,endDate,loanType){
				var params = {status:1,startDate:startDate,endDate:endDate,loanType:loanType};
				return $http.get(ApiURL+loanUrl+"/payBack/list/"+page,{params:params})
				.then(function(res){
					return res.data.data;
				},function(res){
					return res.data;
				});

			},
			getPayedList:function(page,startDate,endDate,loanType){
				var params = {status:3,startDate:startDate,endDate:endDate,loanType:loanType};
				return $http.get(ApiURL+loanUrl+"/payBack/list/"+page,{params:params})
				.then(function(res){
					return res.data.data;
				},function(res){
					return res.data;
				});
			},
			getPaybacks: function(loanId){
				return $http.get(ApiURL+loanUrl+"/"+loanId+"/paybacks").then(function(res){
					return res.data.data;
				},function(res){
					$log.error(res);
				});
			},
			getPayments:function(id){
				return $http.get(ApiURL+loanUrl+"/"+id+"/payments")
						.then(function(res){
							return res.data.data[0];
						},function(res){
							$log.error(res);
						});

			},
			create : function(loan){
				
				var deferred = $q.defer();

				$http.post(ApiURL+loanUrl+"/create_loan",JSON.stringify(typeTransform(loan)))
				.then(function(res){
					// _.extend(localLoan,res.data.data);
					deferred.resolve(res.data.data);
				},function(res){
					deferred.reject(res.data);
				});

				return deferred.promise;

			},
			generate: function(contract){
				return $http.post(ApiURL+loanUrl+"/generate_bill",JSON.stringify(contract));
			},
			assure: function(loanId){
				return $http.post(ApiURL+loanUrl+"/assure_bill",JSON.stringify({loanId:loanId}));
			}
		}

		return LoanService;
	}]);
});