define(['app','underscore'],function(app,_) {
	return app.controller('FinanceController', ['$scope','FinanceService', '$state','$stateParams','DictService','financeRanges','fiscalTypes','fiscalStatusTypes',
		function($scope,FinanceService, $state,$stateParams,DictService,financeRanges,fiscalTypes,fiscalStatusTypes){
		

		$scope.currentPage 	= $stateParams.page || 1;

		$scope.currentState = $state.current;

		$scope.calendar 	= {};

		$scope.condition 	= {summaries:[],cashes:[]};
		
		$scope.timeRanges = financeRanges;

		$scope.fiscalTypes = fiscalTypes.slice(0,fiscalTypes.length - 1);

		$scope.fiscalStatusTypes = fiscalStatusTypes.slice(0,fiscalStatusTypes.length - 1);

		initTime();
		initSummaries();
		initCashes();
		initData();

		function initTime() {
			var startTime = '', endTime = '';
			if($stateParams.startTime){
				startTime = new Date(parseInt($stateParams.startTime));
				endTime = new Date(parseInt($stateParams.endTime));
			}
			$scope.condition.startTime = startTime;
			$scope.condition.endTime = endTime;
		}

		function initSummaries() {
			var summaries = [];

			if(!_.isArray($stateParams.summaries)){
				summaries.push($stateParams.summaries);
			}else{
				summaries = $stateParams.summaries;
			}

			_.each(summaries, function (element) {
				var index = _.findIndex(fiscalTypes,{value:parseInt(element)});
				$scope.condition.summaries[index] = parseInt(element);
			})
			
		};

		function initCashes(){
			var cashes = [];

			if(!_.isArray($stateParams.cashes)){
				cashes.push($stateParams.cashes);
			}else{
				cashes = $stateParams.cashes;
			}

			_.each(cashes, function (element) {
				var index = _.findIndex(fiscalStatusTypes,{value:element});
				$scope.condition.cashes[index] = element;
			})
		};

		function initData() {
			FinanceService.get().then(function(data){
				$scope.finances = data;
			},function(){
				$scope.finances = [];
			});
		}

		$scope.conditionSearch = function (){
			var summaries = $scope.condition.summaries;
			var cashes = _.compact($scope.condition.cashes);
			$state.go($state.current, {page:$scope.currentPage,summaries:summaries,cashes:cashes}, {reload: true});
		}

		$scope.allSummaries = function () {
			if($scope.condition.summaries.length === $scope.fiscalTypes.length){
				$scope.condition.summaries = [];
			}else{
				_.each($scope.fiscalTypes, function(e,index) {
					$scope.condition.summaries[index] = e.value;
				})
			}
		}

		$scope.allCashes = function () {
			if(_.compact($scope.condition.cashes).length === $scope.fiscalStatusTypes.length){
				$scope.condition.cashes = [];
			}else{
				_.each($scope.fiscalStatusTypes, function(e,index) {
					$scope.condition.cashes[index] = e.value;
				})
			}
		}

		$scope.resetSummaries = function () {
			initSummaries();
		}

		$scope.resetCashes= function () {
			initCashes();
		}

		//控制几个日历开关状态
		$scope.open = function($event,opened) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    if(opened === 'openedstart'){
		    	$scope.calendar['openedstart'] = true;
		    	$scope.calendar['openedend'] = false;
		    }else{
		    	$scope.calendar['openedend'] = true;
		    	$scope.calendar['openedstart'] = false;
		    }

		}


		$scope.customTime = function(){
			if(_.isNull($scope.condition.startTime) || _.isNull($scope.condition.endTime)){
				return;
			}
			$state.go($state.current.name,{
				startTime:(new Date($scope.condition.startTime)).getTime(),
				endTime:(new Date($scope.condition.endTime)).getTime()
			});
		}

	}])
})