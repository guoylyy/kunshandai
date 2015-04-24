'use strict';

define(['../../app','underscore'],function(app,_){

	return app.factory('LoanService', ['$http','$q','ApiURL',
		function($http,$q,ApiURL){
		
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
				loan.interests = Number.parseFloat(loan.interests);
				loan.assureCost = Number.parseFloat(loan.assureCost);
				loan.serviceCost = Number.parseFloat(loan.serviceCost);
				loan.overdueCostPercent = Number.parseFloat(loan.overdueCostPercent);
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

			getLocal:function(){
				return localLoan;
			},
			get:function(page){
				var deferred = $q.defer();

				$http.get(ApiURL+loanUrl+"/all/"+page)
				.then(function(res){
					deferred.resolve(res.data.data);
				},function(res){
					deferred.reject(res.data);
				});

				return deferred.promise;
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
			getPayedList:function(page){
				var deferred = $q.defer();

				return $http.get(ApiURL+loanUrl+"/payBack/list/"+page,JSON.stringify({status:3}))
				.then(function(res){
					return res.data.data;
				},function(res){
					return res.data;
				});

				return deferred.promise;
			},
			getPayments:function(id){

				var deferred = $q.defer();

				$http.get(ApiURL+loanUrl+"/"+id+"/payments")
				.then(function(res){
					deferred.resolve(res.data.data);
				},function(res){
					deferred.reject(res.data);
				});

				return deferred.promise;
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
			paybacks: function(loanId){
				return $http.get(ApiURL+loanUrl+"/"+loanId+"/paybacks");
			}
		}

		return LoanService;
	}]);
});