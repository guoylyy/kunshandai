'use strict';

define(['app'], function(app) {
  return app.controller('IndexController', ['$scope',
    function($scope) {

      $scope.chartConfig = {
        "options": {
          "chart": {
            "type": "pie"
          },
          "plotOptions": {
            "series": {
              "stacking": "normal"
            }
          }
        },
        "series": [{
          "data": [
            3,
            20,
            16,
            4,
            2,
            7
          ],
          "id": "series-5"
        }],
        "title": {
          "text": "Hello"
        },
        "credits": {
          "enabled": false
        },
        "loading": false,
        "size": {}
      };



    }
  ]);
});