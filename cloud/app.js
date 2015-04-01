// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();
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
if (__production) {
    app.set('views', 'cloud/views');    
} else {
    app.set('views', 'cloud/views');
}

app.set('view engine', 'ejs');        // 设置template引擎
app.use(avosExpressHttpsRedirect());
app.use(express.bodyParser());        // 读取请求body的中间件
app.use(express.cookieParser(config.cookieParserSalt));
app.use(avosExpressCookieSession({ 
    cookie: { 
        maxAge: 3600000 
    }, 
    fetchUser: true
}));
app.use(expressLayouts);
//app.use(account.clientTokenParser());
app.use(app.router);


var secret_content = 0;

app.get('/',function(req, res){
  console.log(account.isLogin());
  if(account.isLogin()){
    res.redirect('/index');
  }else{
    res.redirect('/login');
  }
});

app.get('/index',function(req, res){
  res.render('index.ejs');
});

/*
	登录相关 routes
 */
app.get('/login', function(req, res){
	res.render('login.ejs');
});

app.post('/login', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	AV.User.logIn(username, password,{
		success:function(user){
      //console.log('success');
      console.log(AV.User.current());
      console.log(account.isLogin());
			res.redirect('/');
		},
		error:function(user, error){
			res.redirect('/login');
		}
	});
});

app.get('/mobilePhoneNumberVerify', function (req, res){
  var code = req.query.code;
  console.log(code);
  AV.User.requestMobilePhoneVerify(code).then(function(){
    console.log('验证码已发送');
  },mutil.renderErrorFn(res));
});

app.get('/requestEmailVerify', function (req, res){
  var email = req.query.email;
  AV.User.requestEmailVerfiy(email).then(function () {
        mutil.renderInfo(res, '邮件已发送请查收。');
    }, mutil.renderErrorFn(res));
});

/*
	注册用户相关
 */
app.get('/register', function (req, res) {
	res.render('register.ejs');
});

app.post('/register', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var mobilePhoneNumber = req.body.mobilePhoneNumber;
  if (username && password && email) {
      var user = new AV.User();
      user.set('username', username);
      user.set('password', password);
      user.set('email', email);
      user.set('mobilePhoneNumber', mobilePhoneNumber);
      user.signUp(null).then(function(user){
        res.render('phone_verify.ejs');
      },function(error){
        res.redirect('/register');
      });
  } else {
      mutil.renderError(res, '不能为空');
  }
});

/*
	新建项目
 */


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