define(['../app'],function(app){

	return app.factory('DictService', ['$http','$q','ApiURL',function($http,$q,ApiURL){
		return {
			get : function (key){
				
				return $http.get(ApiURL+"/dict/"+key);
			}
		}
	}])

})