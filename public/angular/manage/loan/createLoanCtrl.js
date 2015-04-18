'use strict';

define(['app',"underscore"],function(app,_) {

	return app.controller('CreateLoanCtrl', 
		["$scope","$rootScope","$location","$q","LoanService","ContactService",'DictService','$state',
		'loanTypes','repayTypes','steps','$modal',
		function($scope,$rootScope,$location,$q,LoanService,ContactService,DictService,$state,loanTypes,repayTypes,steps,$modal){
		

		$scope.loanTypes = (typeof loanTypes !== 'undefined' )? loanTypes.data : {};
		$scope.repayTypes = (typeof repayTypes !== 'undefined' )? repayTypes.data : {};

		$rootScope.stepActive = steps;

		$scope.nav = function(direction){
			if(direction === 'prev'){
				$state.go('createLoan');
			}else if(direction === 'next'){
				$state.go('createLoanContact');
			}
			
		};
		$scope.createContract = function(){
			
			var loaner = ContactService.getLoaner(),
				assurer =ContactService.getAssurer(),
				loan = LoanService.getLocal();

			$q.all([ContactService.create(loaner), ContactService.create(assurer),
				LoanService.create(loan)])

			.then(function(results){
				
				var contract = {};
				contract.loanerId 	= results[0].objectId;				
				contract.assurerId 	= results[1].objectId;
				contract.loanId 	= results[2].objectId;

				console.log(results[0], results[1], results[2]);

				return LoanService.generate(contract);
			
			}).then(function(){
				
				$state.go('contractCreated');
				
			}).catch(function(){
				
				alert("生成合同失败");
			})
		};

		

		$scope.open = function($event,opened) {
		    
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.calendar[opened] = true;
		};

		var uploadFile = function(contact){
			var modalInstance = $modal.open({
				templateUrl: '/angular/manage/common/upload/uploadModal.html',
				controller:'UploadController',
				size:'lg',
				resolve:{
					contact:function(){
						return contact;
					}
				}
			});
		}

		
		$scope.uploadBrAttachment = function(){
			uploadFile("借款人");
		}


		$scope.calendar={};
		
		$scope.format = 'yyyy-MM-dd';

		$scope.br = ContactService.getLoaner();
		
		$scope.gr = ContactService.getAssurer();
		
		$scope.loanInfo = LoanService.getLocal();

		
	}]);
});