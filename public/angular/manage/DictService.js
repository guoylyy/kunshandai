define(['../app','moment'],function(app,moment){

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
					endDate: new Date(year,month,day).setMonth(end.getMonth()+1),
					text:'小于1个月'
				},
				{
					startDate: new Date(year,month,day).setMonth(start.getMonth()+1),
					endDate: new Date(year,month,day).setMonth(end.getMonth()+3),
					text:'1~3个月'
				},
				{
					startDate: new Date(year,month,day).setMonth(start.getMonth()+3),
					endDate: new Date(year,month,day).setMonth(end.getMonth()+6),
					text:'3~6个月'
				},
				{
					startDate: new Date(year,month,day).setMonth(start.getMonth()+6),
					endDate: new Date(year,month,day).setMonth(end.getMonth()+9),
					text:'6~9个月'
				},
				{
					startDate: new Date(year,month,day).setMonth(start.getMonth()+9),
					endDate: new Date(year,month,day).setMonth(end.getMonth()+12),
					text:'9~12个月'
				},
				{
					startDate: new Date(year,month,day).setMonth(start.getMonth()+12),
					endDate: new Date(year,month,day).setMonth(start.getMonth()+120),
					text:'多于12个月'
				}
			]

		};

		var financeRangeValues = function() {
			return [
				{
					startTime:null, //new Date("1970-01-01").getTime(),
					endTime: null,//new Date("2070-01-01").getTime(),
					text:'所有'
				},
				{
					startTime: new Date(moment().startOf('day')).getTime(),
					endTime: new Date(moment().endOf('day')).getTime(),
					text:'本日'
				},
				{
					startTime: new Date(moment().startOf('week')).getTime(),
					endTime: new Date(moment().endOf('week')).getTime(),
					text:'本周'
				},
				{
					startTime: new Date(moment().startOf('month')).getTime(),
					endTime: new Date(moment().endOf('month')).getTime(),
					text:'本月'
				},
				{
					startTime: new Date(moment().startOf('year')).getTime(),
					endTime: new Date(moment().endOf('year')).getTime(),
					text:'本年'
				}
			]

		};

		var homeTimeRangeValues = function() {
			return [
				{
					startDate: new Date(moment().subtract(9, 'days')).getTime(),
					endDate: new Date(moment().subtract(1, 'days')).getTime()
				},
				{
					startDate: new Date(moment().startOf('day')).getTime(),
					endDate: new Date(moment().endOf('day')).getTime()
				},
				{
					startDate: new Date(moment().add(1, 'days')).getTime(),
					endDate: new Date(moment().add(9, 'days')).getTime()
				}
			]
		};

		return {
			get : function (key){
				if(key === 'timeRanges'){
					return timeRangeValues();
				}
				if(key === 'financeRanges'){
					return financeRangeValues();
				}
				if(key === 'homeRanges'){
					return homeTimeRangeValues();
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
