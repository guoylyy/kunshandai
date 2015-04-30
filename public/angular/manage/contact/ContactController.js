define(['app'],function(app){
	return app.controller('ContactController', ['$scope','contacts','SweetAlert','$modal','ContactService', 
		function($scope,contacts,SweetAlert,$modal,ContactService){

		$scope.contacts = contacts;

		$scope.totalNum = $scope.contacts.length;
		$scope.currPage = 1;
		$scope.numPerPage = 10;
		$scope.currContacts = $scope.contacts.slice(($scope.currPage - 1) * $scope.numPerPage, $scope.currPage * $scope.numPerPage);

		$scope.view = function(contactId,controlName){
			openContactModal(contactId,'view');
		}
		
		$scope.edit = function(contactId,controlName){
			openContactModal(contactId,'edit');
		}

		$scope.create = function(){
			openContactModal('','create');
		}

		$scope.pageChanged = function (){
			$scope.currContacts = $scope.contacts.slice(($scope.currPage - 1) * $scope.numPerPage, $scope.currPage * $scope.numPerPage);
		}

		var openContactModal = function(contatId,controlName){
			var contactModal = $modal.open({
				templateUrl: '/angular/manage/contact/contactModal.html',
				controller:'ContactModalCtrl',
				size:'md',
				resolve:{
					contact:function(){
					 	if(contatId) {
						 	return ContactService.get(contatId);
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
		
	}])
})