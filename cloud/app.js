// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();
var ejs = require('ejs');
var expressValidator = require('express-validator');
var Mailgun = require('mailgun').Mailgun;
var util = require('util');
var expressLayouts = require('express-ejs-layouts');
var moment = require('moment');
var _ = require('underscore');
var fs = require('fs');
var avosExpressHttpsRedirect = require('avos-express-https-redirect');
var crypto = require('crypto');
var avosExpressCookieSession = require('avos-express-cookie-session');

var mutil = require('cloud/mutil.js');
var account = require('cloud/account.js');
var config = require('cloud/config.js');
var _s = require('underscore.string');

// App 全局配置
if (config.__production) {
    app.set('views', 'cloud/views');    
} else {
    app.set('views', 'cloud/views');
}
app.use(express.bodyParser());        // 读取请求body的中间件
app.use(expressValidator);
app.use(avosExpressHttpsRedirect());
app.use(express.cookieParser(config.cookieParserSalt)); //还不明白是干什么的
app.use(avosExpressCookieSession({    //设置 cookie
    cookie: { 
        maxAge: 3600000 
    }, 
    fetchUser: true
}));
app.use(expressLayouts);
app.use(app.router);

app.get('/home',function(req, res){
  //console.log(account.isLogin());
  if(account.isLogin()){
    res.redirect('/index');
  }else{
    res.redirect('/login');
  }
});

app.get('/index',function(req, res){
  res.render('loan_search.ejs');
});

/*
	登录相关 routes
 */
app.get('/login', function(req, res){
	res.render('login.ejs');
});

app.get('/logout', function(req, res){
  AV.User.logOut();
  res.redirect('/home');
});

app.post('/login', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  AV.User.logIn(username, password,{
    success:function(user){
      res.redirect('/home');
    },
    error:function(user, error){
      res.redirect('/login');
    }
  });
});

app.get('/isLogin', function(req, res){
  res.json(account.isLogin()); //返回用户对象
});

/**
 * 注册用户相关 
 */
app.get('/register', function (req, res) {
	res.render('register.ejs');
});

//注册过后会发送一条短信给该注册用户
app.post('/register', function (req, res) {
  // req.assert('mobilePhoneNumber', 'A valid email is required').notEmpty();
  // var errors = req.validationErrors();
  //console.log(errors);
  var mobilePhoneNumber = req.body.mobilePhoneNumber;
  var password = req.body.password;
  console.log(mobilePhoneNumber);
  if (password && mobilePhoneNumber) {
      var user = new AV.User();
      user.set('password', password);
      user.set('username', mobilePhoneNumber);
      user.set('mobilePhoneNumber', mobilePhoneNumber);
      user.signUp(null).then(function(user){
        res.json(user);
      },function(error){
        console.log(error);
        res.json(error);
      });
  } else {
      mutil.renderError(res, '不能为空');
  }
});

//发送手机验证码
app.get('/requestMobilePhoneVerify', function (req, res){
  var mobilePhoneNumber = req.query.mobilePhoneNumber;
  AV.User.requestMobilePhoneVerify(mobilePhoneNumber).then(function(){
    res.json({result:'success'});
  },mutil.renderErrorFn(res));
});

//验证用户手机收到的验证码
app.post('/verifyUserMobilePhoneNumber', function (req, res){
  var code = req.body.code;
  console.log(code);
  AV.User.verifyMobilePhone(code).then(function(){
    res.json({result:'success'});
  },mutil.renderErrorFn(res));
});

//
app.get('/requestEmailVerify', function (req, res){
  var email = req.query.email;
  AV.User.requestEmailVerfiy(email).then(function () {
        mutil.renderInfo(res, '邮件已发送请查收。');
    }, mutil.renderErrorFn(res));
});

/*
	新建项目
 */
app.get('/loan/create_contract', function(req, res){
  res.render('create_contract.ejs');
});

app.get('/loan/create_loan', function (req, res){
  res.render('create_loan.ejs');
});



/*
	分条件查看项目列表
 */



/*
	查看联系人列表
 */


/*
	查看个人主页
 */


// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen({"static": {maxAge: 604800000}});