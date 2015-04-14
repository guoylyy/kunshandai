define(['../../app'],function(app){

	return app.factory('ContactService', ['$http', 'ApiURL',
		function($http,ApiURL){
		
		var contact = '/contract';
		
		return{
			create : function(data){
				return $http.post(ApiURL+contact,JSON.stringify(data));
			},
			get: function(data){
				return $http.get(ApiURL+contact+"/"+data);
			}
		}
		

	}]);
});