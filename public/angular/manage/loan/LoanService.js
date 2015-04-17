'use strict';

define(['../../app','underscore'],function(app,_){

	return app.factory('LoanService', ['$http','$q','ApiURL',
		function($http,$q,ApiURL){
		
		var loanUrl = '/loan';

		var model = {
				objectId:'',
				loanType:'',
				amount:0,
				spanMonth:0,
				startDate:'',
				endDate:'',
				payCircle:0,
				payTotalCircle:0,
				interests:0,
				assureCost:0,
				serviceCost:0,
				overdueCostPercent:0,
				otherCost:0,
				keepCost:0,
				payWay:'',
				firstPayDate:''
			},
			

			localLoan = _.extend({},model);

		var LoanService = {

			getLocal:function(){
				return localLoan;
			},
			create : function(loan){
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

				var deferred = $q.defer();

				$http.post(ApiURL+loanUrl+"/create_loan",JSON.stringify(loan))
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
			}
		}

		return LoanService;
	}]);
});