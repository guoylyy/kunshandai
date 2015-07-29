'use strict';

define(['app'],function(app){
	return  app.directive('ksFixedHead', function($window) {
		return {
			restrict:'A',
			link: function(scope, element, attrs) {
				
				var windowEl = angular.element($window);

				windowEl.on('scroll', function () {
					
					

					if(this.pageYOffset > 450) {
						element.addClass('ks-fixed-head');
					}else{
						element.removeClass('ks-fixed-head');
					}
				});

			}
		};
	});
});
