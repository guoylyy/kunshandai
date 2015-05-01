define(['app','underscore'],function(app,_){
	return app.controller('ContactModalCtrl', function($scope,$modalInstance,$modal,control,contact,ContactService){

		$scope.contact = contact;

		$scope.control = control;

		if($scope.control.edit || $scope.control.view) {
			ContactService.getAttachments($scope.contact.objectId).then(function (data){
				$scope.contact.attachments = data;
			});
		}

		$scope.cancel = function(){
			$modalInstance.dismiss('cancel');
		}

		$scope.startEdit = function(){
			$scope.control.view = false;
			$scope.control.edit = true;
		}

		$scope.finishEdit = function(){
			$modalInstance.close($scope.contact);
		}

		$scope.finishCreate = function(){
			$modalInstance.close($scope.contact);
		}

		$scope.uploadAttachment = function(){
			var modalInstance = $modal.open({
			  templateUrl: '/angular/manage/common/upload/uploadModal.html',
			  controller: 'UploadController',
			  size: 'lg',
			  resolve: {
			    type: function() {
			      return '客户';
			    }
			  }
			});
			modalInstance.result.then(function(fileList) {
				$scope.contact.attachments = _.union($scope.contact.attachments,fileList);
			});
		}

		$scope.removeAttachment = function($index){
			$scope.contact.attachments.splice($index, 1);
		}
	})
})