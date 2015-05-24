define(['app'],function(app){
  return app.controller('AccountSettingCtrl',['$scope','user','profile','AccountService','SweetAlert',
    function($scope,user,profile,AccountService,SweetAlert){

    $scope.user = user;

    $scope.user.profile = profile;

    $scope.updateProfile = function(){
      AccountService.updateProfile($scope.user.profile)
      .then(function(res){
        SweetAlert.success("更新成功");
      },function(res){
        SweetAlert.error("更新失败");
      })
    }
  }]);
})
