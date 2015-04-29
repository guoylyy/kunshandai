
define(['app','underscore'],function(app,_) {
	return app.controller('CollectProcessCtrl', 
		function(LoanService,$scope,$modalInstance,loan,paybacks,SweetAlert){
		
		$scope.loan 	= loan;
		$scope.paybacks = paybacks;
 		$scope.format 	= "yyyy-MM-dd";

 		$scope.selectedPayback

		$scope.process 	= {
			list:true,
			pay:false
		}

		$scope.calendar	= {
			opened:false
		}

		

		$scope.$watch("payDate",function(newPayDate){
			if(newPayDate){
				LoanService.countPaymoney($scope.paybackId,newPayDate)
				.then(function(result){
					$scope.payMoney = result.payMoney;
				})
				
			}
		});

		$scope.startCollect = function(){
			$scope.selectedPayback = paybacks[_.findIndex(paybacks,{objectId:$scope.paybackId})];

			if($scope.selectedPayback.order == $scope.paybacks.length){
				SweetAlert.error("该功能暂不开放","需要后台结清接口");
			}else{
				$scope.process.list = false;
				$scope.process.pay = true;
			}
			
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
			LoanService.payMoney($scope.paybackId,$scope.payDate,$scope.payMoney)
			.then(function(){
				SweetAlert.success("收款成功","");
				$modalInstance.close();
			})
		}

		$scope.cancel = function(){
			$modalInstance.dismiss('cancel');
		}

	})
})