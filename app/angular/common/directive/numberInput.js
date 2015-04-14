'use strict';

define(['app'],function(app){
	return app.directive('numberInput', function($parse, $filter) {
			return {
				restrict: 'A',
				require: 'ngModel',
				link: function postLink(scope, element, attrs, ngModel) {
					var getModelValue = function() {
						return $parse(attrs.ngModel)(scope);
					};

					element.bind('change', function(event) {
						var modelValue = getModelValue();
						var val = parseFloat(ngModel.$viewValue.replace(/[^0-9.]/g, ''));
						if (!isNaN(val)) {
							val = val.toFixed(2);
							element.val(val.toString());
							// element.val($filter('number')(val , 2));
						}
						console.log("numberInput validating");
					});
				}
			};
		});
});
