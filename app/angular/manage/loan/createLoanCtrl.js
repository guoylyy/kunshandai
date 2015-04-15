'use strict';

define(['../../app',"underscore"],function(app,_) {

	
	function userInfo(){
		return {
				name:'123',
				certificateNum:'123',
				mobilePhoneNum:'',
				email:'',
				qq:'',
				wechat:'',
				address:''
			};
	}
	return app.controller('createLoanCtrl', ["$scope","$location","$q","LoanService","ContactService",'DictService','$state',
		function($scope,$location,$q,LoanService,ContactService,DictService,$state){
		
		var loanInfo,
			contract = {
				loanId:'',
				loanerId:'',
				assurerId:''
				};


		$scope.nav = function(direction){
			if(direction === 'prev'){
				$state.go('createLoan');
		
			}else if(direction === 'next'){
				
				var ltPromise =  DictService.get("loanTypes");
				var rpPromise =DictService.get("payBackWays");
				$q.all([ltPromise,rpPromise])
					.then(function(results){
						$scope.loanTypes =  results[0].data.data;
						$scope.repayTypes = results[1].data.data;
						$state.go('createLoanDetail');
						
					},function(err){
						console.log(err);
				});
				
			}
			
		};

		$scope.createContact = function(){
			
			var deferred = $q.defer();

			ContactService.create($scope.br).then(function(res){
				contract.loanerId = res.data.data.objectId;
			},function(res){
				deferred.reject(res.data);
			});
			ContactService.create($scope.gr).then(function(res){
				contract.assurerId = res.data.data.objectId;
			},function(){
				deferred.reject(res.data);
			});

			return deferred.promise;
		};

		$scope.createLoan = function(){
			
			var createContactPromise = $scope.createContact();

			createContactPromise.then(function(){

				$scope.loanInfo.payWay = $scope.repayType.selected;
				var date = "2014-10-2";
				$scope.loanInfo.startDate = date;
				$scope.loanInfo.endDate = date;
				$scope.loanInfo.firstPayDate = date;
				
				LoanService.create($scope.loanInfo).then(function(res){
					contract.loanId = res.data.data.objectId;
					console.log(res.data);
					LoanService.generate(contract).then(function(res){
						alert("创建成功");
					});
				},function(data){
					console.log("err");
				});

			},function(reason){
				$scope.err = reason.message;
			});
			
		};
		$scope.open = function($event,opened) {
		    
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.calendar[opened] = true;
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
		
	}]);
});