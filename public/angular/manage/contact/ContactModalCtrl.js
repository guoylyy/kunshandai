define(['app','underscore'],function(app,_){
	return app.controller('ContactModalCtrl', function($scope,$modalInstance,control,contact){

		$scope.contact = contact;

		$scope.control = control;


		$scope.cancel = function(){
			$modalInstance.dismiss('cancel');
		}

		$scope.startEdit = function(){
			$scope.control.view = false;
			$scope.control.edit = true;
		}

		$scope.finishEdit = function(){
			$modalInstance.close($scope.contact);
		}

		$scope.finishCreate = function(){
			$modalInstance.close($scope.contact);
		}

	})
})