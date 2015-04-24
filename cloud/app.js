/**
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
var mcontact = require('cloud/mcontact.js');
var mconfig = require('cloud/mconfig.js');
var mlog = require('cloud/mlog.js');
var account = require('cloud/account.js');
var config = require('cloud/config.js');
var _s = require('underscore.string');

var LoanRecord = AV.Object.extend('LoanRecord');
var LoanPayBack = AV.Object.extend('LoanPayBack');

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
app.use(express.static('public'));  //public
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
app.get('/createLoan', function(req, res){
  res.render('create_loan.ejs');
});

/***************************************************
 * 账号相关的操作
 * 已完成
 * 1. 登录 登出 是否登录
 * 2. 注册 手机验证码 邮箱验证
 * TODO:
 * 1. 更新用户资料
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

//如果用户已登录，返回用户信息
app.get(config.baseUrl + '/account/isLogin', function(req, res){
  account.isLogin() ? res.json(account.isLogin()):mutil.renderResult(res, false, 210);
});

//注册
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
  var u = check_login();
  var mobilePhoneNumber = u.get('mobilePhoneNumber');
  AV.User.requestMobilePhoneVerify(mobilePhoneNumber).then(function(){
    mutil.renderSuccess(res);
  }, function(error){
      mutil.renderError(res, error);
  });
});

//验证用户手机收到的验证码
//issue:输入错误的也返回200
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

app.put(config.baseUrl + '/account/:id', function (req, res){
  mutil.renderSuccess(res);
});

/**********************************************
 * 贷款项目相关操作
 */
app.get(config.baseUrl + '/loan/:id', function (req, res){
  var u = check_login(res);
  var query = new AV.Query('Loan');
  query.equalTo('owner', u);
  query.equalTo('objectId', req.params.id);
  query.include('loaner');
  query.include('assurer');
  query.find().then(function(data){
    if(data.length !=1){
      mutil.renderError(res, {code:404, message:'找不到对象!'});
    }
    mutil.renderData(res,transformLoanDetails(data[0]));
  },function(error){
    mutil.renderError(res, error);
  });
});

app.put(config.baseUrl + '/loan/:id', function (req, res){
  var u = check_login(res);
  var loan = AV.Object.createWithoutData('Loan', req.params.id);
  loan.fetch().then(function(l){
    if(!l || l.get('status')==undefined){
      mutil.renderError(res, {code:404, message:'找不到对象!'});
    }else{
      if(l.get('status') != mconfig.loanStatus.draft.value){
        mutil.renderError(res,{code:400, message:'项目已进入还款阶段，不可更新！'});
      }else{
        n_loan = mloan.updateLoan(l, req.body);
        n_loan.save().then(function(nloan){
          mutil.renderData(res, transformLoanDetails(nloan));
        },function(error){
          mutil.renderError(res, error);
        });
      }
    }
  }, function(error){
    mutil.renderError(res, error);
  });
});

app.get(config.baseUrl + '/loan/:id/payments', function (req, res){
  var u = check_login(res);
  var loan = AV.Object.createWithoutData('Loan', req.params.id);
  loan.fetch().then(function(l){
    if(!l || l.get('status')==undefined){
      mutil.renderError(res, {code:404, message:'找不到对象!'});
    }else{
     var query = l.relation("loanRecords").query();
     query.find({
       success: function(list){
         mutil.renderData(res,list);
       },
       error: function(error){
         mutil.renderError(res, error);    
       }
     });
    }
  },function(error){
    mutil.renderError(res, error);
  });
});

app.get(config.baseUrl + '/loan/:id/paybacks', function (req, res){
  var u = check_login(res);
  var loan = AV.Object.createWithoutData('Loan', req.params.id);
  loan.fetch().then(function(l){
    if(!l || l.get('status')==undefined){
      mutil.renderError(res, {code:404, message:'找不到对象!'});
    }else{
      var query = l.relation("loanPayBacks").query();
      query.find({
        success: function(list){
          mutil.renderData(res,list);
        },
        error: function(error){
          mutil.renderError(res, error);    
        }
      });
    }
  },function(error){
    mutil.renderError(res, error);
  });
});

