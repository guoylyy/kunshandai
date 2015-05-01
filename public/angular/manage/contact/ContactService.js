define(['../../app'],function(app){

	return app.factory('ContactService', ['$http','$q','ApiURL',
		function($http,$q,ApiURL){
		
		var contactUrl = '/contact',

		    model = {
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

		var ContactService = {
			
			getLoaner: function(){
				return loaner;
			},
			getAssurer: function(){
				return assurer;
			},
			getModel:function(){
				return getModel();
			},
			//这个目前不用
			getLocalContact:function(name){
				if(!localContacts[name]){
					var newContact = getModel();
					addLocalContact(name,newContact);
					return newContact;
				}else{
					return localContact[name];
				}
			},
			create : function(contact){
				
				var sendContact = _.extend({},contact);

				sendContact.attachments = _.pluck(sendContact.attachments,'objectId');

				var deferred = $q.defer();

				$http.post(ApiURL+contactUrl,JSON.stringify(sendContact)).then(function(res){
			
					deferred.resolve(res.data.data);
			
				},function(res){
					deferred.reject(res.data);
				});
				
				return deferred.promise;

			},
			update : function(contact){
				var sendContact = _.extend({},contact);

				sendContact.attachments = _.pluck(sendContact.attachments,'objectId');
				console.log(sendContact.attachments);

				var deferred = $q.defer();

				$http.put(ApiURL+contactUrl+"/"+contact.objectId,JSON.stringify(sendContact)).then(function(res){
			
					deferred.resolve(res.data.data);
			
				},function(res){
					deferred.reject(res.data);
				});
				
				return deferred.promise;
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