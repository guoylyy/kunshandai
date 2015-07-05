define(['app','moment'], function(app,moment) {
	return app.controller('ModifyLoanModalController', function($scope,loan, LoanService,interestCalTypes){
		

		$scope.interestCalTypes = interestCalTypes;
		$scope.loan = loan;
		$scope.completeData = {income:0,outcome:0};
		$scope.completeCount = {date:'',interestType:''};
		$scope.total = {};
		
		$scope.calendar	= {
			opened:false
		}
		$scope.openCld = function($event){

			$event.preventDefault();
    		$event.stopPropagation();
			$scope.calendar.opened = true;
		}

		init();

		function init() {
			$scope.completeCount.date = new Date(moment().format('YYYY-MM-DD'));
			$scope.completeCount.interestType = 'allInterest';
		}

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

				$scope.completeData.offsetMoney = parseFloat(($scope.completeData.sum - $scope.completedBill.sum).toFixed(2));

				if($scope.completeData.offsetMoney >= 0){
					$scope.completeData.payType = 'normal';
				}else{
					$scope.completeData.payType = '';
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

	})
})