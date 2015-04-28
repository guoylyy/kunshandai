
define(['app'],function(app) {
	return app.controller('CollectProcessCtrl', function(LoanService,$scope,$modalInstance,loan,paybacks){
		
		$scope.loan = loan;
		$scope.paybacks = paybacks;
 		$scope.format = "yyyy-MM-dd";

		$scope.process = {
			list:true,
			pay:false
		}

		$scope.calendar = {
			opened:false
		}

		$scope.$watch("payDate",function(newPayDate){
			if(newPayDate){
				$scope.payMoney = LoanService.countPaymoney($scope.loan.id,newPayDate);
			}

		});

		$scope.startCollect = function(){
			$scope.process.list = false;
			$scope.process.pay = true;
		}

		$scope.openCld = function($event){
			
			$event.preventDefault();
    		$event.stopPropagation();
			$scope.calendar.opened = true;
		}

	})
})