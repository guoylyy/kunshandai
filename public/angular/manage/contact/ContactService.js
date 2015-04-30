define(['../../app'],function(app){

	return app.factory('ContactService', ['$http','$q','ApiURL',
		function($http,$q,ApiURL){
		
		var contactUrl = '/contact',

		    model = {
			objectId:'',
			certificateType:'',
			name:'',
			certificateNum:'',
			mobilePhoneNum:'',
			email:'',
			qq:'',
			wechat:'',
			address:'',
			attachments:[]	
		}, 

			loaner = _.extend({},model),

			assurer = _.extend({},model);

		var ContactService = {
			
			getLoaner: function(){
				return loaner;
			},
			getAssurer: function(){
				return assurer;
			},
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
			get: function(id){
				return $http.get(ApiURL+contactUrl+"/"+id);
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