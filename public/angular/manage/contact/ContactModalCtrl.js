define(['app','underscore'],function(app,_){
	return app.controller('ContactModalCtrl', function($scope,$modalInstance,$modal,control,contact,ContactService,SweetAlert){

		$scope.contact = contact;

		$scope.control = control;

		$scope.unique = true;

		$scope.waitingResponse = false;

		if($scope.control.edit || $scope.control.view) {
			$scope.attachPromise = ContactService.getAttachments($scope.contact.objectId).then(function (data){
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

		$scope.checkContactUnique = function(){
			$scope.waitingResponse = true;
			
			var id = $scope.contact.certificateNum;
			if(!id || $scope.oldCertificateNum === $scope.contact.certificateNum){
				$scope.unique = true;
				$scope.waitingResponse = false;
				return $scope.unique;
			}
			return ContactService.getByCertification(id).then(function(data){
				$scope.unique = false;
				$scope.waitingResponse = false;
			},function(){
				$scope.unique = true;
				$scope.waitingResponse = false;
			});
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
			SweetAlert.swal({
	          title: '确定删除该附件?',
	          text: '删除后将不可恢复',
	          type: 'warning',
	          confirmButtonColor: '#DD6B55',
	          showCancelButton: true
	        }, function() {
	          		ContactService.deleteAttachment($scope.contact.objectId,$scope.contact.attachments[$index].objectId);
					$scope.contact.attachments.splice($index, 1);
	        });
	      	
			
		}
	})
})