//新建一个贷款项目
app.post(config.baseUrl +'/loan/create_loan', function (req, res){
  var u = check_login(res);
  var loan = mloan.createBasicLoan(req.body, u);
  loan.save().then(function(r_loan){
    mutil.renderData(res, transformLoanDetails(r_loan));
  }, function(error){
    mutil.renderError(res, error);
  });
});

//生成项目时候初次记录生成放款
app.post(config.baseUrl + '/loan/generate_bill', function (req, res){
  var u = check_login(res);
  var loanId = req.body.loanId;
  var loanerId = req.body.loanerId;
  var assurerId = req.body.assurerId;
  var loan = AV.Object.createWithoutData('Loan',loanId);
  var loaner = AV.Object.createWithoutData('Contact',loanerId);
  var assurer = AV.Object.createWithoutData('Contact',assurerId);
  loan.fetch().then(function(floan){
    if(floan.get('status') == undefined){
      mutil.renderError(res, {code:404, message:'找不到对象!'});
    }else{
      //判断是否已经有放款记录,如果有删除掉
      if(assurer){
        floan.set('assurer',assurer);
      }
      if(loaner){
        if(floan.attributes.status != mconfig.loanStatus.draft.value){
          mutil.renderError(res,{code:400, message:"项目已经处于还款状态!"});
        }else{
          floan.set('loaner',assurer);
          var query = floan.relation("loanRecords").query();
          query.destroyAll().then(function(){
            generateLoanRecord(floan,res);
          });
        }
      }else{
        mutil.renderError(res,{code:400, message:"贷款人缺失！"});
      }
    }
  });
});

function generateLoanRecord(floan, res){
  var lr = mloan.calculateLoanRecord(floan);//生成放款记录
  lr.save().then(function(rlr){
    var lrRelation = floan.relation('loanRecords');
    lrRelation.add(rlr);
    floan.save().then(function(data){
      mutil.renderData(res,{
        loanId: transformLoan(floan),
        loanRecord: rlr
      });
    },function(error){
      mutil.renderError(res, error);
    });
  },
    function(error){
      mutil.renderError(res,{code:400, message:'生成放款记录失败!'});
  });
};

//确认放款，进入还款阶段
app.post(config.baseUrl + '/loan/assure_bill', function (req, res){
  var u = check_login(res);
  var loanId = req.body.loanId;
  //todo: 把放款日期改一下
  //生成放款记录
  var loan = AV.Object.createWithoutData('Loan', loanId);
  loan.fetch().then(function(floan){
    if(floan.get('status') == undefined){
      mutil.renderError(res, {code:404, message:'找不到对象!'});
    }else{
      if(floan.attributes.status != mconfig.loanStatus.draft.value){
          mutil.renderError(res,{code:400, message:"项目已经处于还款状态!"});
      }else{
      mlog.log('正在生成还款任务');
      var loanPayBacks = mloan.calculatePayBackMoney(floan);
      mlog.log('开始存储还款任务');
      LoanPayBack.saveAll(loanPayBacks,{
        success: function(lpbs){
          var lpbRelation = floan.relation('loanPayBacks');
          lpbRelation.add(loanPayBacks);
          floan.set('status',mconfig.loanStatus.paying.value);
          floan.save().then(function(data){
              res.redirect(config.baseUrl + '/loan/' + data.id);
            },function(error){
            mutil.renderError(res,error);
          });  
        },
        error: function(error){
          mutil.renderError(res,error);
        }
      });
      }
    }
  });
});

/*******************************************
* 项目查询相关接口
* 已完成:
*   1. 分页列出所有项目（不包括草稿项目)
*   2. 分页列出草稿项目
*******************************************/
app.get(config.baseUrl + '/loan/all/:pn', function (req, res){
  var u = check_login(res);
  var pageNumber = req.params.pn;
  var query = new AV.Query('Loan');
  query.include('loaner');
  query.include('assurer');
  query.notEqualTo('status', mconfig.loanStatus.draft.value);
  query.equalTo('owner', u);
  listLoan(res, query, pageNumber);
});

