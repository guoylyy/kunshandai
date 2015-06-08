define(['app'],function(app) {
  return app.controller('BProjectController', ['$scope','loanTypes','timeRanges',
    function($scope,loanTypes,timeRanges) {

      $scope.loanTypes = loanTypes;
      $scope.timeRanges = timeRanges;

  } ])

} )
