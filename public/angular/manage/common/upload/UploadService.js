define(['app'],function(app){
	return app.service('UploadService', ['ApiURL','$upload',
		function(ApiURL,$upload){
		
		var fileStatus = {};

		return {
			getFileStatus:function(){
				return fileStatus;
			},
			upload:function(files){
				if (files && files.length) {
		            for (var i = 0; i < files.length; i++) {
		                var file = files[i];
		                $upload.upload({
		                    url: ApiURL+'/attachment',
		                    // fields: {'username': $scope.username},
		                    file: file
		                }).progress(function (evt) {
		                    if(!fileStatus[evt.config.file.$$hashKey]){
		                    	fileStatus[evt.config.file.$$hashKey] = {};
		                    } 
		                    fileStatus[evt.config.file.$$hashKey].percent = parseInt(100.0 * evt.loaded / evt.total);
		                    console.log('progress: ' + fileStatus[evt.config.file.$$hashKey].percent + '% ' + evt.config.file.name);
		                }).success(function (data, status, headers, config) {
		                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
		                }).error(function(data, status, headers, config){
		                	console.log('file ' + config.file.name + 'upload fail. Response: ' + data);
		                	
		                	if(!fileStatus[config.file.$$hashKey]){
		                		fileStatus[config.file.$$hashKey] = {};
		                	}
		                	fileStatus[config.file.$$hashKey].error = true;
		                });
		            }
		        }
			}
		}

	}]);
});