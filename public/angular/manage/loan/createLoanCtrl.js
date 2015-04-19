'use strict';

define(['app',"underscore"],function(app,_) {

	return app.controller('CreateLoanCtrl', 
		["$scope","$rootScope","$location","$q","LoanService","ContactService",'DictService','$state',
		'loanTypes','repayTypes','steps','$modal','SweetAlert',
		function($scope,$rootScope,$location,$q,LoanService,ContactService,DictService,$state,loanTypes,repayTypes,steps,$modal,SweetAlert){
		

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
				assurer = ContactService.getAssurer(),
				loan = LoanService.getLocal();
			var rcLoaner = _.extend({},loaner),
				rcASssurer = _.extend({},assurer),
				rcLoan = _.extend({},rcLoan);

			$q.all([ContactService.create(loaner), ContactService.create(assurer),
				LoanService.create(loan)])

			.then(function(results){
				
				var contract = {};
				contract.loanerId 	= results[0].objectId;				
				contract.assurerId 	= results[1].objectId;
				// contract.loanId 	= results[2].objectId;
				contract.loanId 	= results[2].id;

				console.log(results[0], results[1], results[2]);

				return LoanService.generate(contract);
			
			}).then(function(){
				
				$state.go('contractCreated');
				
			}).catch(function(){
			
				$scope.br.attachments = rcLoaner.attachments;
				$scope.gr.attachments = rcASssurer.attachments;
				SweetAlert.error("新建放款失败", "服务器出了点小差", "error");
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

		$scope.removeAttach = function(contact,index){
			if(contact === 'br'){
				// var index = _.findIndex($scope.br.attachments,index);
				delete($scope.br.attachments[index]);
				$scope.br.attachments = _.compact($scope.br.attachments);
			}else if(contact === 'gr'){
				// var index = _.findIndex($scope.gr.attachments,index);
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