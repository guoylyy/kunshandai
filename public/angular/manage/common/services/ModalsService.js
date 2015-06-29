define(['app'],function(app){
	return app.factory('ModalsService', ['$modal', function($modal){
		var payWayQuestion = function(){
			var QModal = $modal.open({
				templateUrl: '/angular/manage/loan/partials/payWayQuestion.html',
				size:'md'
			});

			return QModal;
		};

		return {
			payWayQuestion:payWayQuestion
		}
	}])
})