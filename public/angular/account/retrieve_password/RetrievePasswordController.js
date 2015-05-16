'use strict';

define(['app','underscore'],function(app,_) {

  return app.controller('RetrievePasswordController', ["$scope","$interval","$location","AccountService",
      'SweetAlert',
      function($scope,$interval,$location,AccountService,SweetAlert){
        $scope.account = {
          mobilePhoneNumber:'',
          password:''
        };
        
        $scope.isCodeSending = false;
        $scope.cutdown = 60;
        $scope.isSignuping = false;


        $scope.sendVerifyCode = function() {
          
          $scope.err = null;
          if($scope.account.mobilePhoneNumber.length ==0){
            $scope.err = "请输入正确的手机号";
            return false;
          }
          AccountService.requestResetPasswordBySmsCode(_.omit($scope.account,'password'))
          .then(function(res){
            //验证码60s倒计时
            $scope.isCodeSending  = true;
            $interval(function(){
              $scope.cutdown--;
              if($scope.cutdown === 0){
                //$scope.isCodeSending  = false;
                $scope.cutdown = 60;
              }
            },1000,60);
          },function(err){
            $scope.err = err;
          });
        };

        $scope.resetPasswordBySmsCode = function(){
          $scope.isSignuping = true;
          AccountService.resetPasswordBySmsCode({code:$scope.code, password:$scope.account.password})
          .then(function(data){
            SweetAlert.swal({
               title: "重置密码成功",
               text: "赶快用新的密码登录吧!",
               type: "success",
               confirmButtonText: "好，现在就去",
          }, function(){ 
               window.location = '/login';
            });
            
          },function(err){
            $scope.err = err;
            $scope.isSignuping = false;
          });
        };
       
  }]);
});