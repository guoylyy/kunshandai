'use strict';

define(['app'], function(app) {
  return app.controller('IndexController', ['$scope', '$filter', '$state', '$stateParams', 'incomeStatistics', 'outcomeStatistics',
    function($scope, $filter, $state, $stateParams, incomeStatistics, outcomeStatistics) {
      $scope.startDate = new Date(parseInt($stateParams.startDate));
      $scope.endDate = new Date(parseInt($stateParams.endDate));

      $scope.calendar = {};

      $scope.incomeStatistics = incomeStatistics;
      $scope.outcomeStatistics = outcomeStatistics;

      $scope.incomeStatistics.typeSum = 0;
      $scope.incomeStatistics.typeData = [];
      $scope.incomeStatistics.waySum = 0;
      $scope.incomeStatistics.wayData = [];
      $scope.outcomeStatistics.typeSum = 0;
      $scope.outcomeStatistics.typeData = [];
      $scope.outcomeStatistics.waySum = 0;
      $scope.outcomeStatistics.wayData = [];

      angular.forEach($scope.incomeStatistics.typeStatictics, function(item){
        $scope.incomeStatistics.typeSum += item.sum;
      });
      angular.forEach($scope.incomeStatistics.typeStatictics, function(item){
        if($scope.incomeStatistics.typeSum > 0){
          if(item.sum > 0) {
            $scope.incomeStatistics.typeData.push({
              name: item.text,
              y: item.sum / $scope.incomeStatistics.typeSum
            });
          }
        }
      });
      angular.forEach($scope.incomeStatistics.wayStattictics, function(item){
        $scope.incomeStatistics.waySum += item.sum;
      });
      angular.forEach($scope.incomeStatistics.wayStattictics, function(item){
        if($scope.incomeStatistics.waySum > 0){
          if(item.sum > 0) {
            $scope.incomeStatistics.wayData.push({
              name: item.text,
              y: item.sum / $scope.incomeStatistics.waySum
            });
          }
        }
      });
      angular.forEach($scope.outcomeStatistics.typeStatictics, function(item){
        $scope.outcomeStatistics.typeSum += item.sum;
      });
      angular.forEach($scope.outcomeStatistics.typeStatictics, function(item){
        if($scope.outcomeStatistics.typeSum > 0){
          if(item.sum > 0) {
            $scope.outcomeStatistics.typeData.push({
              name: item.text,
              y: item.sum / $scope.outcomeStatistics.typeSum
            });
          }
        }
      });
      angular.forEach($scope.outcomeStatistics.wayStattictics, function(item){
        $scope.outcomeStatistics.waySum += item.sum;
      });
      angular.forEach($scope.outcomeStatistics.wayStattictics, function(item){
        if($scope.outcomeStatistics.waySum > 0){
          if(item.sum > 0) {
            $scope.outcomeStatistics.wayData.push({
              name: item.text,
              y: item.sum / $scope.outcomeStatistics.waySum
            });
          }
        }
      });

      $scope.outcomeTypeChartConfig = {
        "options": {
          "chart": {
            "type": "pie"
          },
          "tooltip": {
            "pointFormat": '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          "plotOptions": {
            "pie": {
              "allowPointSelect": true,
              "cursor": "pointer",
              "dataLabels": {
                "enabled": true,
                "color": '#000000',
                "connectorColor": '#000000',
                "format": '<b>{point.name}</b>: {point.percentage:.1f} %'
              },
              "showInLegend": true
            },
            "series": {
              "stacking": "normal"
            }
          }
        },
        "series": [{
          "name": '比例',
          "data": $scope.outcomeStatistics.typeData,
        }],
        "title": {
          "text": "类型统计"
        },
        "credits": {
          "enabled": false
        },
        "loading": false,
        "size": {}
      };

      $scope.outcomeWayChartConfig = {
        "options": {
          "chart": {
            "type": "pie"
          },
          "tooltip": {
            "pointFormat": '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          "plotOptions": {
            "pie": {
              "allowPointSelect": true,
              "cursor": "pointer",
              "dataLabels": {
                "enabled": true,
                "color": '#000000',
                "connectorColor": '#000000',
                "format": '<b>{point.name}</b>: {point.percentage:.1f} %'
              },
              "showInLegend": true
            },
            "series": {
              "stacking": "normal"
            }
          }
        },
        "series": [{
          "name": '比例',
          "data": $scope.outcomeStatistics.wayData
        }],
        "title": {
          "text": "方式统计"
        },
        "credits": {
          "enabled": false
        },
        "loading": false,
        "size": {}
      };

      $scope.incomeTypeChartConfig = {
        "options": {
          "chart": {
            "type": "pie"
          },
          "tooltip": {
            "pointFormat": '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          "plotOptions": {
            "pie": {
              "allowPointSelect": true,
              "cursor": "pointer",
              "dataLabels": {
                "enabled": true,
                "color": '#000000',
                "connectorColor": '#000000',
                "format": '<b>{point.name}</b>: {point.percentage:.1f} %'
              },
              "showInLegend": true
            },
            "series": {
              "stacking": "normal"
            }
          }
        },
        "series": [{
          "name": '比例',
          "data": $scope.incomeStatistics.typeData
        }],
        "title": {
          "text": "类型统计"
        },
        "credits": {
          "enabled": false
        },
        "loading": false,
        "size": {}
      };

      $scope.incomeWayChartConfig = {
        "options": {
          "chart": {
            "type": "pie"
          },
          "tooltip": {
            "pointFormat": '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          "plotOptions": {
            "pie": {
              "allowPointSelect": true,
              "cursor": "pointer",
              "dataLabels": {
                "enabled": true,
                "color": '#000000',
                "connectorColor": '#000000',
                "format": '<b>{point.name}</b>: {point.percentage:.1f} %'
              },
              "showInLegend": true
            },
            "series": {
              "stacking": "normal"
            }
          }
        },
        "series": [{
          "name": '比例',
          "data": $scope.incomeStatistics.wayData
        }],
        "title": {
          "text": "方式统计"
        },
        "credits": {
          "enabled": false
        },
        "loading": false,
        "size": {}
      };

      $scope.startRefresh = function(){
        var startDate = $scope.startDate.getTime();
        var endDate = $scope.endDate.getTime();
        $state.go($state.current, {startDate:startDate, endDate:endDate}, {reload: true});
      };

      $scope.open = function($event,opened) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.calendar[opened] = true;
      };
    }
  ]);
});
