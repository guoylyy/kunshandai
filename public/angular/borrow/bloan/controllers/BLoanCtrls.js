'use strict';

define(['app',"underscore"],function(app,_) {


	return {
		BLoanFormCtrl: app.controller('BLoanFormCtrl',
			["$scope","$q","BLoanService",'DictService','$state','loanTypes','repayTypes','SweetAlert','loan',
			function($scope,$q,BLoanService,DictService,$state,loanTypes,repayTypes,SweetAlert,loan){

			//下拉选择类型
			$scope.repayTypes	= repayTypes;
			$scope.loanTypes 	= loanTypes;
			//还款计算
			$scope.countResults = {};
			//日历相关
			$scope.calendar		= {};
			$scope.format 		= 'yyyy-MM-dd';

			//获取原有loan 或从本地获取新的loan Model
			$scope.loanInfo     = BLoanService.getLocal();
			var init = function(){

				if(!$scope.loanInfo.objectId){
					$scope.loanInfo = _.extend($scope.loanInfo,loan);
					if(loan){
						$scope.loanInfo.overdueCostPercent = $scope.loanInfo.overdueCostPercent * 1000;
						$scope.loanInfo.overdueBreachPercent = $scope.loanInfo.overdueBreachPercent * 1000;
						$scope.loanInfo.interests = $scope.loanInfo.interests * 100;

					}
				}

			}

			init();

			$scope.count = function(){
				var loan = angular.copy($scope.loanInfo);
				loan.interests = loan.interests / 100;
				loan.overdueCostPercent = loan.overdueCostPercent / 1000;
				loan.overdueBreachPercent = loan.overdueBreachPercent / 1000;
				$scope.countResults = BLoanService.getCountResult(loan);
			};

			var watchPayWayAndSpanMonth 	= ['loanInfo.payWay','loanInfo.spanMonth'],
				watchStartDateAndPayCircle 	= ['loanInfo.startDate','loanInfo.payCircle'];

			$scope.$watch('loanInfo.payWay',function(){
				if(!$scope.loanInfo.payWay === 'debx'){
					$scope.loanInfo.overdueBreachPercent = 0;
				}
			})

			$scope.$watchGroup(watchPayWayAndSpanMonth,function(){
				circleChange();
				dateChange();
			})

			$scope.$watchGroup(watchStartDateAndPayCircle,function(){
				dateChange();
				payTotalCircleChange();
			})

			$scope.$watch('loanInfo.firstPayDate',function(){
				payTotalCircleChange();
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
					}else{
						$scope.loanInfo.payCircle = 1;
						$scope.loanInfo.payTotalCircle = $scope.loanInfo.spanMonth;
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
				}else{
					if($scope.loanInfo.startDate && $scope.loanInfo.payCircle){
						var firstPayDate = new Date($scope.loanInfo.startDate);
						firstPayDate.setMonth(firstPayDate.getMonth() + parseInt($scope.loanInfo.payCircle));
						firstPayDate.setDate(firstPayDate.getDate() - 1);
						$scope.loanInfo.firstPayDate = firstPayDate;
					}
				}
			}

			$scope.resetLoanForm = function(){
				var loanType = $scope.loanInfo.loanType,
						payWay = $scope.loanInfo.payWay;
				$scope.loanInfo = _.extend($scope.loanInfo,BLoanService.getModel());
				$scope.loanInfo.loanType = loanType;
				$scope.loanInfo.payWay	 = payWay;
			}
			//控制几个日历开关状态
			$scope.open = function($event,opened) {
			    $event.preventDefault();
			    $event.stopPropagation();
			    $scope.calendar[opened] = true;
			}

		}]),
		BLoanContactFormCtrl: app.controller('BLoanContactFormCtrl', ['$scope','BLoanService','ContactService','PawnService','$modal','SweetAlert',
		 	function($scope,BLoanService,ContactService,PawnService,$modal,SweetAlert){

			//项目信息
			$scope.loanInfo = BLoanService.getLocal();
			//借款人
			$scope.br 		= ContactService.getLoaner();
			//担保人
			$scope.gr 		= ContactService.getAssurer();
			/**
			 * 初始化借款人、担保人
			 * 若是来自原有的贷款项目，则从服务器获取借款人和担保人的信息
			 * 若是无引用新建贷款项目，从本地获取Model
			 */

			$scope.selected = {};

			$scope.unique 	= {br:true,gr:true};

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

			init();

			$scope.$watchCollection('pawn.pawnType.value',function(){
				if($scope.pawn && $scope.pawn.pawnType){

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


			//抵押物包括附件
			$scope.pawn 		= PawnService.getLocal($scope.loanInfo.loanType);
			//用于项目详情抵押物信息显示
			$scope.pawnInfos 	= _.unzip(_.pairs($scope.pawn))[1];

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
		        }, function(isConfirm) {
		        	if(isConfirm){
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
		        	}

		        });


			}

			$scope.searchContacts = function(type,key){
				return ContactService.search(type,key).then(function(data){
					return data;
				})
			}

			$scope.viewMsgTemplate = function(){
				var modalInstance = $modal.open({
				  templateUrl: '/angular/manage/common/notification/notification.html',
				  size: 'md',
				  controller:function($scope,$modalInstance){
				  	$scope.close = function(){
				  		$modalInstance.close();
				  	}
				  }
				});
			}


		}]),
		CreateBLoanCtrl: app.controller('CreateBLoanCtrl', ['$scope','BLoanService','SweetAlert','PawnService','ContactService','BLoanHelper',
			function($scope,BLoanService,SweetAlert,PawnService,ContactService,BLoanHelper){

			//项目信息
			$scope.loanInfo = BLoanService.getLocal();
			//借款人
			$scope.br 		= ContactService.getLoaner();
			//担保人
			$scope.gr 		= ContactService.getAssurer();

			// 状态记录
			$scope.status	= {};

			$scope.createLoan = function(valid){
				if(!valid){
					return;
				}
				SweetAlert.swal({
		          title: '确定生成项目?',
		          text: '生成后不能修改项目',
		          type: 'warning',
		          confirmButtonColor: '#DD6B55',
		          confirmButtonText: "确定",
		          cancelButtonText: "返回修改",
		          showCancelButton: true
		        }, function(isConfirm) {
		        	if(isConfirm){
		         		BLoanHelper.config($scope);
						BLoanHelper.createLoan();
		        	}

		        });

			}

		}]),
		BLoanDetailCtrl: app.controller('BLoanDetailCtrl', ['$scope', 'BLoanService','ContactService','PawnService',
			function($scope,BLoanService,ContactService,PawnService){

			//项目信息
			$scope.loanInfo = BLoanService.getLocal();
			//借款人
			$scope.br 		= ContactService.getLoaner();
			//担保人
			$scope.gr 		= ContactService.getAssurer();
			//抵押物包括附件
			$scope.pawn 		= PawnService.getLocal($scope.loanInfo.loanType);
			//用于项目详情抵押物信息显示
			$scope.pawnInfos 	= _.unzip(_.pairs($scope.pawn))[1];


		}]),
		ActiveBLoanCtrl: app.controller('ActiveBLoanCtrl', ['$scope','BLoanService','BLoanHelper',
			function($scope,BLoanService,BLoanHelper){

			$scope.loanInfo = BLoanService.getLocal();
			//放款
			$scope.activeLoan = function(){
				BLoanHelper.config($scope);
				BLoanHelper.activeLoan();
			}
		}]),
		ModifyBLoanCtrl: app.controller('ModifyBLoanCtrl', ['$scope','BLoanService','BLoanHelper',
			function($scope,BLoanService,BLoanHelper){

			$scope.loanInfo = BLoanService.getLocal();
			// 状态记录
			$scope.status	= {};

			$scope.modifyLoan = function(valid){
				if(!valid){
					return;
				}
				BLoanHelper.config($scope);

				var completeLoanPromise = BLoanHelper.completeLoan($scope.loanInfo.objectId);

				completeLoanPromise.then(function(finishBill){
					BLoanHelper.createLoan(finishBill);
				},function(){
					SweetAlert.error("结清失败","服务器开小差了");
				})
			}
		}]),
		CompleteBLoanCtrl: app.controller('CompleteBLoanCtrl', ['$scope','BLoanService','$modal','DictService',
			function($scope,BLoanService,$modal,DictService){

			$scope.completeLoan = function(loanId){
				BLoanHelper.config($scope);
				BLoanHelper.completeLoan(loanId);
			}
		}]),
		BLoanNavCtrl: app.controller('BLoanNavCtrl', ['$scope','$state','$stateParams',function($scope,$state,$stateParams){

			$scope.nav = function(valid,direction){
				 if(direction === 'prev'){
						if($state.current.name === 'bproject.createMore'){
							$state.go('bproject.create',{ref:$stateParams.ref});
						}else if($state.current.name === 'bproject.modifyMore'){
							$state.go('bproject.modify',{id:$stateParams.id});
						}
					}
					else if(direction === 'next'){
						if(!valid){
							return;
						}
						if($state.current.name === 'bproject.create'){
							$state.go('bproject.createMore',{ref:$stateParams.ref});
						}else if($state.current.name === 'bproject.modify'){
							$state.go('bproject.modifyMore',{id:$stateParams.id});
						}
					}

			}


		}])

	}
});