app.get(config.baseUrl + '/loan/draft/:pn', function (req, res){
  var u = check_login(res);
  var pageNumber = req.params.pn;
  var query = new AV.Query('Loan');
  query.include('loaner');
  query.include('assurer');
  query.equalTo('status', mconfig.loanStatus.draft.value);
  query.equalTo('owner', u);
  listLoan(res, query, pageNumber);
});

//按条件分页列出项目当前还款情况
//目前列出还款金额是以当日为节点计算需要还款的金额
app.get(config.baseUrl + '/loan/payBack/list/:pn', function (req, res){
  var pageNumber = req.params.pn;
  var u = check_login(res);
  
  //过滤条件设置
  var loanQuery = new AV.Query('Loan');
  loanQuery.equalTo('owner', u);
  if(req.query.loanType)
    loanQuery.equalTo('loanType', req.query.loanType); //贷款抵押类型过滤
  var query = new AV.Query('LoanPayBack');
  query.greaterThanOrEqualTo('payDate',req.query.startDate); 
  query.lessThanOrEqualTo('payDate', req.query.endDate);
  query.equalTo('status', parseInt(req.query.status)); //贷款状态过滤
  query.include('loan');
  query.matchesQuery('loan', loanQuery);

  var totalPageNum = 1;
  var resultsMap = {};
  query.count().then(function(count){
    totalPageNum = parseInt(count / mconfig.pageSize) + 1;
    resultsMap['totalPageNum'] = totalPageNum;
    resultsMap['totalNum'] = count;
    resultsMap['pageSize'] = mconfig.pageSize;
  }).then(function(){
      if(pageNumber > resultsMap.totalPageNum){
        resultsMap['values'] = [];
        mutil.renderData(res, resultsMap);
      }else{
        query.skip(pageNumber*mconfig.pageSize - mconfig.pageSize);
        query.find({
          success: function(lpbList){
            var fList = [];
            for (var i = 0; i < lpbList.length; i++) {
              fList.push(concretePayBack(lpbList[i], lpbList[i].get('loan')));
            };
            resultsMap['values'] = fList;
            mutil.renderData(res, resultsMap);
          },
          error: function(error){
            mutil.renderError(res, error);
          }
        });
      }
  });
}); 

//还款:不能还最后一期
app.post(config.baseUrl + '/loan/payBack/:id', function (req, res){
  var payBackId = req.params.id;
  var loanPayBack = AV.Object.createWithoutData('LoanPayBack', payBackId);
  loanPayBack.fetch().then(function(p){
    var l = p.get('loan');
    l.fetch().then(function(loan){
      if(p.get('order') == loan.get('payTotalCircle')){
        mutil.renderError(res, {code:500, message:'这是最后一期还款，请跳转到结清'});
      }else{
        p.set('payBackMoney', req.body.payBackMoney);
        p.set('payBackDate', new Date(req.body.payBackDate));
        p.set('status',mconfig.loanPayBackStatus.completed.value);
        p.save().then(function(np){
          var query = new AV.Query('LoanPayBack');
          query.equalTo('order', p.get('order') + 1);
          query.equalTo('loan', p.get('loan'));
          query.find({
            success:function(pbs){
              if(pbs.length == 1){
                var pb = pbs[0];
                pb.set('status', mconfig.loanPayBackStatus.paying.value);
                pb.save().then(function(npb){
                  mutil.renderData(res, concretePayBack(pb, loan));
                });
              }else if(pbs.length==0 && p.get('order') > 0){
                mutil.renderSuccess(res);
              }else{
                mutil.renderError(res, {code:500, message:'内部错误!'});
              }
            },
            error: function(error){
              mutil.renderError(res, error);
            }
          });
        });
      }
    });
  },
  function(error){
    mutil.renderError(res, error);
  });

});

//结清账单生成
app.post(config.baseUrl + '/loan/:id/finish', function (req, res){

});

//结清


