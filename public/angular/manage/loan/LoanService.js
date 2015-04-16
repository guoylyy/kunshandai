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