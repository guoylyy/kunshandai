define(['app','underscore'],function(app,_) {
	return app.controller('BFinanceController', ['$scope','BFinanceService','LoanService' ,'$state','$stateParams','DictService','financeRanges','fiscalTypes','fiscalStatusTypes',
		function($scope,BFinanceService, LoanService, $state,$stateParams,DictService,financeRanges,fiscalTypes,fiscalStatusTypes){
		

		$scope.currentPage 	= $stateParams.page || 1;

		$scope.currentState = $state.current;

		$scope.calendar 	= {};

		$scope.condition 	= {summaries:[],cashes:[],projects:[]};
		
		$scope.timeRanges = financeRanges;

		$scope.fiscalTypes = fiscalTypes.slice(0,fiscalTypes.length);

		$scope.fiscalStatusTypes = fiscalStatusTypes.slice(0,fiscalStatusTypes.length - 1);

		$scope.loans = [];

		$scope.selected= {loans:[]};

		initTime();
		initSummaries();
		initCashes();
		initProjects();
		initData();

		var allSummaries;

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
			if(!$stateParams.summaries){
				allSummaries();
			}
			if($stateParams.summaries&&!_.isArray($stateParams.summaries)){
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
			if(!$stateParams.cashes){
				allCashes();
			}
			if($stateParams.cashes&&!_.isArray($stateParams.cashes)){
				cashes.push($stateParams.cashes);
			}else{
				cashes = $stateParams.cashes;
			}

			_.each(cashes, function (element) {
				var index = _.findIndex(fiscalStatusTypes,{value:element});
				$scope.condition.cashes[index] = element;
			})
		};

		function initProjects(){
			var projects = [];
			if($stateParams.projects&&!_.isArray($stateParams.projects)){
				projects.push($stateParams.projects);
			}else{
				projects = $stateParams.projects;
			}

			 projects;

			_.each(projects, function(element,index){
				LoanService.getLoan(projects[index]).then(function(data){
					$scope.loans.push(data);
					$scope.condition.projects = _.compact(projects);
				},function(){
					projects[index] = '';
				})
			})

			$scope.selected.loans = $scope.loans;
		}

		function initData() {
			var startTime = $stateParams.startTime;
			var endTime = $stateParams.endTime;
			var summaries = $stateParams.summaries || [0,1,2,3,4,5,6,7,8];
			var cashes = $stateParams.cashes
			if(!$stateParams.cashes || $stateParams.cashes.length == 2){
				cashes = ['all'];	
			}
			
			var projects = $stateParams.projects;

			$scope.financesPromise = BFinanceService.get(
				projects,
				startTime,
				endTime,
				summaries,
				cashes
			).then(function(data){
				$scope.finances = data;
			},function(){
				$scope.finances = [];
			});
		}

		$scope.conditionSearch = function (){
			var summaries = [];
			_.each($scope.condition.summaries,function(e){
				if(e >= 0){
					summaries.push(e);
				}
			})
			var cashes = _.compact($scope.condition.cashes);
			var projects = $scope.condition.projects;
			$state.go($state.current, {page:$scope.currentPage,summaries:summaries,cashes:cashes,projects:projects}, {reload: true});
		}

		$scope.allSummaries = allSummaries;

		function allSummaries() {
			if($scope.condition.summaries.length === $scope.fiscalTypes.length){
				$scope.condition.summaries = [];
			}else{
				_.each($scope.fiscalTypes, function(e,index) {
					$scope.condition.summaries[index] = e.value;
				})
			}
		}

		$scope.allCashes = allCashes;

		function allCashes() {
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

		$scope.refreshLoans = function (loan) {
			if(!loan){
				return;
			}
			var selectedLoans = [];
			$scope.loansPromise = LoanService.search('id',loan).then(function (data) {
				
				$scope.loans = [];
				_.each(data.values,function(element,index){
					if(_.indexOf($scope.condition.projects, element.id) <  0){
						$scope.loans.push(element);
					}
				});
				$scope.loans  = _.union($scope.loans,$scope.selected.loans);
			})
		}

	}])
})