define(['app'],function(app){
  return app.controller('AccountSettingCtrl',['$scope','profile','AccountService','SweetAlert','UploadService','$state',
    function($scope,profile,AccountService,SweetAlert,UploadService,$state){

    $scope.user = {certificated:profile.isVerified};
    $scope.user.avatar  = profile.icon || {url:'/images/avatar.jpeg'};
    $scope.user.profile = profile.infoObject;
    $scope.certification = {
        front:{url:profile.icard_front? profile.icard_front.url : ''},
        back:{url:profile.icard_front? profile.icard_back.url : ''}
      };

    $scope.upload = {};
    $scope.upload.showWarning = ($scope.upload.type === 'danger' || $scope.upload.type === 'warning');

    $scope.$watchCollection('user.profile',function(){
      if(!profile.infoObject){
        $scope.profileCompleted =  false;
        return;
      }
      $scope.profileCompleted =  (_.compact(_.values($scope.user.profile)).length
                                  == _.values($scope.user.profile).length)
      if($scope.user.profile.manageType == 'company'){
        $scope.profileCompleted = $scope.profileCompleted &&(_.compact(_.values($scope.user.profile.company)).length
                                    == _.values($scope.user.profile.company).length)
        $scope.profileCompleted = $scope.profileCompleted && _.compact(_.values($scope.user.profile.manageRange)).length > 0;
      }
    })

    $scope.updateProfile = function(){
      AccountService.updateProfile($scope.user.profile)
      .then(function(res){
        SweetAlert.success("更新成功");
        $state.reload();
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

    $scope.attachSelected = function($files,type){
        if($files.length > 0){
          UploadService.upload($files,'certification')
          .then(function(){
            $scope.certification[type].url = $files[0].url;
            $scope.certification[type].id = $files[0].objectId;
          },function(){
            SweetAlert.error("上传失败","请稍后再试");
          })
        }
    }

    $scope.avatarSelected = function($files,$event){
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

    $scope.startCertificate = function(){
      if($scope.certification.front.url && $scope.certification.back.url){
        AccountService.verify($scope.certification['front'].id,$scope.certification['back'].id).then(function() {
          SweetAlert.success("已提交申请","认证需要1到2个工作日");
          $state.reload();
        }, function(res) {
          SweetAlert.error("申请认证失败","服务器内部错误");
        } )
      }else{
        SweetAlert.error("资料不全","请上传身份证正反面扫描件");
      }
    }
  }]);
})
