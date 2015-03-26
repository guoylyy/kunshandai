// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();


var _ = require('underscore');
var fs = require('fs');
var _s = require('underscore.string');
var avosExpressHttpsRedirect = require('avos-express-https-redirect');
var avosExpressCookieSession = require('avos-express-cookie-session');

// App 全局配置
if (__production) {
    app.set('views', 'cloud/views');    
} else {
    app.set('views', 'cloud/views');
}

app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(avosExpressHttpsRedirect());
app.use(express.bodyParser());    // 读取请求 body 的中间件

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});


/*
	登录相关
 */
app.get('/login', function(req, res){
	res.render('login.ejs');
});

app.post('/login', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	AV.User.logIn(username, password,{
		success:function(user){
			console.log('user');
		},
		error:function(user, error){
			console.log('error');
		}
	});
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
  if (username && password && email) {
      var user = new AV.User();
      user.set('username', username);
      user.set('password', password);
      user.set('email', email);
      user.signUp({
        success: function(user) {
          console.log('success');
        },
        error: function(user, error) {
          console.log('error');
        }
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