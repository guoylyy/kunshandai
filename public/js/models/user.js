define([
    'underscore',
    'backbone',
    'accountApp'
], function(_, Backbone,accountApp){

    var User = Backbone.Model.extend({

        validation:{
            mobilePhone:[{
                    required: true,
                    msg:'请填写手机号'
            },
            {
                    pattern: /^\d{11}$/,
                    msg:'请填写11位手机号'
            }],
            password:{
                required:true,
                msg:'请填写密码'
            },
            pwConfirmation:{
                equalTo:'password',
                msg:'两次密码不一致'
            },
            mpCaptcha:{
                required:true,
                msg:'请输入验证码'
            }
        },

        defaults: {
            id: 0,
            telephone: '',
            password: ''
        }

    });
    
    return User;
});