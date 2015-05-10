define(['app','underscore'],function(app,_){
	
	var navigation = function(direction){
		if(direction === 'prev'){
			$state.go('modifyProject');
		}else if(direction === 'next'){
			$state.go('modifyProjectMore');
		}else if(direction === 'final'){
			$state.go('modifyProjectFinal');
		}
	};

	return {
		ModifyLoanCtrl:app.controller('ModifyLoanCtrl', ['$scope','$state','loan','LoanService','loanTypes','repayTypes',
			function($scope,$state,loan,LoanService,loanTypes,repayTypes){
			
			$scope.loanInfo = LoanService.getLocal();
			//下拉选择类型
			$scope.repayTypes = repayTypes;
			$scope.loanTypes = loanTypes;

			//还款计算
			$scope.countResults = {};
			//日历相关
			$scope.calendar		= {};
			$scope.format 	= 'yyyy-MM-dd';

			$scope.nav = function(direction){
				if(direction === 'next'){
					$state.go('modifyProjectMore');
				}
			}
			
			var init = function(){
				
				if(!$scope.loanInfo.objectId){
					$scope.loanInfo = _.extend($scope.loanInfo,loan);
				}

				$scope.loanInfo.overdueCostPercent = $scope.loanInfo.overdueCostPercent * 1000;
				$scope.loanInfo.interests = $scope.loanInfo.interests * 100;
			}

			init();
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
			
			//控制几个日历开关状态
			$scope.open = function($event,opened) {
			    $event.preventDefault();
			    $event.stopPropagation();
			    $scope.calendar[opened] = true;
			}

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


			

		}]),

		ModifyLoanMoreCtrl:app.controller('ModifyLoanMoreCtrl', ['$scope','$q','$state','ContactService','LoanService',
			'PawnService','$modal','DictService','SweetAlert',
			function($scope,$q,$state,ContactService,LoanService,PawnService,$modal,DictService,SweetAlert){
			
			//放款项目
			$scope.loanInfo = LoanService.getLocal();
			//借款人
			$scope.br 		= ContactService.getLoaner();
			//担保人
			$scope.gr 		= ContactService.getAssurer();
			
			$scope.selected = {};

			$scope.status   = {};
			//抵押物包括附件
			$scope.pawn 	= PawnService.getLocal($scope.loanInfo.loanType);
			
			$scope.template = {
				houseUrl	: '/angular/manage/loan/pawn/house_pawn.html',
				carUrl		: '/angular/manage/loan/pawn/car_pawn.html',
				grUrl		:'/angular/manage/contact/grInfo.html'
			}

			$scope.unique 	= {br:true,gr:true};

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

			$scope.$watchCollection('pawn.pawnType.value',function(){
				if($scope.pawn && $scope.pawn.pawnType){
					console.log($scope.pawn.pawnType.value);
					var required = true;
					for(var i = 0;i <= $scope.pawn.pawnType.items.length; i++){
						if($scope.pawn.pawnType.value[i]){
							required = false;
							break;
						}
					}
				}
				$scope.pawnTypeRequired =  required;
			});

			var init = function(){

				if($scope.loanInfo.objectId){
					if(!$scope.br.objectId){
						ContactService.get($scope.loanInfo.loaner.objectId)
						.then(function(data){
							$scope.br = _.extend($scope.br,_.omit(data,'attachments'));
							ContactService.getAttachments($scope.br.objectId).then(function(attachdata){
		    					$scope.br.attachments = attachdata;
		    				})
						})
					}
					if($scope.br.objectId){
						$scope.selected.br = angular.copy($scope.br);
					}
					
					if($scope.loanInfo.assurer){
						if(!$scope.gr.objectId){
							ContactService.get($scope.loanInfo.assurer.objectId)
							.then(function(data){
								$scope.gr = _.extend($scope.gr,_.omit(data,'attachments'));
								$scope.selected.gr = angular.copy($scope.gr);
								ContactService.getAttachments($scope.gr.objectId).then(function(attachdata){
		    						$scope.gr.attachments = attachdata;
		    					})
							})
						}
						if($scope.gr.objectId){
							$scope.selected.gr = angular.copy($scope.gr);
						}
					}
					if($scope.loanInfo.pawn){
						if(!$scope.br.objectId){
							PawnService.getPawnInfo($scope.loanInfo.pawn.objectId,true)
							.then(function(data){
								$scope.pawn  = _.extend($scope.pawn,data);
							})

							PawnService.getPawn($scope.loanInfo.pawn.objectId)
							.then(function(attach){
								$scope.pawn.attachments  = attach;
							})
						}
						
					}
					
				}

			}

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
							return LoanService.getLoan(loanId);
						},
						paybacks:function(){
							return LoanService.getPaybacks(loanId);
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
			}

			//生成合同
			var createLoan = function(finishBill){
				
				$scope.status.loanCreating = true;
				
				var contract 		= {};

				var preLoanData		= {};

				preLoanData.loanId = $scope.loanInfo.objectId;
				preLoanData.finishBill = finishBill;
				preLoanData.finishPayedMoney = finishBill.sum;
				
				contract.preLoanData = preLoanData;
				contract.isModifiedLoan = true;

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
					
					if($scope.br.hasGr || $scope.loanInfo.assurer){
						
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

			init();

			$scope.nav = function(direction){
				if(direction === 'prev'){
					$state.go('modifyProject',{id:$scope.loanInfo.objectId});
				}else if(direction === 'final'){
					completeLoan($scope.loanInfo.objectId)
					.then(function(finishBill){
						createLoan(finishBill);
					},function(){
						SweetAlert.error("结清失败","服务器开小差了");
					})
				}
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

			$scope.searchContacts = function(type,key){
				return ContactService.search(type,key).then(function(data){
					return data;
				})
			}

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
			
		}]),

		ModifyLoanFinalCtrl:app.controller('ModifyLoanFinalCtrl', ['$scope', function($scope){
			
			//放款项目
			$scope.loanInfo = LoanService.getLocal();
			//借款人
			$scope.br 		= ContactService.getLoaner();
			//担保人
			$scope.gr 		= ContactService.getAssurer();

			//抵押物包括附件
			$scope.pawn 	= PawnService.getLocal($scope.loanInfo.loanType);
			//用于项目详情抵押物信息显示
			$scope.pawnInfos 	= _.unzip(_.pairs($scope.pawn))[1];
			
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

		}])
	}
})