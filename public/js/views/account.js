'use strict';

define([
		'jquery',
		'underscore',
		'backbone',
		'accountApp',
		'../models/user',
		'common',
		'backboneValidation'
],function($,_,Backbone,accountApp,User, Common) {
		
		var AccountView = Backbone.View.extend({
		
			el:'#account',

			events:{
				'click #user-login':		'userLogin', 
				'click #user-register':     'userRegiter',
				'click #send-captcha':	    'sendCaptcha',
				'click #remember-me':		'rememberMe'
			},

			initialize:function () {
				this.user = new User();
				Backbone.Validation.bind(this,{invalid:this.handleInvalid,model:this.user});

			},

			userLogin:function (evt){
				evt.preventDefault();
				this.initializeInputBox('login');
				$('.pointing').remove();
				this.input = {
					mobilephone: this.inputBoxes[0].val(),
					password: this.inputBoxes[1].val()
				}
				this.user.set(this.input);
				if( this.user.isValid(Common.loginFormAttr) ){
					accountApp.session.login(
						this.input
					,{
						success: function(mod,res){
							if(DEBUG) console.log('SUCCESS',mod,res);
					  	},error:function(err){
					  		if(DEBUG) console.log('ERROR',err);
					  	}
					  
					});
				}else{

					return false;
				}
				
			},
			useRegister:function(evt) {
				evt.preventDefault();
				this.initializeInputBox('register');
				$('.pointing').remove();
				this.input = {
					mobilephone: this.inputBoxes[0].val(),
					password : this.inputBoxes[1].val(),
					pwConfirmation: this.inputBoxes[2].val(),
					mpCaptcha: this.inputBoxes[3].val()
				}
				this.user.set(this.input);
				if( this.user.isValid(Common.registerFormAttr) ){
					accountApp.session.register()
				}else{
					return false;
				}
			},

 			render: function () {

			},
			initializeInputBox: function(method){

				if(method === 'login'){
					this.inputBoxes = [$('input[name='+Common.loginFormAttr[0]+']'),
									   $('input[name='+Common.loginFormAttr[1]+']')]
				
				}else if(method === 'register'){
					this.inputBoxes = [$('input[name='+Common.registerFormAttr[0]+']'),
									   $('input[name='+Common.registerFormAttr[1]+']'),
									   $('input[name='+Common.registerFormAttr[2]+']')]
				}

			},
			handleInvalid:function(view, attr, error, selector){
				
				var $inputbox = $('input[name='+attr+']');
				$inputbox.parent().append('<div class=\"ui red pointing prompt label transition visible\">'+error+'</div>');
				console.log(error);
			}

		
		})

		return AccountView;
});