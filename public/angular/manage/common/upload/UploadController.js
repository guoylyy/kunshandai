define(['app','underscore'],function(app,_){
	return app.controller('UploadController', ['$scope','$modalInstance','UploadService', 
		function($scope,$modalInstance,UploadService,contact){
		
		$scope.contact = contact;

		$scope.finish= function () {
			_.each($scope.fileList,function(file,index){
				if(file.error){
					delete $scope.fileList[index];
				}
			})
			$scope.fileList = _.compact($scope.fileList);
    		$modalInstance.close($scope.fileList);
  		};	

  		$scope.attachmentType = 'certification';

		$scope.fileList = [];

		$scope.$watch('files', function () {
			if($scope.files && $scope.files.length){
				_.each($scope.files,function(file){
					file.attachmentType = $scope.attachmentType;

				})	
				$scope.fileList = _.union($scope.fileList,$scope.files);
				UploadService.upload($scope.files);
			}
		  
		});

		$scope.attchTypes = UploadService.getAttachmentTypes();

		$scope.fileStatus = UploadService.getFileStatus();
	}]);
});