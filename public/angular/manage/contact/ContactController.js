define(['app'],function(app){
	return app.controller('ContactController', ['$scope','contacts','SweetAlert','$modal','ContactService', 
		function($scope,contacts,SweetAlert,$modal,ContactService){

		$scope.contacts = contacts;

		$scope.view = function(contactId,controlName){
			openContactModal(contactId,'view');
		}
		
		$scope.edit = function(contactId,controlName){
			openContactModal(contactId,'edit');
		}

		$scope.create = function(){
			openContactModal('','create');
		}
		var openContactModal = function(contatId,controlName){
			var  contactModal = $modal.open({
				templateUrl: '/angular/manage/contact/contactModal.html',
				controller:'ContactModalCtrl',
				size:'md',
				resolve:{
					contact:function(){
						 if(contatId) {
							 // return ContactService.get(contactId).then(function(data){
							// 	return data;
							// })
		    				return {
		    					name:'pjx',
			    				certificationNum:'52273219911002202',
						    	mobilePhoneNum:'1888888888'
					    	}
					    }else{
					    	return ContactService.getModel();
					    }
					},
					control:function(){
						var control = {
							view:false,
							edit:false,
							create:false
						}

						control[controlName] = true;
						return control;
					}
				}
			});

			contactModal.result.then(function(edited){
				

			},function(){

			})
		}

		$scope
		
	}])
})