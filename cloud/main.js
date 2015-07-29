var http = require('http');
var request = require('request');
var querystring = require('querystring');
require("cloud/app.js");


AV.Cloud.define("Email", function(request, response){
  //短信配置
  var API_KEY = "924b91cae300188f5d6883598f7bb9e3";
  var postData = querystring.stringify({
    'apikey': API_KEY,
    'mobile': '18516171260',
    'text':'您的验证码是1244。如非本人操作，请忽略。【云片网】'
  });

  console.log(postData);
  var options = {
    hostname: 'yunpian.com',
    port: 80,
    path: '/v1/sms/send.json',
    method:'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      "Content-Length": postData.length
    }
  };
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
      // var req = http.request(options, function(res) {
      //   console.log('STATUS: ' + res.statusCode);
      //   response.success("Got response: " + res.statusCode);
      // });
      // req.on('error', function(e) {
      //   console.log('problem with request: ' + e.message);
      //   response.success("error:");
      // });
      var pd = {
        'apikey': API_KEY,
        'mobile': '18516171260',
        'text':'您的验证码是1244。如非本人操作，请忽略。【云片网】'
      };
      console.log(pd);
      request.post('http://yunpian.com/v1/sms/send.json').form(pd);
      response.success("Got response: ");
    },
    error: function(error){
      response.success("Hello world!");
    }
  });
});

