define(['app','underscore'],function(app,_){
	return app.controller('ContractController', function($scope,loan,paybacks,payments,attachments,PawnService){
		
		$scope.loanInfo 			= _.extend({actived:(loan.status.value != 0)},loan);
		
		$scope.loanInfo.paybacks 	= paybacks;

		$scope.loanInfo.payments 	= payments;

		$scope.pawn = {};


		$scope.$watch("loanInfo",function(){
			if($scope.loanInfo && $scope.loanInfo.pawn){
				PawnService.getPawn($scope.loanInfo.pawn.objectId).then(function(data){
					$scope.pawn.attachments	= data;
				})

				PawnService.getPawnInfo($scope.loanInfo.pawn.objectId).then(function(data){
					$scope.pawnInfos = _.unzip(_.pairs(data))[1];
				})
			}
		});

		$scope.br = _.extend({attachments:attachments.br},loan.loaner)

		$scope.gr = _.extend({attachments:attachments.gr},loan.assurer)

	})
})