define(['app'],function(app){
	return app.service('LoanHelper', ['$state','$stateParams','$q','BLoanService','ContactService','PawnService','DictService','SweetAlert','$modal',
		function($state,$stateParams,$q,BLoanService,ContactService,PawnService,DictService,SweetAlert,$modal){

		var $scope;

		var completeLoan = function(loanId){
			var deferred = $q.defer();

			var collectModal = $modal.open({
				templateUrl: '/angular/manage/collect/collectModal.html',
				controller:'CollectProcessCtrl',
				size:'lg',
				backdrop: true,
	    		windowClass: 'modal',
				resolve:{
					loan:function(){
						return BLoanService.getLoan(loanId);
					},
					paybacks:function(){
						return BLoanService.getPaybacks(loanId);
					},
					process:function(){
						var process =  {
								list:false,
								pay:false,
								complete:false
							}
						process['complete'] = true;
						return process;
					},
					payBackTypes: function(){
						return DictService.get('payBackTypes');
					},
					interestCalTypes:function(){
						return DictService.get('interestCalTypes');
					}
				}
			});

			collectModal.result.then(function(finishBill){
				if(finishBill){
					deferred.resolve(finishBill);
				}else{
					deferred.reject(false);
				}
			});

			return deferred.promise;
		},
		//生成放款项目
		createLoan = function(finishBill){

			$scope.status.loanCreating = true;

			var contract 		= {};

			if($scope.loanInfo.objectId && finishBill){
				var preLoanData		= {};
				preLoanData.loanId = $scope.loanInfo.objectId;
				preLoanData.finishBill = finishBill;
				preLoanData.finishPayedMoney = finishBill.sum;

				contract.preLoanData = preLoanData;
				contract.isModifiedLoan = true;
			}

			BLoanService.create($scope.loanInfo)
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
							grDeferred.reject("更新担保人失败");
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
				BLoanService.generate(contract).then(function(data){
					$scope.loanInfo = _.extend($scope.loanInfo,data.loan);
					createLoanDeferred.resolve();
				},function(){
					createLoanDeferred.reject();
				});
				return createLoanDeferred.promise;
			}).then(function(){
				$state.go('project.createFinal',{ref:$stateParams.ref});
			}).catch(function(){
				$scope.status.loanCreating = false;
				SweetAlert.error("新建放款失败", "服务器开了点小差", "error");
			})
		},
		//确定放款
		activeLoan = function(){
			var activeModal = $modal.open({
				templateUrl: '/angular/manage/common/active/activeLoanModal.html',
				controller:'ActiveLoanModalCtrl',
				size:'lg',
				resolve:{
					payments:function(){
						return BLoanService.getPayments($scope.loanInfo.objectId).then(function(data){
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
					BLoanService.getPayments($scope.loanInfo.objectId).then(function(data){
						$scope.loanInfo.payments = data;
						BLoanService.getPaybacks($scope.loanInfo.objectId).then(function(paybacks){
							$scope.loanInfo.paybacks = paybacks;
							SweetAlert.success("放款完成");
						},function(){
							SweetAlert.success("获取还款信息失败");
						})
					},function(){
						SweetAlert.success("获放款信息失败");
					})
				}

			},function(){

			})
		};

		return {
			config:function(scope){
				$scope = scope;
			},
			completeLoan:completeLoan,
			createLoan:createLoan,
			activeLoan:activeLoan
		}
	}])
})
