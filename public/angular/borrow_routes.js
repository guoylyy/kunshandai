'use strict'

define(['app','underscore'],function(app,_){

	return app.config(['$stateProvider','$urlRouterProvider','$locationProvider',
    function($stateProvider,$urlRouterProvider,$locationProvider){

      $stateProvider
        .state('borrow',{
          url:"/borrow",
          abstract:true,
          views:{
						'':{
							templateUrl:"/angular/manage/common/partial/layout.html"
						},
						'nav@manage': {
							templateUrl: "/angular/manage/nav/nav.html",
							controller: "NavController",
							resolve:resolveNavObjects()
						},
						'menu@manage': {
							templateUrl:"/angular/manage/common/partial/menu.html"
						}
					}
        })
        .state('borrow.index',{
          url:''
        })

    }])
})
