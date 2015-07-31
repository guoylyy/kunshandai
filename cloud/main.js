var http = require('http');
var request = require('request');
var querystring = require('querystring');
require("cloud/app.js");


AV.Cloud.define("Email", function(request, response){
 
  var LoanPayBack = AV.Object.extend('LoanPayBack');
  var query = new AV.Query('LoanPayBack');
  query.find({
    success: function(lst){
      //调用还款发送短信和邮件
      // for (var i = 0; i < lst.length; i++) {
        //var pb = lst[i]; //每一个还款任务
        //如果还款任务符合发送短信条件，那么发送
        //如果还款任务符合发送邮件条件，那么发送
      // };
      AV.Cloud.requestSmsCode('18516171260').then(function(){
        response.success("success");
      }, function(err){
        response.success("fail!");
      });
    },
    error: function(error){
      response.success("Hello world!");
    }
  });
});

