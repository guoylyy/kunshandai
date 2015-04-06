define([
    'backbone',
    'accountApp'
], function(Backbone,accountApp){

    var User = Backbone.Model.extend({

        initialize: function(){
            // _.bindAll(this);
        },

        defaults: {
            id: 0,
            telphone: '',
            username: '',
            email: ''
        },

        url: function(){

            return accountApp.API + '/user';
        }

    });
    
    return User;
});