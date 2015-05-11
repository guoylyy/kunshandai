'use strict';

define(['app'], function(app) {
  return app.controller('IndexController', ['$scope', '$filter', '$state', '$stateParams', 'incomeStatistics', 'outcomeStatistics',
    function($scope, $filter, $state, $stateParams, incomeStatistics, outcomeStatistics) {

      if(!$stateParams.startDate || !$stateParams.endDate) {
        $scope.currDate = new Date();
      }
      else{
        $scope.currDate = new Date($stateParams.startDate);
      }

      $scope.currYear = null;
      $scope.currMonth = null;

      $scope.yearList = [];
      $scope.monthList = [];

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

      for(var i = $scope.currDate.getFullYear() - 10; i <= $scope.currDate.getFullYear() + 10; i++) {
        var item = {
          value: i,
          text: i + ""
        };
        $scope.yearList.push(item);
        if($scope.currDate.getFullYear() == i) {
          $scope.currYear = item;
        }
      }

      for(var i = 1; i <= 12; i++) {
        var item = {
          value: i,
          text: i + ""
        };
        $scope.monthList.push(item);
        if($scope.currDate.getMonth() == (i - 1)){
          $scope.currMonth = item;
        }
      }

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
        var startDate = new Date($scope.currYear.value,
                                 $scope.currMonth.value - 1,
                                 1);
        var endDate = new Date($scope.currYear.value,
                               $scope.currMonth.value - 1,
                               new Date($scope.currYear.value, $scope.currMonth.value, 0).getDate());
        startDate = $filter('date')(startDate, 'yyyy-MM-dd');
        endDate = $filter('date')(endDate, 'yyyy-MM-dd');
        $state.go($state.current, {startDate:startDate, endDate:endDate}, {reload: true});
      };
    }
  ]);
});
