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

		$scope.uploadAttachment = function(contact){
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
			modalInstance.result.then(function (fileList) {
		      	if(contact === '借款人'){
					$scope.br.attachments = _.union($scope.br.attachments,fileList);
				}else if(contact == '担保人'){
					$scope.gr.attachments = _.union($scope.gr.attachments,fileList);
				}

		    }, function () {
		      
		      $log.info('Modal dismissed at: ' + new Date());
		    
		    });
		};

		$scope.removeAttach = function(contact,hashKey){
			if(contact === 'br'){
				var index = _.findIndex($scope.br.attachments,hashKey);
				delete($scope.br.attachments[index]);
				$scope.br.attachments = _.compact($scope.br.attachments);
			}else if(contact === 'gr'){
				var index = _.findIndex($scope.gr.attachments,hashKey);
				delete($scope.gr.attachments[index]);
				$scope.br.attachments = _.compact($scope.gr.attachments);
			}
			
		};

		$scope.calendar={};
		
		$scope.format = 'yyyy-MM-dd';

		$scope.br = ContactService.getLoaner();
		
		$scope.gr = ContactService.getAssurer();
		
		$scope.loanInfo = LoanService.getLocal();

		
	}]);
});