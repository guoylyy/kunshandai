'use strict';

define(['app',"underscore"],function(app,_) {

	return app.controller('CreateLoanCtrl', 
		["$scope","$rootScope","$location","$q","LoanService","ContactService",'DictService','$state',
		'loanTypes','repayTypes','$modal','SweetAlert','PawnService',
		function($scope,$rootScope,$location,$q,LoanService,ContactService,DictService,$state,loanTypes,
			repayTypes,$modal,SweetAlert,PawnService){
		//下拉选择类型
		$scope.repayTypes = repayTypes;
		$scope.loanTypes = loanTypes;
		//还款计算
		$scope.countResults = {};
		//日历相关
		$scope.calendar		= {};
		$scope.format 	= 'yyyy-MM-dd';

		$scope.template = {
			houseUrl	: '/angular/manage/loan/pawn/house_pawn.html',
			carUrl		: '/angular/manage/loan/pawn/car_pawn.html',
			grUrl		:'/angular/manage/contact/grInfo.html'
		}

		//借款人
		$scope.br 		= ContactService.getLoaner();
		//担保人
		$scope.gr 		= ContactService.getAssurer();
		//放款项目
		$scope.loanInfo = LoanService.getLocal();

		//抵押物包括附件
		$scope.pawn 		= PawnService.getLocal($scope.loanInfo.loanType);
		//用于项目详情抵押物信息显示
		$scope.pawnInfos 	= _.unzip(_.pairs($scope.pawn))[1];
		// 状态记录
		$scope.status	= {};

		$scope.selected = {};

		$scope.unique 	= {br:true,gr:true};

		$scope.checkContactUnique = function(name){
			
			var id = $scope[name].certificateNum;
			
			if(!id){
				$scope.unique[name] = true;
				return;
			}
			
			if($scope[name] && $scope.selected[name] && $scope[name].certificateNum === $scope.selected[name].certificateNum){
				$scope.unique[name] = true;
				return;
			}
		
			ContactService.getByCertification(id).then(function(data){
				$scope.unique[name] = false;
			},function(){
				$scope.unique[name] = true;
			})
		}

		$scope.resetContact = function(name){
			if(name === 'br'){
				$scope.br = _.extend($scope.br,ContactService.getModel());
			}else if(name === 'gr'){
				$scope.gr = _.extend($scope.gr,ContactService.getModel());
			}
			$scope.selected = {};
		}

		$scope.nav = function(direction){
			if(direction === 'prev'){
				$state.go('createLoan');
			}else if(direction === 'next'){
				$state.go('createLoanContact');
			}
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

		$scope.$watch('selected.br',function(){
			if(typeof $scope.selected.br === 'object'){
				$scope.br = _.extend($scope.br,$scope.selected.br);
				ContactService.getAttachments($scope.br.objectId).then(function(data){
					$scope.br.attachments = data;
				});
			}
		})
		$scope.$watch('selected.gr',function(){
			if(typeof $scope.selected.gr === 'object'){
				$scope.gr = _.extend($scope.gr,$scope.selected.gr);
				ContactService.getAttachments($scope.gr.objectId).then(function(data){
					$scope.gr.attachments = data;
				});
			}
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

		//生成合同
		$scope.createContract = function(){
			
			$scope.status.loanCreating = true;
			
			var contract 		= {};

			
			LoanService.create($scope.loanInfo)
			.then(function(data){

				contract.loanId 	= data.id;
			
			//新建借款人客户或更新客户
			}).then(function(){
				var loanDeferred = $q.defer();
				//更新
				if($scope.br.objectId){
					ContactService.update($scope.br).then(function(data){
						$scope.br 			= _.extend($scope.br,_.omit(data,'attachments'));
						contract.loanerId 	= data.objectId;
						loanDeferred.resolve("updated loaner");
					})

				}else{

					ContactService.create($scope.br).then(function(data){
						$scope.br 			= _.extend($scope.br,_.omit(data,'attachments'));
						contract.loanerId 	= data.objectId;
						loanDeferred.resolve("created loaner");
					})
				}

				return loanDeferred.promise;

			}).then(function(){
				
				if($scope.br.hasGr){
					
					var grDeferred = $q.defer();
					
					if($scope.gr.objectId){
						ContactService.update($scope.gr).then(function(data){
							$scope.gr 			= _.extend($scope.gr,_.omit(data,'attachments'));
							contract.assurerId 	= data.objectId;
							grDeferred.resolve();
						},function(){
							grDeferred.reject("创建担保人失败");
						})
					}else{
						ContactService.create($scope.gr).then(function(data){
							$scope.gr 			= _.extend($scope.gr,_.omit(data,'attachments'));
							contract.assurerId 	= data.objectId;
							grDeferred.resolve();
						},function(){
							grDeferred.reject("创建担保人失败");
						})
					}
					return grDeferred.promise;
				}else{
					
					contract.assurerId = null;
					return;
				}
			}).then(function(){

				if($scope.loanInfo.loanType === 'fcdy' 
					|| $scope.loanInfo.loanType === 'mfdy' 
					|| $scope.loanInfo.loanType === 'qcdy' 
					|| $scope.loanInfo.loanType === 'mcdy'){
					
					var pawnDeferred = $q.defer();
					PawnService.create($scope.pawn).then(function(pawnData){
						contract.loanPawnId	= pawnData.objectId;
						$scope.pawn = _.extend($scope.pawn,pawnData.data);
						pawnDeferred.resolve();
					})
					return pawnDeferred.promise
				}else{
					contract.loanPawnId = null;
					return;
				}
			}).then(function(){
				var createLoanDeferred = $q.defer();
				// 生成合同
				LoanService.generate(contract).then(function(data){
					$scope.loanInfo = _.extend($scope.loanInfo,data.loan);
					createLoanDeferred.resolve();
				},function(){
					createLoanDeferred.reject();
				});
				return createLoanDeferred.promise;
			}).then(function(){
				$state.go('contractCreated');
			}).catch(function(){
				$scope.status.loanCreating = false;
				SweetAlert.error("新建放款失败", "服务器开了点小差", "error");
			})
		}
		//控制几个日历开关状态
		$scope.open = function($event,opened) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.calendar[opened] = true;
		}
		//上传附件
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
					$scope.br.attachments 	= _.union($scope.br.attachments,fileList);
				}else if(type === '担保人'){
					$scope.gr.attachments 	= _.union($scope.gr.attachments,fileList);
				}else if(type === '抵押物'){
					$scope.pawn.attachments = _.union($scope.pawn.attachments,fileList);
				}

		    }, function () {
		    	
		    });
		}

		//删除附件
		$scope.removeAttach = function(type,index){
			SweetAlert.swal({
	          title: '确定删除该附件?',
	          text: '删除后将不可恢复',
	          type: 'warning',
	          confirmButtonColor: '#DD6B55',
	          showCancelButton: true
	        }, function() {
	          	if(type === 'br'){
					if($scope.br.objectId){
						ContactService.deleteAttachment($scope.br.objectId,$scope.br.attachments[index].objectId);
					}
					delete($scope.br.attachments[index]);
					$scope.br.attachments = _.compact($scope.br.attachments);
				}else if(type === 'gr'){
					if($scope.gr.objectId){
						ContactService.deleteAttachment($scope.gr.objectId,$scope.gr.attachments[index].objectId);
					}
					delete($scope.gr.attachments[index]);
					$scope.gr.attachments = _.compact($scope.gr.attachments);
				}else if(type === 'pawn'){
					delete($scope.pawn.attachments[index]);
					$scope.pawn.attachments = _.compact($scope.pawn.attachments);
				}
	        });
			
			
		}

		//放款
		$scope.activeLoan = function(){
			
			var activeModal = $modal.open({
				templateUrl: '/angular/manage/common/active/activeLoanModal.html',
				controller:'ActiveLoanCtrl',
				size:'lg',
				resolve:{
					payments:function(){
						return LoanService.getPayments($scope.loanInfo.objectId).then(function(data){
							$scope.loanInfo.payments = data;
							return data;
						})
					},
					loan:function(){
						return $scope.loanInfo;
					}
				}
			});

			activeModal.result.then(function(actived){
				$scope.loanInfo.actived = actived;
				
				if(actived){
					LoanService.getPaybacks($scope.loanInfo.objectId).then(function(paybacks){
						$scope.loanInfo.paybacks = paybacks;
						SweetAlert.success("放款完成");
					},function(){
						SweetAlert.success("获取还款信息失败");
					})	
				}

			},function(){

			})

		}

		$scope.searchContacts = function(type,key){
			return ContactService.search(type,key).then(function(data){
				return data;
			})
		}
	}]);
});