'use strict';

define(['app',"underscore"],function(app,_) {

	return app.controller('CreateLoanCtrl', 
		["$scope","$rootScope","$location","$q","LoanService","ContactService",'DictService','$state',
		'loanTypes','repayTypes','steps','$modal','SweetAlert','PawnService',
		function($scope,$rootScope,$location,$q,LoanService,ContactService,DictService,$state,loanTypes,
			repayTypes,steps,$modal,SweetAlert,PawnService){
		

		$scope.loanTypes = (typeof loanTypes !== 'undefined' )? loanTypes : {};
		$scope.repayTypes = (typeof repayTypes !== 'undefined' )? repayTypes : {};

		$rootScope.stepActive = steps;

		$scope.countResults = {};

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
		var loanInfofunction  = function(){
			return $scope.loanInfo;
		}

		$scope.count = function(){
			var loan = angular.copy($scope.loanInfo);
			loan.interests = loan.interests / 100;
			loan.overdueCostPercent = loan.overdueCostPercent / 1000;
			$scope.countResults = LoanService.getCountResult(loan);
		};


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
			dateChange();
		})

		$scope.afterStartDate = function(value){
			return new Date(value) > new Date($scope.startDate);
		}

		var payTotalCircleChange = function(){
			
			if($scope.loanInfo.payCircle && $scope.loanInfo.spanMonth){
				var ptc = $scope.loanInfo.spanMonth % $scope.loanInfo.payCircle;
				if(ptc === 0){
					$scope.loanInfo.payTotalCircle = parseInt( $scope.loanInfo.spanMonth / $scope.loanInfo.payCircle);
				}else{
					$scope.loanInfo.payTotalCircle = '';
				}
			}

		}

		var circleChange = function(){
			if($scope.loanInfo.spanMonth){
				if($scope.loanInfo.payWay === 'xxhb' || $scope.loanInfo.payWay === 'dqhbfx'){
					$scope.loanInfo.payCircle = $scope.loanInfo.spanMonth;
					$scope.loanInfo.payTotalCircle = 1;
				}
			}else{
				$scope.loanInfo.payCircle = '';
			}

		}
		
		var dateChange = function(){
			if(!$scope.loanInfo.startDate || !$scope.loanInfo.spanMonth){
				return;
			}
			var date = new Date($scope.loanInfo.startDate);
			date.setMonth(date.getMonth()+ parseInt($scope.loanInfo.spanMonth));
			date.setDate(date.getDate() - 1);	
			$scope.loanInfo.endDate = date;
			
			if($scope.loanInfo.payWay === 'xxhb' || $scope.loanInfo.payWay === 'dqhbfx'){
				$scope.loanInfo.firstPayDate = $scope.loanInfo.endDate ;
			}else if($scope.loanInfo.payWay === 'zqcxhb'){
				$scope.loanInfo.firstPayDate = $scope.loanInfo.startDate;
			}else{
				if($scope.loanInfo.startDate && $scope.loanInfo.payCircle){
					var firstPayDate = new Date($scope.loanInfo.startDate);
					firstPayDate.setMonth(firstPayDate.getMonth() + parseInt($scope.loanInfo.payCircle));
					firstPayDate.setDate(firstPayDate.getDate() - 1);
					$scope.loanInfo.firstPayDate = firstPayDate;
				}
			}
		}


		$scope.createContract = function(){
			
			var loaner = ContactService.getLoaner(),
				assurer = ContactService.getAssurer(),
				loan = LoanService.getLocal();

			$q.all([ContactService.create(loaner), ContactService.create(assurer),
				LoanService.create(loan),PawnService.create($scope.pawn,$scope.loanInfo.attachments)])

			.then(function(results){
				
				var contract = {};
				loaner.objectId 	= contract.loanerId 	= results[0].objectId;	
				assurer.objectId 	= contract.assurerId 	= results[1].objectId;
				loan.objectId 		= contract.loanId 		= results[2].id;
									  loan.serialNumber		= results[2].serialNumber;
									  contract.loanPawnId	= results[3].objectId;

				// console.log(results[0], results[1], results[2],results[3]);

				LoanService.generate(contract).then(function(rc){
					$scope.loanInfo['numberWithName'] = rc.data.data.loan.numberWithName;
				});
				
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
					payments:function(){
						return LoanService.getPayments($scope.loanInfo.objectId).then(function(data){
							$scope.loanInfo.payment = data;
							return data;
						})
					},
					loanId:function(){
						 return $scope.loanInfo.objectId;
					},
					numberWithName:function(){
						return $scope.loanInfo.numberWithName;
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
		
			houseUrl	: '/angular/manage/loan/pawn/house_pawn.html',
			carUrl		: '/angular/manage/loan/pawn/car_pawn.html',
			grUrl		:'/angular/manage/contact/grInfo.html'
		}

		$scope.br = ContactService.getLoaner();
		
		$scope.gr = ContactService.getAssurer();
		
		$scope.loanInfo = LoanService.getLocal();

		$scope.pawn = PawnService.getLocal($scope.loanInfo.loanType);

		$scope.pawnInfos = _.pairs($scope.pawn);

	}]);
});