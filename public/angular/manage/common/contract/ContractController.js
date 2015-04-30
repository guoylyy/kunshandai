define(['app','underscore'],function(app,_){
	return app.controller('ContractController', function($scope,loan,paybacks,payments,attachments,PawnService){
		
		$scope.loanInfo 			= _.extend({actived:(loan.status.value != 0)},loan);
		
		$scope.loanInfo.paybacks 	= paybacks;

		$scope.loanInfo.payments 	= payments;


		$scope.$watch("loanInfo",function(){
			if($scope.loanInfo){
				PawnService.getPawn($scope.loanInfo.pawn.objectId).then(function(data){
					$scope.loanInfo.attachments	= data;
				})

				PawnService.getPawnInfo($scope.loanInfo.pawn.objectId).then(function(data){
					$scope.pawnInfos = _.pairs(data);
				})
			}
		});

		$scope.br = _.extend({attachments:attachments.br},loan.loaner)

		$scope.gr = _.extend({attachments:attachments.gr},loan.assurer)

	})
})