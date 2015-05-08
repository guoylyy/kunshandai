define(['app','underscore'],function(app,_){
	return app.factory('PawnService', ['$http','$q','ApiURL', function($http,$q,ApiURL){
		
		var pawnUrl = "/loanPawn";

		var car 	= {
				pawnType:{
					text:"抵押方式",
					value:[],
					items:['合同公证','律师公证','预售登录','押车证'],
					order:0
				},
				carNum:{
					text:"车牌号",
					value:'',
					order:1,
				},
				engineNum:{
					text:'发动机号',
					value:'',
					order:2
				},
				frameNum:{
					text:'车架号',
					value:'',
					order:3
				},
				owner:{
					text:'车主',
					value:'',
					order:4
				},
				color:{
					text:'颜色',
					value:'',
					order:5
				},
				drivingLicense:{
					text:'行驶证号',
					value:'',
					order:6
				},
				brand:{
					text:'汽车品牌',
					value:'',
					order:7
				},
				price:{
					text:'评估价格',
					value:'',
					order:8
				}
			},

			house	= {
				pawnType:{
					text:"抵押方式",
					value:[],
					items:['合同公证','律师见证','预售登录','押产证','网签'],
					order:0
				},
				houseCertificate:{
					text:'房产证号',
					value:[],
					characters:['房产证','字第','号'],
					order:1
				},
				landCertificate:{
					text:'土地证号',
					value:[],
					characters:['国有','第','号'],
					order:2
				},
				owner:{
					text:'业主',
					value:'',
					order:3
				},
				area:{
					text:'房屋面积(平方米)',
					value:'',
					order:4
				},
				city:{
					text:'所在城市',
					value:'',
					order:5
				},
				zone:{
					text:'小区',
					value:'',
					order:6
				},
				buildingNum:{
					text:'楼号',
					value:'',
					order:7
				},
				roomNum:{
					text:'室号',
					value:'',
					order:8
				},
				price:{
					text:'评估价格',
					value:'',
					order:9
				}

			};
		var pawnTypeTransform = function(data){
			var i = 0;
			var pawnTypeValue  = [];
			for(i = 0;i < data.pawnType.items.length;i++){
				if(data.pawnType.value[i]){
					pawnTypeValue[i] = data.pawnType.items[i];
				}else{
					pawnTypeValue[i] = '';
				}
			}
			pawnTypeValue[i] = data.pawnType.value[i];
			data.pawnType.value = _.compact(pawnTypeValue);
			return data;
		}
		return {

			getLocal:function(type){
				if(typeof type === 'object'){
					type = type.value;
				}
				if(type === 'fcdy' || type === 'mfdy'){
					return house;
				}else if(type === 'qcdy' || type === 'mcdy'){
					return car;	
				}else{
					return '';
				}
			},
			
			create:function(data){
				
				if(data === ''){
					return '';
				}

				var attachments = _.extend({},data.attachments);
				var attachmentIds = _.pluck(attachments,'objectId');
				var sendData = _.omit(data,'attachments');
				sendData = pawnTypeTransform(sendData);

				var deferred = $q.defer();
				$http.post(ApiURL+pawnUrl,JSON.stringify({data:sendData,attachments:attachmentIds})).then(function(res){

					deferred.resolve(res.data.data);

				},function(res){
					deferred.reject(res);
				})

				return deferred.promise;
			},
			getPawn:function(pawnId){
				var deferred = $q.defer();

				$http.get(ApiURL+pawnUrl+"/"+pawnId+"/attachments").then(function(res){

					deferred.resolve(res.data.data);

				},function(res){
					deferred.reject(res);
				})

				return deferred.promise;
			},
			getPawnInfo:function(pawnId){
				var deferred = $q.defer();

				$http.get(ApiURL+pawnUrl+"/"+pawnId).then(function(res){

					deferred.resolve(res.data.data.data);

				},function(res){
					deferred.reject(res);
				})

				return deferred.promise;
			}
		}
	}])
})