//项目调整
//流程 结清当前项目 + 生成一个新项目
function concretePayBack(lpb, loan){
  var result = {};
  console.log(loan);
  result['loanObjectId'] = loan.id;
  result['payObjectId'] = lpb.id;
  result['payTotalCircle'] = loan.get('payTotalCircle');
  result['payCurrCircle'] = lpb.get('order');
  result['payDate'] = lpb.get('payDate');
  result['amount'] = loan.get('amount');
  //应收金额 = 按时还款金额 + 违约金:以当日为节点计算
  var overdueMoney = 0;
  result['payMoney'] = lpb.get('payMoney') + overdueMoney;
  return result;
};




//需要根据最近的还款周期列出项目，这个需要反向生成
function listLoan(res, query, pageNumber){
  var totalPageNum = 1;
  var resultsMap = {};
  query.count().then(function(count){
    totalPageNum = parseInt(count / mconfig.pageSize) + 1;
    resultsMap['totalPageNum'] = totalPageNum;
    resultsMap['totalNum'] = count;
    resultsMap['pageSize'] = mconfig.pageSize;
  }).then(function(){
      if(pageNumber > resultsMap.totalPageNum){
        resultsMap['values'] = [];
        mutil.renderData(res, resultsMap);
      }else{
        query.skip(pageNumber*mconfig.pageSize - mconfig.pageSize);
        query.find({
          success: function(results){
            var rlist = [];
            for (var i = 0; i < results.length; i++) {
              rlist.push(transformLoan(results[i]));
            };
            resultsMap['values'] = rlist;
            mutil.renderData(res, resultsMap);
          },
          error: function(error){
            mutil.renderError(res, error);
          }
        });
      }
  });
};


/*****************************************
 * 联系人相关接口
 * 已完成:
 *  1. 新建联系人
 *  2. 列出登录用户的联系人
 *  3. 更新,查询和删除单个联系人
 *  4. 根据证件号查询联系人
 */
app.post(config.baseUrl + '/contact', function(req, res){
  var u = check_login(res);
  var contact = mcontact.createContact(req.body, u);
  contact.save().then(function(r_contact){
    if(req.body.attachments){
      mcontact.bindContactFiles(r_contact, req.body.attachments);
    }
    mutil.renderData(res, r_contact);
  },function(error){
    mutil.renderError(res, error);
  })
});

/*更新联系人*/
app.put(config.baseUrl + '/contact/:id', function (req, res){
  var u = check_login(res);
  var contact = AV.Object.createWithoutData('Contact',req.params.id);
  contact.fetch().then(function(rc){
    if(rc.get('certificateNum') == undefined){
      mutil.renderError(res, {code:404, message:'找不到对象!'});
    }else{
      n_contact = mcontact.updateContact(rc, req.body);
      n_contact.save().then(function(rnc){
        mutil.renderData(res, rnc);
      }, function(error){
      mutil.renderError(res,error);
      });
    };
  },function(error){
    mutil.renderError(res,error);
  });
});

app.get(config.baseUrl + '/contact/:id', function (req, res){
  var u = check_login(res);
  var query = new AV.Query('Contact');
  query.equalTo("owner",u);
  query.equalTo("objectId",req.params.id);
  query.find({
    success: function(contact){
      if(contact.certificateNum ){
        mutil.renderData(res, contact);
      }else{
        mutil.renderError(res, {code:404, message:'contact not found'});
      }
    },
    error: function(error){
      mutil.renderError(res, error);
    }
  });
});

//如果身份证或者驾驶证存在，就返回该用户的联系人
app.get(config.baseUrl + '/contact/certificate/:certificateNum', function (req, res){
  var u = check_login(res);
  var certificateNum = req.params.certificateNum;
  var query = new AV.Query('Contact');
  query.equalTo("certificateNum",certificateNum);
  query.equalTo("owner",u);
  query.find({
    success: function(results){
      if(results.length==0){
        mutil.renderError(res,{code:404, message:'contact not found'});
      }else{
        mutil.renderData(res, results);  
      }
    },
    error: function(error){
      mutil.renderError(res, error);
    }
  });
});

