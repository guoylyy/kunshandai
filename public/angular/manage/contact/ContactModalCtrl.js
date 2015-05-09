define(['app','underscore'],function(app,_){
	return app.controller('ContactModalCtrl', function($scope,$modalInstance,$modal,control,contact,ContactService,SweetAlert){

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

		$scope.checkContactUnique = function(){
			if($scope.oldCertificateNum === $scope.contact.certificateNum){
				$scope.unique = true;
				return;
			}
			var id = $scope.contact.certificateNum;
			if(!id){
				$scope.unique = true;
				return;
			}
			return ContactService.getByCertification(id).then(function(data){
				$scope.unique = false;
			},function(){
				$scope.unique = true;
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