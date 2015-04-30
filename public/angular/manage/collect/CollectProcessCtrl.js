
define(['app','underscore'],function(app,_) {
	return app.controller('CollectProcessCtrl', 
		function(LoanService,$scope,$modalInstance,loan,paybacks,SweetAlert,process){
		
		$scope.loan 	= loan;
		$scope.paybacks = paybacks;
 		$scope.format 	= "yyyy-MM-dd";

 		$scope.selectedPayback;

 		$scope.billGenerated = false;

		$scope.process 	= process;

		$scope.calendar	= {
			opened:false
		}

		$scope.total = {};
		$scope.payData = {income:0,outcome:0};

		$scope.$watch("paybacks",function(){
			// if($scope.paybacks && $scope.paybacks.length == 1){
			// 	$scope.process.complete = true;
			// 	$scope.process.pay = false;
			// 	$scope.process.list = false;
			// }
		})

		var completeInputs = ['payData.income.amount','payData.income.overdueMoney','payData.outcome.assureCost','payData.outcome.keepCost'];

		$scope.$watchGroup(completeInputs,function(){
			if($scope.total && $scope.payData){
				$scope.total.income = parseFloat($scope.payData.income.amount) + parseFloat($scope.payData.income.overdueMoney);
				$scope.total.outcome = parseFloat($scope.payData.outcome.assureCost) + parseFloat($scope.payData.outcome.keepCost);	
			}
		})

		$scope.$watch("payDate",function(){
			if($scope.payDate){
				LoanService.countPaymoney($scope.paybackId,$scope.payDate)
				.then(function(result){
					$scope.payMoney = result.payMoney;
				});
			}
		});

		$scope.$watch("completeDate",function(){
			if($scope.completeDate){
				LoanService.countCompleteMoney($scope.loan.id,$scope.completeDate)
				.then(function(res){
					$scope.completedBill = res;
					$scope.payData ={
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
			LoanService.payMoney($scope.paybackId,$scope.payDate)
			.then(function(){
				SweetAlert.success("收款成功","");
				$modalInstance.close();
			});
		}

		$scope.startComplete = function(){
			
			$scope.process.complete = true;
			$scope.process.pay = false;
			$scope.process.list = false;
		}

		
		$scope.completeLoan = function(){

			LoanService.completeLoan($scope.loan.id,$scope.completeDate,$scope.payData)
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