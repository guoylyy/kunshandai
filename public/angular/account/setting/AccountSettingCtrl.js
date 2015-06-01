define(['app'],function(app){
  return app.controller('AccountSettingCtrl',['$scope','profile','AccountService','SweetAlert','UploadService','$state',
    function($scope,profile,AccountService,SweetAlert,UploadService,$state){

    $scope.user = {};
    $scope.user.avatar  = profile.icon || {url:'/images/avatar.jpeg'};
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

    $scope.updatePassword = function(){
      AccountService.updatePassword($scope.user.password,$scope.user.newPassword)
      .then(function(res){
        $scope.succ = "更新成功";
        $scope.err = "";
      },function(res){
        $scope.err = "更新失败";
        $scope.succ  = "";

      })
    }

    $scope.updateAvatar = function(){
      AccountService.updateAvatar($scope.user.avatar.id)
      .then(function(res){
        SweetAlert.success("更新成功");
        $state.reload();
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
