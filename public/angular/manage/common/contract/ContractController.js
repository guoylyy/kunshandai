define(['app','underscore'],function(app,_){
	return app.controller('ContractController', function($scope,loan,paybacks,payments,pwan,attachments){
		
		$scope.loanInfo 			= _.extend({actived:(loan.status.value != 0)},loan);
		
		$scope.loanInfo.paybacks 	= paybacks;

		$scope.loanInfo.payments 	= payments;

		$scope.pwanInfo				= pwan;

		$scope.br = _.extend({attachments:attachments.br},loan.loaner)

		$scope.gr = _.extend({attachments:attachments.gr},loan.assurer)

	})
})