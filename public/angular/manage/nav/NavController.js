define(['app'],function(app){
  return app.controller('NavController',['$scope','AccountService','user','profile',
         function($scope,AccountService,user,profile){

          $scope.user = user;

          $scope.user.profile = profile.infoObject;

          $scope.logout = function(){
            $scope.err = null;
            AccountService.logout().then(function(res){
                window.location = '/login';
              },
              function(err){
                $scope.err = err;
              }
            );
          };

  }])
})
