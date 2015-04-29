define(['app'],function(app){
	return app.factory('PwanService', ['$http','$q','ApiURL', function($http,$q,ApiURL){
		
		var pawnUrl = "/loanPawn";

		var car 	= {
				pawnType:{
					text:"抵押方式",
					value:[],
					items:['过户','装GPS','押车','押车证']
				},
				carNum:{
					text:"车牌号",
					value:''
				},
				engineNum:{
					text:'发动机号',
					value:''
				},
				frameNum:{
					text:'车架号',
					value:''
				},
				owner:{
					text:'车主',
					value:''
				},
				color:{
					text:'颜色',
					value:''
				},
				drivingLicense:{
					text:'行驶证号',
					value:''
				},
				brand:{
					text:'汽车品牌',
					value:''
				},
				price:{
					text:'评估价格',
					value:''
				}
			},

			house	= {
				pawnType:{
					text:"抵押方式",
					value:[],
					items:['网签','他项权证','押车证']
				},
				houseCertificate:{
					text:'房产证号',
					value:''
				},
				landCertificate:{
					text:'土地证号',
					value:''
				},
				owner:{
					text:'业主',
					value:''
				},
				area:{
					text:'房屋面积(平方米)',
					value:''
				},
				city:{
					text:'所在城市',
					value:''
				},
				zone:{
					text:'小区',
					value:''
				},
				buildingNum:{
					text:'楼号',
					value:''
				},
				roomNum:{
					text:'室号',
					value:''
				},
				price:{
					text:'评估价格',
					value:''
				}

			};

		return {

			getLocal:function(type){
				if(type === 'fcdy' || type === 'mfdy'){
					return house;
				}else if(type === 'qcdy' || type === 'mcdy'){
					return car;	
				}else{
					return '';
				}
			},
			
			create:function(data,attachments){
				
				var sendAttachment = {}

				sendAttachment = _.pluck(attachments,'objectId');

				var deferred = $q.defer();

				$http.post(ApiURL+pawnUrl,JSON.stringify({data:data,attachments:sendAttachment})).then(function(res){

					deferred.resolve(res.data.data);

				},function(res){
					deferred.reject(res);
				})

				return deferred.promise;
			},
			getPawn:function(loanId){
				var deferred = $q.defer();

				$http.get(ApiURL+pawnUrl+"/"+loanId+"/attachments").then(function(res){

					deferred.resolve(res.data.data);

				},function(res){
					deferred.reject(res);
				})

				return deferred.promise;
			}
		}
	}])
})