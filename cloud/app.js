/**
 * [express description]
 * @author globit
 * @email  yiliangg@foxmail.com
 * @version [v1]
 */
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
var mloan = require('cloud/mloan.js');
var mcontract = require('cloud/mcontract.js');
var account = require('cloud/account.js');
var config = require('cloud/config.js');
var _s = require('underscore.string');

// App 全局配置
if (__production) {
    app.set('views', 'cloud/views');    
} else {
    app.set('views', 'cloud/views');
}
// app.set('views', 'app/angular/account');
// app.engine('.html', ejs.renderFile);
app.set('view engine', 'ejs');        //将渲染引擎设为html
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
app.use(express.static('app'));  //设置app为静态目录
/**
 * 主页路由器,用于渲染前端框架入口页面
 */
app.get('/home',function(req, res){
  if(account.isLogin()){
    res.redirect('/index');
  }else{
    res.redirect('/login');
  }
});

app.get('/index',function(req, res){
  res.render('guest_layout.ejs');
});
app.get('/login', function(req, res){
  res.render('account.ejs');
});
app.get('/signup', function(req, res){
  res.render('account.ejs');
});
app.get('/manage', function(req, res){
  res.render('manage.ejs');
});

/***************************************************
 * 账号相关的操作
 * 已完成
 * 1. 登录 登出 是否登录
 * 2. 注册 手机验证码 邮箱验证
 * TODO:
 * 1. 完善用户资料
 * 2. 获取用户资料
 * 3. 头像更新
 * 4. 修改密码
 **************************************************/
app.get(config.baseUrl +'/account/logout', function(req, res){
  AV.User.logOut();
  mutil.renderSuccess(res);
});
app.post(config.baseUrl +'/account/login', function(req, res){
  var username = req.body.mobilePhoneNumber;
  var password = req.body.password;
  if(account.isLogin()){
    AV.User.logOut();
  }
  AV.User.logIn(username, password,{
      success:function(user){
        res.json(user);
      },
      error:function(user, error){
        mutil.renderError(res, error);
      }
  });
});
app.get(config.baseUrl + '/account/isLogin', function(req, res){
  account.isLogin() ? res.json(account.isLogin()):mutil.renderResult(res, false, 210);
});
app.post(config.baseUrl + '/account/register', function (req, res) {
  if(account.isLogin()){
    AV.User.logOut();
  }
  var mobilePhoneNumber = req.body.mobilePhoneNumber;
  var password = req.body.password;
  var user = new AV.User();
  user.set('password', password);
  user.set('username', mobilePhoneNumber);
  user.set('mobilePhoneNumber', mobilePhoneNumber);
  user.signUp(null).then(function(user){
    res.json(user); //注册过后会发送一条短信给该注册用户, leancloud 后台配置
  },function(error){
    mutil.renderError(res, error);
  });
});
//发送手机验证码
app.get(config.baseUrl + '/account/requestMobilePhoneVerify', function (req, res){
  var mobilePhoneNumber = req.query.mobilePhoneNumber;
  AV.User.requestMobilePhoneVerify(mobilePhoneNumber).then(function(){
    mutil.renderSuccess(res);
  }, function(error){
      mutil.renderError(res, error);
  });
});
//验证用户手机收到的验证码
app.post(config.baseUrl + '/account/verifyUserMobilePhoneNumber', function (req, res){
  var code = req.body.code;
  console.log(code);
  AV.User.verifyMobilePhone(code).then(function(){
    mutil.renderSuccess(res);
  },function(error){
    mutil.renderError(res, error);
  });
});
//发送验证邮件
app.get(config.baseUrl + '/account/requestEmailVerify', function (req, res){
  var email = req.query.email;
  AV.User.requestEmailVerfiy(email).then(function () {
      mutil.renderSuccess(res);
    }, function(error){
      mutil.renderError(res, error);
  });
});

/*
	新建一个贷款项目
 */
app.post(config.baseUrl +'/loan/create_loan', function (req, res){
  var loan = mloan.createBasicLoan(req.body);
  loan.save().then(function(r_loan){
    mutil.renderData(res, r_loan);
  }, function(error){
    mutil.renderError(res, error);
  });
});

//存储借款人和贷款人信息
app.post(config.baseUrl +'/loan/create_contract', function (req, res){
  var loaner = mcontract.createContract(req.body.loaner);
  var resultMap = {};
  loaner.save().then(function(r_loaner){
    resultMap['loanerId'] = r_loaner.id;
    if(req.body.loaner.attachments){
      mcontract.bindContractFiles(r_loaner, req.body.loaner.attachments);
    }
  },function(error){
    mutil.renderError(res, error);
  }).then(function(){
    if(req.body.assurer){
      var assurer = mcontract.createContract(req.body.assurer);
      assurer.save().then(function(r_assurer){
        resultMap['assurerId'] = r_assurer.id;
        mcontract.bindContractFiles(r_assurer, req.body.loaner.attachments);
        mutil.renderData(res,resultMap);
      },function(error){
        mutil.renderError(res,error);
      });
    }else{
      resultMap['assurerId'] = null;
      mutil.renderData(res, resultMap);
    }
  });
});

//完善一个项目并生成还款记录
//此时是确认了要生成一个项目
app.post(config.baseUrl + '/loan/generate_loan', function (req, res){

});

//获取未完成的项目列表,分页
//app.get();

app.post(config.baseUrl + '/attachment', function (req, res){
  saveFileThen(req, function(attachment){
    if(attachment){
      mutil.renderData(res, {metaData:attachment.metaData(), id:attachment.id, url:attachment.url(),
        name:attachment.name()});
    }else{
      mutil.renderError(res, {code:400, message:'上传失败'});
    }
  });
});

function saveFileThen(req, f) {
    if (req.files == null) {
        f();
        return;
    }
    var attachmentFile = req.files.attachment;
    if (attachmentFile && attachmentFile.name !== '') {
        fs.readFile(attachmentFile.path, function (err, data) {
            if (err) {
                return f();
            }
            //var base64Data = data.toString('base64');
            var theFile = new AV.File(attachmentFile.name, data);
            theFile.save().then(function (theFile) {
                f(theFile);
            }, function (err) {
                f();
            });
        });
    } else {
        f();
    }
}

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