define(['../app'],function(app){

	return app.factory('DictService', ['$http','$q','ApiURL',function($http,$q,ApiURL){

		var keys = {};

		var timeRangeValues = function(){
			var now = new Date();
			var year = now.getFullYear();
			var month = now.getMonth();
			var day = now.getDate();
			var start = new Date(year,month,day);
			var end = new Date(year,month,day);
			return [
				{
					startDate:null, //new Date("1970-01-01").getTime(),
					endDate: null,//new Date("2070-01-01").getTime(),
					text:'所有'
				},
				{
					startDate: start.getTime(),
					endDate: end.setMonth(start.getMonth()+1),
					text:'小于1个月'
				},
				{
					startDate: start.setMonth(start.getMonth()+1),
					endDate: end.setMonth(start.getMonth()+3),
					text:'1~3个月'
				},
				{
					startDate: start.setMonth(start.getMonth()+3),
					endDate: end.setMonth(start.getMonth()+6),
					text:'3~6个月'
				},
				{
					startDate: start.setMonth(start.getMonth()+6),
					endDate: end.setMonth(start.getMonth()+9),
					text:'6~9个月'
				},
				{
					startDate: start.setMonth(start.getMonth()+9),
					endDate: end.setMonth(start.getMonth()+12),
					text:'9~12个月'
				},
				{
					startDate: start.setMonth(start.getMonth()+12),
					endDate: end.setMonth(start.getMonth()+120),
					text:'多于12个月'
				}
			]

		}

		return {
			get : function (key){
				if(key === 'timeRanges'){
					return timeRangeValues();
				}
				if(keys[key]){
					return keys[key];
				}
				return $http.get(ApiURL+"/dict/"+key).then(function(res){
					return keys[key] = res.data.data;
				},function(res){
					console.log("fetch dict error "+key);
				});
			}
		}
	}])

})
