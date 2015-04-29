'use strict';

define(['app',"underscore"],function(app,_) {

	return app.controller('CreateLoanCtrl', 
		["$scope","$rootScope","$location","$q","LoanService","ContactService",'DictService','$state',
		'loanTypes','repayTypes','steps','$modal','SweetAlert',
		function($scope,$rootScope,$location,$q,LoanService,ContactService,DictService,$state,loanTypes,repayTypes,steps,$modal,SweetAlert){
		

		$scope.loanTypes = (typeof loanTypes !== 'undefined' )? loanTypes : {};
		$scope.repayTypes = (typeof repayTypes !== 'undefined' )? repayTypes : {};

		$rootScope.stepActive = steps;

		$scope.nav = function(direction){
			if(direction === 'prev'){
				$state.go('createLoan');
			}else if(direction === 'next'){
				$state.go('createLoanContact');
			}
			
		};
		
		$scope.$watch('loanInfo.payWay',function(){
			circleChange();
			dateChange();
		});

		$scope.$watch('loanInfo.spanMonth',function(){
			circleChange();
			dateChange();
		});
		
		$scope.$watch('loanInfo.startDate',function(){
			dateChange();
			payTotalCircleChange();
		});

		$scope.$watch('loanInfo.firstPayDate',function(){
			payTotalCircleChange();
		});

		$scope.$watch('loanInfo.payCircle',function(){
			payTotalCircleChange();
		});

		$scope.afterStartDate = function(value){
			return new Date(value) > new Date($scope.startDate);
		}

		var payTotalCircleChange = function(){
			if($scope.loanInfo.payCircle && $scope.loanInfo.endDate && $scope.loanInfo.firstPayDate){
				var endDate =  new Date($scope.loanInfo.endDate);
				var firstPayDate = new Date($scope.loanInfo.firstPayDate);
				var years = endDate.getFullYear() - firstPayDate.getFullYear();
				var Months = endDate.getMonth() - firstPayDate.getMonth();
				$scope.loanInfo.payTotalCircle = parseInt( (years * 12 + Months)/ $scope.loanInfo.payCircle);
			}
		}

		var circleChange = function(){
			if($scope.loanInfo.spanMonth && $scope.loanInfo.startDate && $scope.loanInfo.firstPayDate ){
				if($scope.loanInfo.payWay === 'xxhb' || $scope.loanInfo.payWay === 'dqhbfx'){
					$scope.loanInfo.payCircle = $scope.loanInfo.spanMonth;
					$scope.loanInfo.payTotalCircle = 1;
				}
			}

		};
		var dateChange = function(){
			if(!$scope.loanInfo.startDate || !$scope.loanInfo.spanMonth){
				return;
			}
			var date = new Date($scope.loanInfo.startDate);
			date.setMonth(date.getMonth()+ parseInt($scope.loanInfo.spanMonth));	
			$scope.loanInfo.endDate = date;
			if($scope.loanInfo.payWay === 'xxhb' || $scope.loanInfo.payWay === 'dqhbfx'){
				$scope.loanInfo.firstPayDate = $scope.loanInfo.endDate ;
			}else{
				$scope.loanInfo.firstPayDate = $scope.loanInfo.startDate;
			}
		};

		$scope.createContract = function(){
			
			var loaner = ContactService.getLoaner(),
				assurer = ContactService.getAssurer(),
				loan = LoanService.getLocal();

			$q.all([ContactService.create(loaner), ContactService.create(assurer),
				LoanService.create(loan)])

			.then(function(results){
				
				var contract = {};
				loaner.objectId 	= contract.loanerId 	= results[0].objectId;				
				assurer.objectId 	= contract.assurerId 	= results[1].objectId;
				loan.objectId 		= contract.loanId 		= results[2].id;

				console.log(results[0], results[1], results[2]);

				return LoanService.generate(contract);
			
			}).then(function(){
						
				$state.go('contractCreated');

				
			}).catch(function(){
			
				SweetAlert.error("新建放款失败", "服务器开了点小差", "error");
			})
		};

		$scope.payBackPlans;

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

		$scope.selectContact = function(){
			
		}

		$scope.removeAttach = function(contact,index){
			if(contact === 'br'){
				delete($scope.br.attachments[index]);
				$scope.br.attachments = _.compact($scope.br.attachments);
			}else if(contact === 'gr'){
				delete($scope.gr.attachments[index]);
				$scope.br.attachments = _.compact($scope.gr.attachments);
			}
			
		};

		
		$scope.activeLoan = function(){
			
			var  activeModal = $modal.open({
				templateUrl: '/angular/manage/common/active/activeLoanModal.html',
				controller:'ActiveLoanCtrl',
				size:'lg',
				resolve:{
					payment:function(){
						return LoanService.getPayments($scope.loanInfo.objectId);
						
					},
					loanId:function(){
						 return $scope.loanInfo.objectId;
					}
				}
			});

			activeModal.result.then(function(actived){

				$scope.loanInfo.actived = actived;

				if(actived){
					$scope.loanInfo.paybacks = LoanService.paybacks(loanId);	
				}

			},function(){

			})


		}

		$scope.calendar={};
		
		$scope.format = 'yyyy-MM-dd';

		$scope.br = ContactService.getLoaner();
		
		$scope.gr = ContactService.getAssurer();
		
		$scope.loanInfo = LoanService.getLocal();
		
	}]);
});