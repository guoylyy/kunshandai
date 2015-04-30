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
			},
			getLoanList = function(page,filter,startDate,endDate,loanType){
				var params = {startDate:startDate,endDate:endDate,loanType:loanType};
				return $http.get(ApiURL+loanUrl+"/"+filter+"/"+page,{params:params})
				.then(function(res){
					return res.data.data;
				},function(res){
					$log.error(res);
				});

			},

			getPaybackList = function(page,startDate,endDate,loanType,status){
				var params = {status:status,startDate:startDate,endDate:endDate,loanType:loanType};
				return $http.get(ApiURL+loanUrl+"/payBack/list/"+page,{params:params})
				.then(function(res){
					return res.data.data;
				},function(res){
					return res.data;
				});
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
			getNormalLoans:function(page,startDate,endDate,loanType){
				return getLoanList(page,"normal",startDate,endDate,loanType);
			},
			getLoans:function(page,startDate,endDate,loanType){
				return getLoanList(page,"all",startDate,endDate,loanType);
			},
			getDraft:function(page,startDate,endDate,loanType){
				return getLoanList(page,"draft",startDate,endDate,loanType);
			},
			getBadbillLoans:function(page,startDate,endDate,loanType){
				return getLoanList(page,"badbill",startDate,endDate,loanType);
			},
			getOverdueLoans:function(page,startDate,endDate,loanType){
				return getLoanList(page,"overdue",startDate,endDate,loanType);
			},
			getCompletedLoans:function(page,startDate,endDate,loanType){
				return getLoanList(page,"completed",startDate,endDate,loanType);
			},
			getUnpayedList:function(page,startDate,endDate,loanType){
				return getPaybackList(page,startDate,endDate,loanType,1);

			},
			getPayedList:function(page,startDate,endDate,loanType){
				return getPaybackList(page,startDate,endDate,loanType,3);
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
			},
			countPaymoney:function(payBackId,payDate){
				var payDate = new Date(payDate);
				return $http.post(ApiURL+loanUrl+"/payBack/"+payBackId+"/bill",JSON.stringify({payBackDate:payDate}))
				.then(function(res){
					return res.data.data;
				},function(res){
					$log.error(res);
				});
			},
			payMoney:function(payBackId,payDate,payMoney){
				var payDate = new Date(payDate);
				var payMoney = Number.parseFloat(payMoney);

				return $http.post(ApiURL+loanUrl+"/payBack/"+payBackId,JSON.stringify({paybackid:payBackId,payBackDate:payDate,payBackMoney:payMoney}))
				.then(function(res){
					return res.data.data;
				},function(res){
					$log.error(res);
				});
			},
			countCompleteMoney:function(loanId,payDate){
				var deferred = $q.defer();
				var payDate = new Date(payDate);
				var params = {payDate:payDate};
				$http.get(ApiURL+loanUrl+"/payBack/"+loanId+"/finish",{params:params})
				.then(function(res){
					deferred.resolve(res.data.data);
				},function(res){
					$log.error(res);
					deferred.reject(res);
				});

				return deferred.promise;
			},
			completeLoan:function(loanId,payDate,payData){
				var deferred = $q.defer();
			
				var payDate = new Date(payDate);
				
				payData.income.amount = parseFloat(payData.income.amount);
				payData.income.overdueMoney = parseFloat(payData.income.overdueMoney);
				payData.outcome.assureCost = parseFloat(payData.outcome.assureCost);
				payData.outcome.keepCost = parseFloat(payData.outcome.keepCost);

				$http.post(ApiURL+loanUrl+"/payBack/"+loanId+"/finish",JSON.stringify({payBackDate:payDate,payBackData:payData}))
				.then(function(res){
					deferred.resolve(res.data.data);
				},function(res){
					$log.error(res);
					deferred.reject(res);
				});

				return deferred.promise;
			}
		}

		return LoanService;
	}]);
});