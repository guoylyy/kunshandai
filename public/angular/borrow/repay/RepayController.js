define(['app'],function(app){
  return app.controller('RepayController',['$scope','loanTypes','timeRanges',
    function($scope,loanTypes,timeRanges) {

      $scope.loanTypes = loanTypes;
      $scope.timeRanges = timeRanges;
  }])
})
