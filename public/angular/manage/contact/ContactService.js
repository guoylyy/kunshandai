define(['../../app'],function(app){

	return app.factory('ContactService', ['$http','$q','ApiURL',
		function($http,$q,ApiURL){
		
		var contactUrl = '/contact',

		    model = {
		    id:'',
			objectId:'',
			certificateType:'',
			name:'',
			certificateNum:'',
			mobilePhoneNumber:'',
			email:'',
			qq:'',
			wechat:'',
			address:'',
			sendSmsOrNot: false,
			attachments:[]	
		}, 

			loaner = _.extend({},model),

			assurer = _.extend({},model);

		var getModel = function(){
			return _.extend({},model);
		}	

		var updateAttachments = function(contactId,attachmetn_ids){
			var attachDeferred = $q.defer(),
			 	totalNum = attachmetn_ids.length,
			 	addNum 	 = 0,
				attachmentId = '';
			for(var i = 0 ; i < totalNum ; i++){
				
				$http.post(ApiURL+contactUrl+"/"+contactId+"/attachments/"+attachmetn_ids[i]).then(function(res){
					addNum += 1;
					if(addNum == totalNum){
						attachDeferred.resolve("附件新增成功");
					}
				},function(res){
					attachDeferred.resolve("附件新增失败");
				});
			}

			return attachDeferred.promise;
		};

		var ContactService = {
			
			getLoaner: function(){
				return loaner;
			},
			getAssurer: function(){
				return assurer;
			},
			getModel:function(name){
				return getModel();
			},
			create : function(contact){
				
				var sendContact = _.extend({},contact);
				var deferred = $q.defer();

				sendContact.attachments = _.pluck(sendContact.attachments,'objectId');

				$http.post(ApiURL+contactUrl,JSON.stringify(sendContact)).then(function(res){
					deferred.resolve(res.data.data);
				},function(res){
					deferred.reject(res.data);
				});
				return deferred.promise;
			},
			update : function(contact){
				var sendContact = angular.copy(contact);
				var deferred = $q.defer();
				for(var i = 0;i < sendContact.attachments.length;i++){
					if(!sendContact.attachments[i].newUpload){
						sendContact.attachments[i] = '';
					}
				}
				sendContact.attachments = _.pluck(_.compact(sendContact.attachments),'objectId');

				$http.put(ApiURL+contactUrl+"/"+contact.objectId,JSON.stringify(sendContact)).then(function(res){
					//更新附件
					if(sendContact.attachments.length > 0 ){
						updateAttachments(contact.objectId,sendContact.attachments).then(function(reason){
							deferred.resolve(res.data.data);
						},function(){
							deferred.reject("更新附件失败");
						})
					}else{
						deferred.resolve(res.data.data);
					}
					
				},function(res){
					deferred.reject("更新客户失败");
				});
				return deferred.promise;
			},
			deleteAttachment : function(contactId,attchmentId){
				var attachDeferred = $q.defer();

				$http.delete(ApiURL+contactUrl+"/"+contactId+"/attachments/"+attchmentId).then(function(res){
					attachDeferred.resolve("附件删除成功");
				},function(res){
					attachDeferred.resolve("附件删除失败");
				});
				return attachDeferred.promise;
			},
			remove : function(id){
				var deferred = $q.defer();
				$http.delete(ApiURL+contactUrl+"/"+id).then(function(res){
					deferred.resolve(res.data.data);
				},function(){
					deferred.reject(res);
				});
				return deferred.promise;
			},
			get: function(id){
				var deferred = $q.defer();
				$http.get(ApiURL+contactUrl+"/"+id).then(function(res){
					deferred.resolve(res.data.data);
				},function(){
					deferred.reject(res);
				});
				return deferred.promise;
			},
			getAll: function(){
				var deferred = $q.defer();

				$http.get(ApiURL+contactUrl+"/list/all").then(function(res){
					deferred.resolve(res.data.data);
				},function(res){
					deferred.reject(res);
				});
				return deferred.promise;
			},
			getByCertification:function(certificateNum){
				if(!certificateNum){
					return;
				}
				var deferred = $q.defer();

				$http.get(ApiURL+contactUrl+"/certificate/"+certificateNum).then(function(res){
					if(res.status === 404){
						deferred.reject(res);
					}else{
						deferred.resolve(res.data.data);
					}
				},function(res){
					deferred.reject(res);
				});
				return deferred.promise;
			},
			search: function(type,key){
				var deferred = $q.defer();
				var params = {type:type,key:key};
				$http.get(ApiURL+contactUrl+"/list/search",{params:params}).then(function(res){
					deferred.resolve(res.data.data);
				},function(res){
					deferred.reject(res);
				});
				return deferred.promise;
			},
			getAttachments:function(id){
				var deferred = $q.defer();

				$http.get(ApiURL+contactUrl+"/"+id+"/attachments").then(function(res){
					deferred.resolve(res.data.data);
				},function(res){
					
					deferred.reject(res);
				});

				return deferred.promise;
			}
		};

		return ContactService;
		

	}]);
});