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
	return app.controller('CreateLoanCtrl', ["$scope","$location","$q","LoanService","ContactService",'DictService','$state',
		'loanTypes','repayTypes',
		function($scope,$location,$q,LoanService,ContactService,DictService,$state,loanTypes,repayTypes){
		
		var loanInfo,
			contract = {
				loanId:'',
				loanerId:'',
				assurerId:''
				};

		$scope.loanTypes = (typeof loanTypes !== 'undefined' )? loanTypes.data : {};
		$scope.repayTypes = (typeof repayTypes !== 'undefined' )? repayTypes.data : {};
		// $scope.loanTypes = loanTypes.data;
		// $scope.repayTypes = repayTypes.data;
		
		$scope.nav = function(direction){
			if(direction === 'prev'){
				$state.go('createLoan');
		
			}else if(direction === 'next'){
				$state.go('createLoanDetail');
				// var ltPromise =  DictService.get("loanTypes");
				// var rpPromise =DictService.get("payBackWays");
				// $q.all([ltPromise,rpPromise])
				// 	.then(function(results){
				// 		$scope.loanTypes =  results[0].data.data;
				// 		$scope.repayTypes = results[1].data.data;
				// 		$state.go('createLoanDetail');
						
				// 	},function(err){
				// 		console.log(err);
				// });
				
			}
			
		};

		$scope.createContact = function(){
			
			var deferred = $q.defer();

			ContactService.create($scope.br).then(function(res){
				contract.loanerId = res.data.data.objectId;
				deferred.resolve("contact id "+ contract.loanerId +" created");
			},function(res){
				deferred.reject(res.data);
			});
			ContactService.create($scope.gr).then(function(res){
				contract.assurerId = res.data.data.objectId;
				deferred.resolve("contact id "+ contract.loanerId +" created");
			},function(){
				deferred.reject(res.data);
			});

			return deferred.promise;
		};

		$scope.createLoan = function(){
			
			var createContactPromise = $scope.createContact();

			createContactPromise.then(function(){
				
				//initial loanInfo
				var createLoandefferred = $q.defer();
				var date = "2014-10-2";

				$scope.loanInfo.payWay = $scope.repayType.selected;
				$scope.loanInfo.startDate = date;
				$scope.loanInfo.endDate = date;
				$scope.loanInfo.firstPayDate = date;

				LoanService.create($scope.loanInfo).then(function(res){
					contract.loanId = res.data.data.objectId;
					createLoandefferred.resolve(contract.loanId);
				});

				return createLoandefferred.promise;

			}).then(function(){
				
				return LoanService.generate(contract);
			}).then(function(){
				alert("生成合同成功");
			}).catch(function(){
				alert("生成合同失败");
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