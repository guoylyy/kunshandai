define(['app','underscore'],function(app,_){
	return app.controller('UploadController', function($scope,$modalInstance,UploadService,SweetAlert,type){
		
		$scope.type = type;
  		
  		$scope.attachmentType = 'certification';

		$scope.fileList = [];

		$scope.attchTypes = UploadService.getAttachmentTypes();

		$scope.fileStatus = UploadService.getFileStatus();

		$scope.finish= function () {
			_.each($scope.fileList,function(file,index){
				if(file.error){
					delete $scope.fileList[index];
				}
			})
			$scope.fileList = _.compact($scope.fileList);
    		$modalInstance.close($scope.fileList);
  		};	


		$scope.$watch('files', function () {
			if($scope.files && $scope.files.length){
				_.each($scope.files,function(file){
					file.attachmentType = $scope.attachmentType;

				})	
				$scope.fileList = _.union($scope.fileList,$scope.files);
				UploadService.upload($scope.files,$scope.attachmentType);
			}
		  
		});


		$scope.cancel = function () {
		    if($scope.fileList.length){
		    	 SweetAlert.swal({
				   title: "确定取消上传附件?",
				   text: "已上传的附件将被删除",
				   type: "warning",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",
				   confirmButtonText: "确定",
				   closeOnConfirm: true}, 
				function(){ 
				   $modalInstance.dismiss('cancel');
				});
		    	}else{
		    		$modalInstance.dismiss('cancel');
		    	}
		   };
	});
});