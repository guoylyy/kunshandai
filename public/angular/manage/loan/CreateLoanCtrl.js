'use strict';

define(['app',"underscore"],function(app,_) {

	return app.controller('CreateLoanCtrl', 
		["$scope","$rootScope","$location","$q","LoanService","ContactService",'DictService','$state',
		'loanTypes','repayTypes','steps','$modal','SweetAlert','PwanService',
		function($scope,$rootScope,$location,$q,LoanService,ContactService,DictService,$state,loanTypes,
			repayTypes,steps,$modal,SweetAlert,PwanService){
		

		$scope.loanTypes = (typeof loanTypes !== 'undefined' )? loanTypes : {};
		$scope.repayTypes = (typeof repayTypes !== 'undefined' )? repayTypes : {};

		$rootScope.stepActive = steps;

		$scope.nav = function(direction){
			if(direction === 'prev'){
				$state.go('createLoan');
			}else if(direction === 'next'){
				$state.go('createLoanContact');
			}
			
		}

		$scope.selected = {};
		
		$scope.$watch('br.hasGr',function(newValue){
			console.log(newValue);
		})

		$scope.$watch('loanInfo.payWay',function(){
			circleChange();
			dateChange();
		})

		$scope.$watch('loanInfo.spanMonth',function(){
			circleChange();
			dateChange();
		})
		
		$scope.$watch('loanInfo.startDate',function(){
			dateChange();
			payTotalCircleChange();
		})

		$scope.$watch('loanInfo.firstPayDate',function(){
			payTotalCircleChange();
		})

		$scope.$watch('loanInfo.payCircle',function(){
			payTotalCircleChange();
		})

		$scope.afterStartDate = function(value){
			return new Date(value) > new Date($scope.startDate);
		}

		var payTotalCircleChange = function(){
			// if($scope.loanInfo.payCircle && $scope.loanInfo.endDate && $scope.loanInfo.firstPayDate){
				
			// 	var endDate =  new Date($scope.loanInfo.endDate);
			// 	var firstPayDate = new Date($scope.loanInfo.firstPayDate);
				
			// 	var years = endDate.getFullYear() - firstPayDate.getFullYear();
			// 	var Months = endDate.getMonth() - firstPayDate.getMonth();

			// 	$scope.loanInfo.payTotalCircle = parseInt( (years * 12 + Months)/ $scope.loanInfo.payCircle) + 1;
			// }
		}

		var circleChange = function(){
			if($scope.loanInfo.spanMonth){
				if($scope.loanInfo.payWay === 'xxhb' || $scope.loanInfo.payWay === 'dqhbfx'){
					$scope.loanInfo.payCircle = $scope.loanInfo.spanMonth;
					$scope.loanInfo.payTotalCircle = 1;
				}
			}

		}
		
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
		}

		$scope.createContract = function(){
			
			var loaner = ContactService.getLoaner(),
				assurer = ContactService.getAssurer(),
				loan = LoanService.getLocal();
			

			$q.all([ContactService.create(loaner), ContactService.create(assurer),
				LoanService.create(loan),PwanService.create($scope.pwan,$scope.loanInfo.attachments)])

			.then(function(results){
				
				var contract = {};
				loaner.objectId 	= contract.loanerId 	= results[0].objectId;	
				assurer.objectId 	= contract.assurerId 	= results[1].objectId;
				loan.objectId 		= contract.loanId 		= results[2].id;
									  loan.serialNumber		= results[2].serialNumber;
									  contract.loanPawnId	= results[3].objectId;

				// console.log(results[0], results[1], results[2],results[3]);

				return LoanService.generate(contract);
			
			}).then(function(){
						
				$state.go('contractCreated');

				
			}).catch(function(){
			
				SweetAlert.error("新建放款失败", "服务器开了点小差", "error");
			})
		}

		$scope.open = function($event,opened) {
		    
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.calendar[opened] = true;
		}

		$scope.uploadAttachment = function(type){
			var modalInstance = $modal.open({
				templateUrl: '/angular/manage/common/upload/uploadModal.html',
				controller:'UploadController',
				size:'lg',
				resolve:{
					type:function(){
						return type;
					}
				}
			});
			modalInstance.result.then(function (fileList) {
		      	if(type === '借款人'){
					$scope.br.attachments = _.union($scope.br.attachments,fileList);
				}else if(type == '担保人'){
					$scope.gr.attachments = _.union($scope.gr.attachments,fileList);
				}else if(type === '抵押物'){
					$scope.loanInfo.attachments = _.union($scope.loanInfo.attachments,fileList);
				}

		    }, function () {
		      
		      // $log.info('Modal dismissed at: ' + new Date());
		    
		    });
		}

		$scope.selectContact = function(){
			
		}

		$scope.removeAttach = function(type,index){
			if(type === 'br'){
				delete($scope.br.attachments[index]);
				$scope.br.attachments = _.compact($scope.br.attachments);
			}else if(type === 'gr'){
				delete($scope.gr.attachments[index]);
				$scope.gr.attachments = _.compact($scope.gr.attachments);
			}else if(type === 'loan'){
				delete($scope.loanInfo.attachments[index]);
				$scope.loanInfo.attachments = _.compact($scope.loanInfo.attachments);
			}
			
		}

		
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
					LoanService.getPaybacks($scope.loanInfo.objectId).then(function(paybacks){
						$scope.loanInfo.paybacks  = paybacks;
						SweetAlert.success("放款完成");
					},function(){
						SweetAlert.success("获取还款信息失败");
					})	
				}

			},function(){

			})

		}

		$scope.calendar={};
		
		$scope.format = 'yyyy-MM-dd';

		$scope.template = {
		
			houseUrl	: '/angular/manage/loan/pwan/house_pwan.html',
			carUrl		: '/angular/manage/loan/pwan/car_pwan.html',
			grUrl		:'/angular/manage/contact/grInfo.html'
		}

		$scope.br = ContactService.getLoaner();
		
		$scope.gr = ContactService.getAssurer();
		
		$scope.loanInfo = LoanService.getLocal();

		$scope.pwan = PwanService.getLocal($scope.loanInfo.loanType);

		$scope.pwanInfos = _.pairs($scope.pwan);

	}]);
});