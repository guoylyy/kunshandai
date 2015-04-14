define(['../app'],function(app){

	return app.factory('DictService', ['$http', 'ApiURL',function($http,ApiURL){
		return function getDicts(key){
			return $http.post(ApiURL+"/dict"+key).data;
		};
	}])

})