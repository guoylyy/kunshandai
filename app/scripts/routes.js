/**
 * Created with Sublimetext
 * @author	: Ethansure
 * Date		: 2015/4/10
 * Time		: 23:40
 */

define(['app','controllers/login','controllers/signup'],
	function(app,login,logout,signup){
		return app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {
			$routeProvider.
				when('/',{redirectTo:'/login'}).
				when('/login',{controller:login}).
				when('/logout',{controller:logout}).
				when('/signup',{controller:signup}).
				otherwise({redirectTo:'/'});
		}])
	})