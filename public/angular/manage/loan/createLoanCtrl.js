'use strict';

define(['app',"underscore"],function(app,_) {

	
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
				$state.go('createLoanContact');
			}
			
		};

		var createContact = function(contact){
			
			var deferred = $q.defer();

			ContactService.create(contact).then(function(res){
				deferred.resolve(res.data.data.objectId);
			},function(res){
				deferred.reject(res.data);
			});

			return deferred.promise;
		};

		var createLoan = function(){
			
			var deferred = $q.defer();

			$scope.loanInfo.payWay = $scope.repayType.selected;
			
			LoanService.create($scope.loanInfo).then(function(res){
				deferred.resolve(res.data.data.objectId);
			},function(res){
				deferred.reject(res.data);
			});
			return deferred.promise;
		};

		$scope.createContract = function(){
			
			$q.all([createContact($scope.br),createContact($scope.gr),createLoan()])
			.then(function(results){
				
				contract.loanerId 	= results[0];				
				contract.assurerId 	= results[1];
				contract.loanId 	= results[2];
				console.log(results[0], results[1], results[2]);
				return LoanService.generate(contract);
			
			}).then(function(){
				alert("生成合同成功");
			}).catch(function(){
				alert("生成合同失败");
			})
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
			startDate:'2014-10-2',
			endDate:'2014-10-2',
			payCircle:12,
			payTotalCircle:24,
			interests:0,
			assureCost:0,
			serviceCost:0,
			overdueCostPercent:0,
			otherCost:0,
			keepCost:0,
			payWay:'',
			firstPayDate:'2014-10-2'
		};
		$scope.loanType={
			selected:'fcdy'
		};

		$scope.repayType={
			selected:'xxhb'
		};
		
	}]);
});