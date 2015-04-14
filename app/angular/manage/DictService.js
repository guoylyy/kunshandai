define(['../app'],function(app){

	return app.factory('DictService', ['$http', 'ApiURL',function($http,ApiURL){
		return {
			get : function (key){
				return $http.post(ApiURL+"/dict",key).data;
			}
		}
	}])

})