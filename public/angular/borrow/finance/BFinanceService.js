define(['app','moment'],function(app,moment){
	return app.factory('BFinanceService', ['$http','$q','ApiURL','$log',
		function($http, $q, ApiURL, $log){
		
		var financeUrl = '/fiscal';

		BFinanceService  = {
			
			get: function(id,startTime,endTime,summeries,cashes){

				var deferred = $q.defer();
				if(startTime){
					startTime = new Date(parseInt(startTime));
				}
				if(endTime){
					endTime = new Date(parseInt(endTime));
				}
				var params = {
					loan:id,
					startDate:startTime,
					endDate:endTime,
					staticticsType:summeries,
					status:cashes
				};

				$http.get(
					ApiURL + financeUrl + '/borrow',
					{params:params}
				).then(function(res){
					deferred.resolve(res.data.data);
				}, function(res){
					deferred.resolve(res);
				})

				return deferred.promise;
			}
		}

		return BFinanceService;
	}])
})