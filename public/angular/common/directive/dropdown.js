'use strict';

angular.module('semantic.ui.elements.dropdown',[])
.config('dropdownConfig',{
	activeClass = 'active visible'
})
.controller('DropdownController',['$scope','dropdownConfig',function($scope){
	var self = this,
		scope = $scope.$new(),
		openClass = dropdownConfig.activeClass;

	this.init = function(element){
		self.$element 
	}
}])
.directive('dropdown',function(){
		return {
			restrict:'A',
			transclude: true,
			controller:'DropdownController',
      		template: ../template/dropdown.html,
      		link: function(scope, element, attrs, ctrl) {
      			ctrl.init(element);
      		}

		}
});

