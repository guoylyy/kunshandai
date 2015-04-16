'use strict';

define(['app'],function(app){
	// return app.directive('numberInput', function($parse, $filter) {
	// 		return {
	// 			restrict: 'A',
	// 			require: 'ngModel',
	// 			link: function postLink(scope, element, attrs, ngModel) {
	// 				var getModelValue = function() {
	// 					return $parse(attrs.ngModel)(scope);
	// 				};

	// 				element.bind('change', function(event) {
	// 					var modelValue = getModelValue();
	// 					var val = parseFloat(ngModel.$viewValue.replace(/[^0-9.]/g, ''));
	// 					if (!isNaN(val)) {
	// 						val = val.toFixed(2);
	// 						element.val(val.toString());
	// 						// element.val($filter('number')(val , 2));
	// 					}
	// 					// console.log("numberInput validating");
	// 				});
	// 			}
	// 		};
	// 	});


	// return app.directive('numberInput', function () {
	//     return {
	//         restrict: 'EA',
	//         template: '<input name="{{inputName}}" ng-model="inputValue" />',
	//         scope: {
	//             inputValue: '=',
	//             inputName: '='
	//         },
	//         link: function (scope, element, attrs, mgModel) {
	//             scope.$watch('', function(newValue,oldValue) {
	//                 var arr = String(newValue).split("");
	//                 if (arr.length === 0) return;
	//                 if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.' )) return;
	//                 if (arr.length === 2 && newValue === '-.') return;
	//                 if (arr.length === 0 && newValue === '0'){
	//                 	scope.inputValue = oldValue;
	//                 }
	//                 if (isNaN(newValue)) {
	//                     scope.inputValue = oldValue;
	//                 }
	//             });
	//         }
	//     };
	// });
	// 
	return  app.directive('numberInput', function() {
		return {
			require: '?ngModel',
			link: function(scope, element, attrs, ngModelCtrl) {
				if(!ngModelCtrl) {
					return; 
				}

				ngModelCtrl.$parsers.push(function(val) {
					if (angular.isUndefined(val)) {
						var val = '';
					}
					var clean = val.replace( /[^0-9]+/g, '');
					if (val !== clean) {
						ngModelCtrl.$setViewValue(clean);
						ngModelCtrl.$render();
						
					}
					return clean;
				});


				element.bind('keypress', function(event) {
					if(event.keyCode === 32) {
						event.preventDefault();
					}
				});
			}
		};
	});
});
