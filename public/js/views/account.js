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
				'click #user-register':     'verifyCode',
				'click #send-captcha':	    'userRegister',
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
					mobilePhone: this.inputBoxes[0].val(),
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
			verifyCode:function (evt) {
				evt.preventDefault();
				this.initializeInputBox('captcha');
				$('.pointing').remove();
				var code = this.inputBoxes[0].val();
				$.ajax({
					url:'/v1/account/verifyUserMobilePhoneNumber',
					contentType: 'application/json',
					data:JSON.stringify({'code':code}),
					dataType: 'json',
                	type: 'POST',
                	success:function(){
                		console.log("verify code success");
                	},
                	error:function(){
                		console.log("verify code error");
                	}
				});
			},
			userRegister:function(evt) {
				evt.preventDefault();
				this.initializeInputBox('register');
				$('.pointing').remove();
				this.input = {
					mobilePhone: this.inputBoxes[0].val(),
					password : this.inputBoxes[1].val(),
					pwConfirmation: this.inputBoxes[2].val()
				}
				this.user.set(this.input);
				if( true || this.user.isValid(_.omit(['mobilePhone','password','pwConfirmation']) )){
					accountApp.session.register(
						{
							mobilePhoneNumber: this.inputBoxes[0].val(),
							password:this.inputBoxes[1].val()
						}
						,{
							success: function(mod,res){
								if(DEBUG) console.log('SUCCESS',mod,res);
						  	},error:function(err){
						  		if(DEBUG) console.log('ERROR',err);
						  	}

						});
				}else{
					console.log('user validation error');
					return false;
				}
			},

 			render: function () {

			},
			initializeInputBox: function(method){

				if(method === 'login'){
					this.inputBoxes = [$('input[name='+Common.loginFormAttr[0]+']'),
									   $('input[name='+Common.loginFormAttr[1]+']')];
				
				}else if(method === 'register'){
					this.inputBoxes = [$('input[name='+Common.registerFormAttr[0]+']'),
									   $('input[name='+Common.registerFormAttr[1]+']'),
									   $('input[name='+Common.registerFormAttr[2]+']')];
				}else if(method === 'captcha'){
					this.inputBoxes = [$('input[name='+Common.registerFormAttr[3]+']')];
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