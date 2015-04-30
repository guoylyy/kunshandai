define(['app','underscore'],function(app,_){
	return app.controller('ContractController', function($scope,loan,paybacks,payments,pwan,attachments){
		
		$scope.loanInfo 			= _.extend({actived:(loan.status.value != 0)},loan);
		
		$scope.loanInfo.paybacks 	= paybacks;

		$scope.loanInfo.payments 	= payments;

		$scope.pwanInfo				= pwan;

		$scope.br = {
			name:loan.loaner.name,
			attachments:attachments.br,
		}

		$scope.gr = {
			name:loan.assurer.name,
			attachments:attachments.gr,
		}

	})
})