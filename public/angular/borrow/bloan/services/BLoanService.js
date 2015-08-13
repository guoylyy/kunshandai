'use strict';

define(['app','underscore','moment','moment_zh_cn'],function(app,_,moment){

	return app.factory('BLoanService', ['$http','$q','ApiURL','$log','LoanService',
		function($http,$q,ApiURL,$log,LoanService){

		var loanUrl = '/borrow';

		var model = {
				// objectId:'',
				loanType:'',
				amount:'',    						//number
				spanMonth:'', 						//number
				startDate:'',
				endDate:'',
				payCircle:'', 						//number
				payTotalCircle:'',				//number
				interests:'',							//number
				assureCost:'',						//number
				serviceCost:'',						//number
				overdueCostPercent:'',		//number
				overdueBreachPercent:0, 	//number
				otherCost:'',							//number
				otherCostDesc:'',
				keepCost:'',							//number
				keepCostDesc:'',
				payWay:'',
				firstPayDate:'',
				isEmailRemind:true,
				isSmsRemind:true,
				paybacks:[]
			},


			localLoan = _.extend({},model),

			typeTransform = function(loan){

				//format string to float
				loan.amount = parseFloat(loan.amount);
				loan.assureCost = parseFloat(loan.assureCost);
				loan.serviceCost = parseFloat(loan.serviceCost);
				loan.otherCost = parseFloat(loan.otherCost);
				loan.keepCost = parseFloat(loan.keepCost);

				//format string to number
				loan.spanMonth = parseInt(loan.spanMonth);
				loan.payCircle = parseInt(loan.payCircle);
				loan.payTotalCircle = parseInt(loan.payTotalCircle);
				//format string to date
				loan.startDate = new Date(moment(loan.startDate));
				loan.endDate = new Date(moment(loan.endDate));
				loan.firstPayDate = new Date(moment(loan.firstPayDate));

				return loan;
			},
			numberFormat = function(data){
				_.mapObject(data,function(val,key){
					if(typeof val === 'object'){
						numberFormat(data[key]);
					}else if(typeof val === 'number'){
						data[key] = parseFloat(val.toFixed(2));
					}
				});
				return data;
			},
			daysAdd = function(data){

				_.each(data,function(ele,index){
					moment.locale('zh-cn');
					var payDate = data[index]['payDate'] || data[index]['currPayDate']
					data[index]['nowToPayDate'] = moment(payDate).fromNow();
				})
				return data;
			},
			dataTransform = function(loan){
				loan.overdueCostPercent = parseFloat(loan.overdueCostPercent) / 1000;
				loan.overdueBreachPercent = parseFloat(loan.overdueBreachPercent) / 1000;
				loan.interests = parseFloat(loan.interests) / 100;
				return loan;
			},
			getLoanList = function(page,filter,startDate,endDate,loanType){
				var params = {
					startDate:startDate,
					endDate:endDate,
					loanType:loanType
				};
				return $http.get(ApiURL+loanUrl+"/list/"+filter+"/"+page,{params:params})
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


		var BLoanService = {
			getCorrectFormat:function(loan){
				return typeTransform(loan);
			},
			getLocal:function(){
				return localLoan;
			},
			getModel:function(){
				return _.extend({},model);
			},
			getLoan:function(loanId){
				return LoanService.getLoan(loanId);
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
				var deferred = $q.defer();
				 getLoanList(page,"badbill",startDate,endDate,loanType)
				.then(function(res){
					res.values = daysAdd(res.values);
					deferred.resolve(res);
				},function(res){
					deferred.reject(res);
				});

				return deferred.promise;
			},
			getOverdueLoans:function(page,startDate,endDate,loanType){
					var deferred = $q.defer();
					getLoanList(page,"overdue",startDate,endDate,loanType)
					.then(function(res){
						res.values = daysAdd(res.values);
						deferred.resolve(res);
					},function(){
						deferred.reject(res);
					});
					return deferred.promise;
			},
			getCompletedLoans:function(page,startDate,endDate,loanType){
				return getLoanList(page,"completed",startDate,endDate,loanType);
			},
			getUnpayedList:function(page,startDate,endDate,loanType){
				var deferred = $q.defer();
				getPaybackList(page,startDate,endDate,loanType,1)
				.then(function(res){
					res.values  = daysAdd(res.values);
					deferred.resolve(res);
				},function(res){
					deferred.reject(res);
				});
				return deferred.promise;
			},
			getPayedList:function(page,startDate,endDate,loanType){
				 return getPaybackList(page,startDate,endDate,loanType,3);
			},
			getPaybacks: function(loanId){
				return LoanService.getPaybacks(loanId);
			},
			getPayments:function(loanId){
				return LoanService.getPayments(loanId);

			},
			getCountResult:function(loan){
				return calculatePayBackMoney(loan);
			},
			create : function(loan){

				var deferred = $q.defer();

				$http.post(
					ApiURL+loanUrl+"/create",
					JSON.stringify(dataTransform(typeTransform(loan)))
				).then(function(res){
					// _.extend(localLoan,res.data.data);
					deferred.resolve(res.data.data);
				},function(res){
					deferred.reject(res.data);
				});

				return deferred.promise;

			},
			deleteDraftLoan  : function(loanId){
				return LoanService.deleteDraftLoan(loanId);
			},
			generate: function(contract){
				return LoanService.generate(contract);
			},
			assure: function(loanId,outMoney,outDate){
				return LoanService.assure(loanId,outMoney,outDate)
			},
			countPaymoney:function(payBackId,payDate){
				return LoanService.countPaymoney(payBackId,payDate);
			},
			countMultiPaymoney:function(loanId,payBackIds,payDate){
				return LoanService.countMultiPaymoney(loanId,payBackIds,payDate);

			},
			multiPayMoney:function(loanId,payBackIds,payDate,payMoney){
				return LoanService.multiPayMoney(loanId,payBackIds,payDate,payMoney);
			},
			payMoney:function(payBackId,payDate,payMoney,payData){
				return LoanService.payMoney(payBackId,payDate,payMoney,payData);
			},
			countCompleteMoney:function(loanId,payDate,interestCalType){
				return LoanService.countCompleteMoney(loanId,payDate,interestCalType);
			},
			completeLoan:function(loanId,payDate,payData){
				return LoanService.completeLoan(loanId,payDate,payData);
			},
			search:function(type,keyword){
				var deferred = $q.defer();
				var params = {key:keyword,type:type};
				$http.get(
					ApiURL + loanUrl+"/search",
					{params:params}
				).then(function(res){
					deferred.resolve(res.data.data);
				},function(getCountResult){
					deferred.reject(res);
				});

				return deferred.promise;
			},
			statictics:function(type, startDate, endDate){
				var deferred = $q.defer();

				var params = {startDate:startDate,endDate:endDate};
				if(type == 'income') {
					$http.get(
						ApiURL + loanUrl+"/statictics/income",
						{params:params}
					).then(function(res){
						deferred.resolve(res.data.data);
					},function(getCountResult){
						deferred.reject(res);
					});
				}else if(type === 'outcome') {
					$http.get(
						ApiURL + loanUrl+"/statictics/outcome",
						{params:params}
					).then(function(res){
						deferred.resolve(res.data.data);
					},function(getCountResult){
						deferred.reject(res);
					});
				}

				return deferred.promise;
			}
		}

		return BLoanService;
}]);

});
