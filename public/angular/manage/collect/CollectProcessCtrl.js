
define(['app','underscore'],function(app,_) {
	return app.controller('CollectProcessCtrl', 
		function(LoanService,$scope,$modalInstance,loan,paybacks,SweetAlert,process,interestCalTypes){
		
		$scope.loan 	= loan;
		$scope.paybacks = paybacks;
 		$scope.format 	= "yyyy-MM-dd";

 		$scope.selectedPayback;

 		$scope.billGenerated = false;

		$scope.process 	= process;

		$scope.interestCalTypes = interestCalTypes;

		$scope.calendar	= {
			opened:false
		}

		$scope.total = {};

		$scope.completeData = {income:0,outcome:0};
		$scope.completeCount = {date:'',interestType:''};

		$scope.payData;

		$scope.$watch("paybacks",function(){
			// if($scope.paybacks && $scope.paybacks.length == 1){
			// 	$scope.process.complete = true;
			// 	$scope.process.pay = false;
			// 	$scope.process.list = false;
			// }
		})

		var completeInputs = ['completeData.income.amount','completeData.income.overdueMoney','completeData.income.interest',
		'completeData.outcome.assureCost','completeData.outcome.keepCost','completeData.outcome.interest'];

		$scope.$watchGroup(completeInputs,function(){
			if($scope.total && $scope.completeData){

				$scope.total.income = parseFloat($scope.completeData.income.amount) 
										+ parseFloat($scope.completeData.income.overdueMoney) 
										+ parseFloat($scope.completeData.income.interest);

				$scope.total.outcome = parseFloat($scope.completeData.outcome.assureCost) 
										+ parseFloat($scope.completeData.outcome.keepCost)
										+ parseFloat($scope.completeData.outcome.interest);	

				$scope.completeData.sum = $scope.total.income-$scope.total.outcome;
			}
		})

		var payInputs = ['payData.payMoney','payData.overdueMoney','payData.interestsMoney']
		$scope.$watchGroup(payInputs,function(){
			if($scope.total && $scope.payData){
				$scope.total.income = parseFloat($scope.payData.payMoney) 
									+ parseFloat($scope.payData.overdueMoney)
									+ parseFloat($scope.payData.interestsMoney);
			}
		})

		$scope.$watch("payDate",function(){
			if($scope.payDate){
				LoanService.countPaymoney($scope.paybackId,$scope.payDate)
				.then(function(result){
					$scope.payBill = result;
					$scope.payData = _.extend({},result);
					$scope.billGenerated = true;

				});
			}
		});

		var countCompleteWatch = ['completeCount.date','completeCount.interestType'];
		$scope.$watchGroup(countCompleteWatch,function(){
			if($scope.completeCount.date && $scope.completeCount.interestType){
				LoanService.countCompleteMoney($scope.loan.id,$scope.completeCount.date,$scope.completeCount.interestType)
				.then(function(res){
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
			$scope.selectedPayback = paybacks[_.findIndex(paybacks,{objectId:$scope.paybackId})];

			if($scope.selectedPayback.order == $scope.paybacks.length){
				// SweetAlert.error("该功能暂不开放","需要后台结清接口");
				$scope.loanCompleted = true;
			}else{
				$scope.loanCompleted = false;
			}
			$scope.process.list = false;
			$scope.process.pay = true;
			
		}

		$scope.back = function(){
			$scope.process.list = true;
			$scope.process.pay = false;
		}
		$scope.openCld = function($event){
			
			$event.preventDefault();
    		$event.stopPropagation();
			$scope.calendar.opened = true;
		}

		$scope.pay = function(){
			LoanService.payMoney($scope.paybackId,$scope.payDate,$scope.total.income)
			.then(function(){
				SweetAlert.success("收款成功","");
				$modalInstance.close(true);
			});
		}

		$scope.startComplete = function(){
			
			$scope.process.complete = true;
			$scope.process.pay = false;
			$scope.process.list = false;
		}

		
		$scope.completeLoan = function(){

			LoanService.completeLoan($scope.loan.id,$scope.completeCount.date,$scope.completeData)
			.then(function(){
				SweetAlert.swal({
				   title: "结清成功",
				   text: "",
				   type: "success",
				   confirmButtonText: "好的",
				   closeOnConfirm: true}, 
				function(){ 
				   $modalInstance.close(true);
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