define([
    'underscore',
    'backbone',
    'accountApp'
], function(_, Backbone,accountApp){

    var User = Backbone.Model.extend({

        validation:{
            telephone:[{
                    required: true,
                    msg:'请填写手机号'
            },
            {
                    pattern: /^d{11}$/,
                    msg:'请填写11位手机号'
            }],
            password:{
                required:true,
                msg:'请填写密码'
            },
            passwordConfirmation:{
                equalTo:'password',
                msg:'两次密码不一致'
            },
            telephone_verifycode:{
                required:true,
                msg:'验证码错误'
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