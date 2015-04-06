'use strict';

define([
		'jquery',
		'underscore',
		'backbone',
		'accountApp',
		'text!templates/account/login.html'
],function($,_,Backbone,accountApp,loginTemplate) {
		
		var AccountView = Backbone.View.extend({
		
			el:'#account',

			events:{
				'click #user-login':		'userLogin', 
				'click #user-register':     'userRegiter',
				'click #phone-validate':	'phoneValidate',
				'click #remember-me':		'rememberMe'
			},

			initialize:function () {

			},

			userLogin:function (evt){

				accountApp.session.login({

				},{
					success: function(mod,res){
						if(DEBUG) console.log('SUCCESS',mod,res);
				  	},error:function(err){
				  		if(DEBUG) console.log('ERROR',err);
				  	}
				  
				});
			},

 			render: function () {

			}

		
		})

		return AccountView;
});