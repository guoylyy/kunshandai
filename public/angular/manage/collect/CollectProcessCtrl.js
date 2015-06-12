
define(['app','underscore','moment'],function(app,_,moment) {
	return app.controller('CollectProcessCtrl',
		function(LoanService,$scope,$modalInstance,loan,paybacks,SweetAlert,process,interestCalTypes,payBackTypes){

		$scope.loan 	= loan;
		$scope.paybacks = paybacks;
 		$scope.format 	= "yyyy-MM-dd";

 		$scope.selectedPayback;

 		$scope.billGenerated = false;

		$scope.process 	= process;

		$scope.interestCalTypes = interestCalTypes;

		$scope.payBackTypes = payBackTypes;

		$scope.calendar	= {
			opened:false
		}

		$scope.total = {};

		$scope.completeData = {income:0,outcome:0};
		$scope.completeCount = {date:'',interestType:''};

		$scope.payData;

		$scope.select = {payBackIds:[]};

		$scope.$watchCollection("select.payBackIds",function(newIds,oldIds){
			$scope.payBackIds = _.compact($scope.select.payBackIds);
		})
		$scope.$watchCollection('process',function(){
			if(	$scope.process.complete){
				$scope.completeCount.date = new Date(moment().format('YYYY-MM-DD'));
				$scope.completeCount.interestType = 'allInterest';
			}else if( $scope.process.pay ){
				$scope.payDate = new Date(moment().format('YYYY-MM-DD'));
			}
		})
		var completeInputs = ['completeData.income.amount','completeData.income.overdueMoney','completeData.income.interest',
		'completeData.outcome.assureCost','completeData.outcome.keepCost','completeData.outcome.interest','completeData.income.overdueBreach'];

		$scope.$watchGroup(completeInputs,function(){
			if($scope.total && $scope.completeData && $scope.completedBill){

				$scope.total.income = parseFloat($scope.completeData.income.amount)
										+ parseFloat($scope.completeData.income.overdueMoney)
										+ parseFloat($scope.completeData.income.interest);

				if($scope.loan.payWay.value === 'debx'){
					$scope.total.income += parseFloat($scope.completeData.income.overdueBreach);
				}

				$scope.total.outcome = parseFloat($scope.completeData.outcome.assureCost)
										+ parseFloat($scope.completeData.outcome.keepCost)
										+ parseFloat($scope.completeData.outcome.interest);
				//优惠和已收
				$scope.total.outcome += parseFloat($scope.completedBill.outcome.payedMoney)
															+parseFloat($scope.completedBill.outcome.favourMoney);

				$scope.completeData.sum = $scope.total.income-$scope.total.outcome;

				$scope.completeData.favour = parseFloat(($scope.completedBill.sum - $scope.completeData.sum).toFixed(2));

				if($scope.completeData.favour >= 0){
					$scope.completeData.payType = 'normal';
				}else{
					$scope.completeData.payType = '';
				}
			}
		})

		var payInputs = ['payData.payMoney','payData.overdueMoney','payData.interestsMoney']
		$scope.$watchGroup(payInputs,function(){
			if($scope.total && $scope.payData){
				$scope.total.income = parseFloat($scope.payData.payMoney)
									+ parseFloat($scope.payData.overdueMoney)
									+ parseFloat($scope.payData.interestsMoney);
			  //一期收款若收款金额不匹配可选择还款类型
				if($scope.payBackIds.length === 1){

					if($scope.total.income >= $scope.payBill.sum){
						$scope.payData.payType = 'normal';
					}else{
						$scope.payData.payType = '';
					}
					$scope.payData.offsetMoney = $scope.total.income - $scope.payBill.sum;
				}
			}
		})

		$scope.$watch("payDate",function(){
			if($scope.payDate){
				$scope.payData = {};
				if($scope.payDate < $scope.loan.startDate){
					$scope.billGenerated = false;
					return;
				}
				if($scope.payBackIds.length > 1){
					$scope.countPromise = LoanService.countMultiPaymoney($scope.loan.id,$scope.payBackIds,$scope.payDate)
					.then(function(result){
						$scope.payBill = result;
						$scope.payData = _.extend({},result);
						$scope.billGenerated = true;

					});
				}else if($scope.payBackIds.length == 1){
					$scope.countPromise = LoanService.countPaymoney($scope.payBackIds[0],$scope.payDate)
					.then(function(result){
						$scope.payBill = result;
						$scope.payBill.sum = $scope.payBill.payMoney + $scope.payBill.overdueMoney
																	+ $scope.payBill.interestsMoney - $scope.payBill.payBackMoney;
						$scope.payData = _.extend({},result);
						//减去上期已还
						if($scope.payData.payBackMoney != 0){

							$scope.payData.payMoney +=  $scope.payData.interestsMoney
																					+ $scope.payData.overdueMoney;
							$scope.payData.interestsMoney = 0;
							$scope.payData.overdueMoney = 0;
							$scope.payData.payMoney	-=	$scope.payData.payBackMoney
						}

						$scope.billGenerated = true;

					});
				}

			}
		});

		var countCompleteWatch = ['completeCount.date','completeCount.interestType'];
		$scope.$watchGroup(countCompleteWatch,function(){
			if($scope.completeCount.date && $scope.completeCount.interestType){
				$scope.completeData = {income:{},outcome:{}};
				if($scope.completeCount.date < $scope.loan.startDate){
					$scope.billGenerated = false;
					return;
				}
				$scope.countPromise = LoanService.countCompleteMoney($scope.loan.id,$scope.completeCount.date,$scope.completeCount.interestType);
				$scope.countPromise.then(function(res){
					$scope.completedBill = res;
					$scope.completeData ={
						outcome:_.extend({},res.outcome),
						income:_.extend({},res.income)
					};
					$scope.billGenerated = true;
				});
			}
		});

		$scope.startCollect = function(){
			$scope.selectedPaybacks = _.filter(paybacks, function(o){ return _.indexOf($scope.payBackIds, o.objectId) != -1});

			$scope.loanCompleted 	= false;
			$scope.process.list 	= false;
			$scope.process.pay 		= true;

		}

		$scope.back = function(){
			$scope.payDate = '';
			$scope.process.list = true;
			$scope.process.pay = false;
			$scope.billGenerated = false;

		}
		$scope.openCld = function($event){

			$event.preventDefault();
    	$event.stopPropagation();
			$scope.calendar.opened = true;
		}

		$scope.pay = function(){
			if($scope.payBackIds.length == 1){
				LoanService.payMoney(

					$scope.payBackIds[0],
					$scope.payDate,
					$scope.total.income,
					$scope.payData

				).then(function(){
					SweetAlert.success("收款成功","");
					$modalInstance.close(true);
				});
			}else{
				LoanService.multiPayMoney(
					$scope.loan.id,
					$scope.payBackIds,
					$scope.payDate,
					$scope.total.income,
					$scope.payData
				).then(function(){
					SweetAlert.success("收款成功","");
					$modalInstance.close(true);
				});
			}

		}


		$scope.startComplete = function(){

			$scope.process.complete = true;
			$scope.process.pay = false;
			$scope.process.list = false;
		}

		$scope.resetCompleteData = function(){
			$scope.completeData ={
				outcome:_.extend({},$scope.completedBill.outcome),
				income:_.extend({},$scope.completedBill.income)
			};
		}


		$scope.resetPayData = function(){
			$scope.payData = _.extend({},	$scope.payBill);
		}

		$scope.completeLoan = function(){

			LoanService.completeLoan($scope.loan.id,$scope.completeCount.date,$scope.completeData)
			.then(function(finishBill){
				SweetAlert.swal({
				   title: "结清成功",
				   text: "",
				   type: "success",
				   confirmButtonText: "好的",
				   closeOnConfirm: true},
				function(){
				   $modalInstance.close($scope.completeData);
				});

			},function(){
				SweetAlert.error("结清失败","服务器开小差了");
			});
		}

		$scope.cancel = function(){
			$modalInstance.dismiss('cancel');
		}

	})
})
