define(['app','underscore'],function(app,_){
	return app.controller('UploadController', ['$scope','$modalInstance','UploadService', 
		function($scope,$modalInstance,UploadService){
		
		$scope.finished= function () {
    		$modalInstance.close($scope.uploadedFiles);
  		};	


		// $scope.fileDropped = function(file,drop){
			
			
		// 	UploadService.upload(file);
		// }
		$scope.fileList = [];

		$scope.$watch('files', function () {
			if($scope.files && $scope.files.length){
				// $scope.fileList.push($scope.files);	
				$scope.fileList = _.union($scope.fileList,$scope.files);
			}
		    UploadService.upload($scope.files);
		});
		$scope.fileTypes = [
			{value:'inspection',text:"现场考察"},
			{value:'certification',text:"证件"},
			{value:'credit',text:"信用"},
			{value:'agreement',text:"协议"},
			{value:'receipt',text:"协议"},
			{value:'other',text:"其他"}
		]

		$scope.fileStatus = UploadService.getFileStatus();
	}]);
});