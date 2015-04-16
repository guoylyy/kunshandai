'use strict';

define(['../../app'],function(app){

	return app.factory('LoanService', ['$http', 'ApiURL',
		function($http,ApiURL){
		
		var loanUrl = '/loan';
		
		return{
			create : function(data){
				return $http.post(ApiURL+loanUrl+"/create_loan",JSON.stringify(data));
			},
			generate: function(data){
				return $http.post(ApiURL+loanUrl+"/generate_bill",JSON.stringify(data));
			}
		}

	}]);
});