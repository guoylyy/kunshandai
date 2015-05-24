define(['app'],function(app){
  return app.controller('NavController',['$scope','AccountService','user',
         function($scope,AccountService,user){

          $scope.user = user;

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
