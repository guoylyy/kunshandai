'use strict';

define(['../../app',"underscore"],function(app,_) {

	
	function userInfo(){
		return {
				name:'',
				certificateNum:'',
				mobilePhoneNum:'',
				email:'',
				qq:'',
				wechat:'',
				address:''
			};
	}
	return app.controller('createLoanCtrl', ["$scope","$location","LoanService","ContactService",'DictService','$state',
		function($scope,$location,LoanService,ContactService,DictService,$state){
		
		var loanInfo,
			contract = {
				loanId:'',
				loanerId:'',
				assurerId:''
				};
		$scope.createContact = function(){

			ContactService.create($scope.br).then(function(res){
				contract.loanerId = res.data.data.objectId;
			});
			ContactService.create($scope.gr).then(function(res){
				contract.assurerId = res.data.data.objectId;
			});
			$state.go('createLoanDetail');
		}
		$scope.createLoan = function(){
			
			//data format
			$scope.loanInfo.payWay = $scope.repayType.selected;
			var date = "2014-10-2";
			$scope.loanInfo.startDate = date;
			$scope.loanInfo.endDate = date;
			$scope.loanInfo.firstPayDate = date;
			// $scope.loanInfo.startDate = new Date($scope.loanInfo.startDate);
			// $scope.loanInfo.endDate = new Date($scope.loanInfo.endDate);
			// $scope.loanInfo.firstPayDate = new Date($scope.loanInfo.firstPayDate);
			// $scope.loanInfo.startDate = new Date((new String($scope.loanInfo.startDate)).replace(/\//,"-"));
			// $scope.loanInfo.endDate = new Date((new String($scope.loanInfo.endDate)).replace(/\//,"-"));
			// $scope.loanInfo.firstPayDate = new Date((new String($scope.loanInfo.firstPayDate)).replace(/\//,"-"));

			LoanService.create($scope.loanInfo).then(function(res){
				contract.loanId = res.data.data.objectId;
				console.log(res.data);
				LoanService.generate(contract).then(function(res){
					alert("创建成功");
				});
			},function(data){
				console.log("err");
			});

			
		};
		$scope.open = function($event) {
		    
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.calendar.opened = true;
		};
		$scope.calendar={};
		
		$scope.br = userInfo();
		
		$scope.gr = userInfo();
		
		$scope.loanInfo = {
			amount:0,
			spanMonth:0,
			startDate:'',
			endDate:'',
			payCircle:12,
			payTotalCircle:24,
			interests:0,
			assureCost:0,
			serviceCost:0,
			overdueCostPercent:0,
			otherCost:0,
			keepCost:0,
			payWay:'',
			firstPayDate:''
		};
		$scope.loanType={
			selected:'fcdy'
		};

		$scope.repayType={
			selected:'xxhb'
		};
		
		$scope.loanTypes = DictService.get("loanTypes");

		$scope.repayTypes =DictService.get("payBackWays");
	}]);
});