'use strict';

define(['app'],function(app){
	return  app.directive('floatNumberInput', function() {
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
					var clean = val.replace( /[^0-9.]+/g, '');
					if (val !== clean) {
						
							ngModelCtrl.$setViewValue(clean);
							ngModelCtrl.$render();
						
					}else{

					}
					return clean;
				});
				element.bind('blur',function(){
					var val = element.val();
					var floatvar = parseFloat(val);
					if (!isNaN(floatvar)) {
						floatvar = floatvar.toFixed(2);
						ngModelCtrl.$setViewValue(floatvar.toString());
						ngModelCtrl.$render();
					}
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
