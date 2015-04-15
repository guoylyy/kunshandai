define(['../app'],function(app){

	return app.factory('DictService', ['$http', 'ApiURL',function($http,ApiURL){
		return {
			get : function (key){
				$http.get(ApiURL+"/dict/"+key).then(function(res){
					return res.data.data;
				},function(){
					return ;
				});
			}
		}
	}])

})