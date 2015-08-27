define(['app','underscore'],function(app,_){
	return app.controller('BContractController', function($scope,loan,paybacks,payments,attachments,BLoanService,PawnService,ContactService){
		
		$scope.loanInfo 			= _.extend(BLoanService.getLocal(),loan);
		
		$scope.loanInfo.actived		= (loan.status.value != 0);
		
		$scope.loanInfo.paybacks 	= paybacks;

		$scope.loanInfo.payments 	= payments;

		$scope.pawn = {};

		addBankInfo();

		function addBankInfo(){
			ContactService.get(loan.loaner.id).then(function(data){
				loan.loaner = data;
				$scope.br = _.extend({attachments:attachments.br},loan.loaner);
			});
		}

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

		

		// $scope.gr = _.extend({attachments:attachments.gr},loan.assurer)


	})
})