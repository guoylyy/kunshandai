define(['app'],function(app){
  return app.controller('AccountSettingCtrl',['$scope','profile','AccountService','SweetAlert','UploadService',
    function($scope,profile,AccountService,SweetAlert,UploadService){

    $scope.user = {};
    $scope.user.avatar  = profile.icon;
    $scope.user.profile = profile.infoObject;

    $scope.upload = {};
    $scope.upload.showWarning = ($scope.upload.type === 'danger' || $scope.upload.type === 'warning');

    $scope.updateProfile = function(){
      AccountService.updateProfile($scope.user.profile)
      .then(function(res){
        SweetAlert.success("更新成功");
      },function(res){
        SweetAlert.error("更新失败");
      })
    }

    $scope.updateAvatar = function(){
      AccountService.updateAvatar($scope.user.avatar.id)
      .then(function(res){
        SweetAlert.success("更新成功");
      },function(res){
        SweetAlert.error("更新失败");
      })
    }

    $scope.fileDropped = function($files,$event){
      if($files.length > 0){
        $scope.upload.uploading =  true;
        $scope.upload.type      = 'info';
        UploadService.upload($files,'other')
        .then(function(){
          $scope.upload.type = 'success';
          $scope.user.avatar.url = $files[0].url;
          $scope.user.avatar.id  = $files[0].objectId;
        },function(){
          $scope.upload.type = 'danger';
        });
      }
    }
  }]);
})
