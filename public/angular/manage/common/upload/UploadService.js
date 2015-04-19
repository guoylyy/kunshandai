define(['app'],function(app){
	return app.service('UploadService', ['ApiURL','$upload',
		function(ApiURL,$upload){
		
		var fileStatus = {};

		var attachmentTypes = [
			{value:'inspection',text:"现场考察"},
			{value:'certification',text:"证件"},
			{value:'credit',text:"信用"},
			{value:'agreement',text:"协议"},
			{value:'receipt',text:"协议"},
			{value:'other',text:"其他"}
		];

		return {
			getAttachmentTypes:function(){
				return attachmentTypes;
			},
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
		                    file: file,
		                    fileFormDataName:'attachment',
		                }).progress(function (evt) {
		                    if(!fileStatus[evt.config.file.$$hashKey]){
		                    	fileStatus[evt.config.file.$$hashKey] = {};
		                    } 
		                    fileStatus[evt.config.file.$$hashKey].percent = parseInt(100.0 * evt.loaded / evt.total);
		                    console.log('progress: ' + fileStatus[evt.config.file.$$hashKey].percent + '% ' + evt.config.file.name);
		                }).success(function (data, status, headers, config) {
		                    file.objectId = data.data.id;
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