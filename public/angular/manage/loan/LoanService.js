'use strict';

define(['app','underscore','moment','moment_zh_cn'],function(app,_,moment){

	return app.factory('LoanService', ['$http','$q','ApiURL','$log',
		function($http,$q,ApiURL,$log){

		var loanUrl = '/loan';

		var model = {
				// objectId:'',
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
				isEmailRemind:false,
				isSmsRemind:false,
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
				loan.startDate = new Date(loan.startDate);
				loan.endDate = new Date(loan.endDate);
				loan.firstPayDate = new Date(loan.firstPayDate);

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


			var loanPayBackFactory = {
			    payBackInit: {}
			};

			function generateLoanPayBack(payMoney, interestsMoney, payDate, order){
			    var lp = {};
			    lp['payDate'] = payDate;
			    lp['payMoney'] = payMoney;
			    lp['interestsMoney'] = interestsMoney;
			    lp['order'] =order;
			    return lp;
			};
			//先息后本，只生成一期还款,首次还款日期是最终还款日期
			loanPayBackFactory.payBackInit.xxhb = function(loan){
			    var outMoney = loan.amount;
			    var d = moment(loan.firstPayDate).format();//todo:修改成首次还款日期日期
			    return [generateLoanPayBack(outMoney, 0, d,  1)];
			};
			//等额本息需要每月还利息 + 本金 + 逾期违约金
			//生成之时预约违约金为 0
			loanPayBackFactory.payBackInit.debx = function(loan){
			    var baseMoney = loan.amount / loan.payTotalCircle; //每期本金
			    var interestsMoney = loan.amount * loan.interests * loan.payCircle;
			    var overdueMoney = 0;
			    var rlist = [];
			    for (var i = 1; i <= loan.payTotalCircle; i++) {

			        var d = moment(loan.firstPayDate).add(loan.payCircle*(i-1), 'month').format();

			        rlist.push(generateLoanPayBack(baseMoney + interestsMoney + overdueMoney, interestsMoney,
			            d, i));
			    };
			    return rlist;
			};
			//周期初还本付息
			//期间只收利息
			loanPayBackFactory.payBackInit.zqcxhb = function(loan){
			    var baseMoney = 0; //每期还本金
			    var interestsMoney = loan.amount * loan.interests * loan.payCircle;
			    var overdueMoney = 0;
			    var rlist = [];
			    for (var i = 1; i <= loan.payTotalCircle; i++) {

			        var d = moment(loan.firstPayDate).add(loan.payCircle*(i-1), 'month').format();

			        rlist.push(generateLoanPayBack(baseMoney + interestsMoney + overdueMoney, interestsMoney,
			            d, i));
			    };
			    return rlist;
			};
			//周期末息后本
			loanPayBackFactory.payBackInit.zqmxhb = function(loan){
			    var baseMoney = 0; //每期还本金
			    var interestsMoney = loan.amount * loan.interests * loan.payCircle;
			    var overdueMoney = 0;
			    var rlist = [];
			    for (var i = 1; i <= loan.payTotalCircle; i++) {

			        var d = moment(loan.firstPayDate).add(loan.payCircle*(i-1), 'month').format();

			        rlist.push(generateLoanPayBack(baseMoney + interestsMoney + overdueMoney, interestsMoney,
			            d, i));
			    };
			    return rlist;
			};
			//到期本息
			loanPayBackFactory.payBackInit.dqhbfx = function(loan){
			    var baseMoney = parseInt(loan.amount);
			    var d = moment(loan.firstPayDate).format();
			    var overdueMoney = 0;
			    var interestsMoney = baseMoney * loan.interests * loan.spanMonth;
			    return [generateLoanPayBack(interestsMoney+ baseMoney, interestsMoney, d, 1)];
			};

			loanPayBackFactory.factory = function(loan){
			    return new loanPayBackFactory.payBackInit[loan.payWay](loan);
			};


			//外部调用这个接口计算一个项目的还款流程
			//@return list of LoanPackBacks
			function calculatePayBackMoney(loan){
			    return loanPayBackFactory.factory(loan);
			};


		var LoanService = {
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
				var deferred = $q.defer();

				$http.get(ApiURL+loanUrl+"/"+loanId)
				.then(function(res){
					deferred.resolve(typeTransform(res.data.data));
				},function(res){
					$log.error(res);
					deferred.reject(res);
				});

				return deferred.promise;
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
				var deferred = $q.defer();

				$http.get(
					ApiURL+loanUrl+"/"+loanId+"/paybacks"
				).then(function(res){
					deferred.resolve(res.data.data);
				},function(res){
					$log.error(res);
					deferred.reject(res);
				});

				return deferred.promise;
			},
			getPayments:function(loanId){
				var deferred = $q.defer();

				$http.get(ApiURL+loanUrl+"/"+loanId+"/payments")
				.then(function(res){
					deferred.resolve(numberFormat(res.data.data));
				},function(res){
					$log.error(res);
					deferred.reject(res);
				});

				return deferred.promise;

			},
			getCountResult:function(loan){
				return calculatePayBackMoney(loan);
			},
			create : function(loan){

				var deferred = $q.defer();

				$http.post(
					ApiURL+loanUrl+"/create_loan",
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
				var deferred = $q.defer();
				$http.delete(ApiURL+loanUrl+"/"+loanId)
				.then(function(res){
					deferred.resolve(res.data.data);
				},function(res){
					deferred.reject(res);
				});

				return deferred.promise;
			},
			generate: function(contract){
				var deferred = $q.defer();
				$http.post(
					ApiURL+loanUrl+"/generate_bill",
					JSON.stringify(contract)
				).then(function(res){
					deferred.resolve(res.data.data);
				},function(res){
					deferred.reject(res);
				});
				return deferred.promise;
			},
			assure: function(loanId,outMoney,outDate){
				outMoney = parseFloat(outMoney);
				if(typeof outDate !== 'Date'){
					outDate = new Date(outDate);
				}
				var deferred = $q.defer();
				$http.post(
					ApiURL+loanUrl+"/assure_bill",
					JSON.stringify(
						{
							loanId:loanId,
							outMoney:outMoney,
							outDate:outDate
						}
					)
				).then(function(res){
					deferred.resolve(res.data.data);
				},function(){
					deferred.reject('放款失败');
				});
				return deferred.promise;
			},
			countPaymoney:function(payBackId,payDate){
				var payDate = new Date(payDate),
					deferred = $q.defer();

				$http.get(
					ApiURL+loanUrl+"/payBack/"+payBackId+"/bill",
					{params:{payBackDate:payDate}}
				).then(function(res){
					var bill = numberFormat(res.data.data);
					deferred.resolve(bill);
				},function(res){
					$log.error(res);
					deferred.reject(res);
				});

				return deferred.promise;
			},
			countMultiPaymoney:function(loanId,payBackIds,payDate){
				payDate = new Date(payDate);
				var deferred = $q.defer();
				$http.post(
					ApiURL+loanUrl+"/"+loanId+"/mergePayBack/bill",
					JSON.stringify(
						{
							payBackIds:payBackIds,
							payBackDate:payDate
						}
					)
				).then(function(res){
					var bill = numberFormat(res.data.data);
					deferred.resolve(bill);
				},function(res){
					$log.error(res);
					deferred.reject(res);
				});

				return deferred.promise;

			},
			multiPayMoney:function(loanId,payBackIds,payDate,payMoney){
				payDate = new Date(payDate);
				var deferred = $q.defer();
				$http.post(
					ApiURL+loanUrl+"/"+loanId+"/mergePayBack",
					JSON.stringify(
						{
							payBackIds:payBackIds,
							payBackDate:payDate,
							payBackMoney:payMoney
						}
					)
				).then(function(res){
					deferred.resolve(res.data.data);
				},function(res){
					$log.error(res);
					deferred.reject(res);
				})

				return deferred.promise;
			},
			payMoney:function(payBackId,payDate,payMoney,payData){
				var payDate = new Date(payDate);
				var payMoney = parseFloat(payMoney);

				return $http.post(
					ApiURL+loanUrl+"/payBack/"+payBackId,
					JSON.stringify(
						{
							paybackid:payBackId,
							payBackDate:payDate,
							payBackMoney:payMoney,
							payType:payData.payType,
							offsetMoney:payData.offsetMoney
						}
					)
				).then(function(res){
					return res.data.data;
				},function(res){
					$log.error(res);
				});
			},
			countCompleteMoney:function(loanId,payDate,interestCalType){
				var deferred = $q.defer();
				var payDate = new Date(payDate);
				var params = {payDate:payDate,interestCalType:interestCalType};
				$http.get(
					ApiURL+loanUrl+"/payBack/"+loanId+"/finish/bill",
					{params:params}
				).then(function(res){
					var bill = numberFormat(res.data.data);
					deferred.resolve(bill);
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
				payData.income.interest = parseFloat(payData.income.interest);
				payData.income.overdueMoney = parseFloat(payData.income.overdueMoney);
				payData.outcome.assureCost = parseFloat(payData.outcome.assureCost);
				payData.outcome.interest = parseFloat(payData.outcome.interest);
				payData.outcome.keepCost = parseFloat(payData.outcome.keepCost);

				$http.post(
					ApiURL+loanUrl+"/payBack/"+loanId+"/finish",
					JSON.stringify(
						{
							payType:payData.payType,
							payBackDate:payDate,
							payBackData:payData
						}
					)
				).then(function(res){
					deferred.resolve(res.data.data);
				},function(res){
					$log.error(res);
					deferred.reject(res);
				});

				return deferred.promise;
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

		return LoanService;
}]);

});
