define(['app','underscore'],function(app,_){
	return app.service('UploadService', ['ApiURL','$upload','$q',
		function(ApiURL,$upload,$q){

		var fileStatus = {};

		var attachmentTypes = [
			{value:'inspection',text:"现场考察"},
			{value:'certification',text:"证件"},
			{value:'credit',text:"信用"},
			{value:'agreement',text:"协议"},
			{value:'receipt',text:"收据"},
			{value:'other',text:"其他"}
		];

		return {
			getAttachmentTypes:function(){
				return attachmentTypes;
			},
			getFileStatus:function(){
				return fileStatus;
			},
			upload:function(files,fileType){
				var deferred = $q.defer(),totalUploaded = 0;
				if (files && files.length) {
		            for (var i = 0; i < files.length; i++) {
		                var file = files[i];
		                var j  = i;
		                $upload.upload({
		                    url: ApiURL+'/attachment',
		                    fields: {'fileType': fileType},
		                    // sendObjectsAsJsonBlob: true,
		                    // data: {fileType: fileType},
		                    file: file,
		                    fileFormDataName:'attachment'
		                }).progress(function (evt) {
												var index;
												if(files.length > 1){
													index = _.findIndex(files,{'$$hashKey':evt.config.file.$$hashKey});
												}else{
													index = 0;
												}
												files[index].percent = parseInt(100.0 * evt.loaded / evt.total);

												console.log('progress: ' + files[index].percent + '% ' + evt.config.file.name)

		                }).success(function (data, status, headers, config) {

		                    var index;
												if(files.length > 1){
													index = _.findIndex(files,{'$$hashKey':config.file.$$hashKey});
												}else{
													index = 0;
												}
		                    files[index].objectId = data.data.id;
		                    files[index].url = data.data.url;
		                    files[index].newUpload = true;
												totalUploaded += 1;
												if(totalUploaded == files.length){
													deferred.resolve("all files uploaded");
												}
		                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);

		                }).error(function(data, status, headers, config){
												var index;
												if(files.length > 1){
													index = _.findIndex(files,{'$$hashKey':evt.config.file.$$hashKey});
												}else{
													index = 0;
												}

												files[index].error = true;
												console.log('file ' + config.file.name + 'upload fail. Response: ' + data);
												deferred.reject("upload file:"+config.file.name+"fail");
		                });
		            }
		     }
				return deferred.promise;
			}
		}

	}]);
});