//获取一个用户所有联系人
app.get(config.baseUrl + '/contact/all', function (req, res){
  var u = check_login(res);
  var query = new AV.Query('Contact');
  query.equalTo("owner",u);
  query.find({
    success: function(results){
      mutil.renderData(res, results); 
    },
    error: function(error){
      mutil.renderError(res, error);
    }
  });
});

//删除一个联系人
app.delete(config.baseUrl + '/contact/:id', function (req, res){
  var u = check_login(res);
  var query = new AV.Query('Contact');
  query.equalTo("owner",u);
  query.equalTo("objectId",req.params.id);
  query.destroyAll({
    success: function(rc){
      if(rc==undefined){
        mutil.renderError(res, {code:404, message:'contact not found'});
      }else{
        mutil.renderSuccess(res);
      }
    },
    error: function(error){
      mutil.renderError(res, error);
    }
  });
});

/*
  查询字典表
 */
app.get(config.baseUrl + '/dict/:key', function (req, res){
  var key = req.params.key
  var dictData = mconfig.convertDictToList(key);
  if(dictData == null){
    mutil.renderError(res, {code:404, message:'dict not found'});
  }
  mutil.renderData(res, mconfig.convertDictToList(key));
});

//上传文件
app.post(config.baseUrl + '/attachment', function (req, res){
  var fType = req.body.fileType;
  if(!fType){
    fType = null;
  }
  saveFileThen(req, fType, function(attachment){
    if(attachment){
      mutil.renderData(res, {metaData:attachment.metaData(), id:attachment.id, url:attachment.url(),
        name:attachment.name()});
    }else{
      mutil.renderError(res, {code:400, message:'上传失败'});
    };
  });
});
/*
  User defined fuctions
 */
function transformLoan(l){
  var loaner = l.get('loaner');
  var assurer = l.get('assurer');
  if(!loaner){
    loaner = null;
  }
  if(!assurer){
    assurer = null;
  }
  return {
      id: l.id,
      objectId:l.id,
      amount: l.get('amount'),
      createdAt: formatTime(l.createdAt),
      loaner: transformContact(loaner),
      assurer: transformContact(assurer),
      loanType: mconfig.getConfigMapByValue('loanTypes', l.get('loanType')),
      payWay: mconfig.getConfigMapByValue('payBackWays', l.get('payWay')),
      status: mconfig.getConfigMapByValue('loanStatus', l.get('status'))
  };
};
function transformLoanDetails(l){
  var m = transformLoan(l);
  m['spanMonth'] = l.get('spanMonth');
  m['startDate'] = formatTime(l.get('startDate'));
  m['endDate'] = formatTime(l.get('endDate'));
  m['payCircle'] = l.get('payCircle');
  m['payTotalCircle'] = l.get('payTotalCircle');
  m['interests'] = l.get('interests');
  m['assureCost'] = l.get('assureCost');
  m['serviceCost'] = l.get('serviceCost');
  m['overdueCostPercent'] = l.get('overdueCostPercent');
  m['otherCost'] = l.get('otherCost');
  m['keepCost'] = l.get('keepCost');
  m['otherCostDesc'] = l.get('otherCostDesc');
  m['keepCostDesc'] = l.get('keepCostDesc');
  m['firstPayDate'] = formatTime(l.get('firstPayDate'));
  return m;
}

function transformContact(c){
  if(!c){
    return null;
  }
  return {
    id: c.id,
    name: c.get('name'),
    email: c.get('email')
  };
};

function formatTime(t) {
    var date = moment(t).format('YYYY-MM-DD HH:mm:ss');
    return date;
};

//todo: set fileType
function saveFileThen(req, fType, f) {
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
            var theFile = new AV.File(attachmentFile.name, data);
            theFile.metaData('fileType', fType);
            theFile.save().then(function (theFile) {
                f(theFile);
            }, function (err) {
                f();
            });
        });
    } else {
        f();
    }
};

function check_login(res){
  var u = account.isLogin();
  if(u){
    return u;
  }else{
    mutil.renderError(res, {code:501, message:'未登录，请重新登录！'});
  }
};


// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen({"static": {maxAge: 604800000}});