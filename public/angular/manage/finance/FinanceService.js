define(['app'],function(app){
	return app.factory('FinanceService', ['$http','$q','ApiURL','$log',
		function($http, $q, ApiURL, $log){
		
		var financeUrl = '/fiscal';

		FinanceService  = {
			
			get: function(id){

				var deferred = $q.defer();
				var params = {loan:'559401f4e4b0d84d2c0dbb0c'};
				$http.get(
					ApiURL + financeUrl + '/loan',
					{params:params}
				).then(function(res){
					deferred.resolve(res.data.data);
				}, function(res){
					deferred.resolve(res);
				})

				return deferred.promise;
			}
		}

		return FinanceService;
	}])
})