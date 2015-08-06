require("cloud/app.js");
var http = require('http');
var request = require('request');
var querystring = require('querystring');
var mutil = require('cloud/mutil.js');
var mloan = require('cloud/mloan.js');
var mcontact = require('cloud/mcontact.js');
var mconfig = require('cloud/mconfig.js');
var mlog = require('cloud/mlog.js');
var moment = require('moment');
var _ = require('underscore');

var PRJ_TYPE = {
  'LOAN': 'LOAN',
  'BORROW': 'BORROW'
};

AV.Cloud.define("Sms", function(request, response){
  var startDate = (new moment(new Date())).subtract('5', 'days').startOf('day').toDate();
  var endDate = (new moment(new Date())).add('5', 'days').endOf('day').toDate();
  var loanQuery = new AV.Query('Loan');
  loanQuery.equalTo('projectClass', PRJ_TYPE.LOAN);
  loanQuery.equalTo('status', mconfig.loanStatus.paying.value);
  var query = new AV.Query('LoanPayBack');
  query.greaterThanOrEqualTo('payDate', startDate);
  query.lessThanOrEqualTo('payDate', endDate);
  query.include(['loan.loaner','loan.owner']);
  query.matchesQuery('loan', loanQuery);
  var now = new moment();
  var offsets = [5,3,1,-1]; //需要发短信的天数
  query.find().then(function(lst){
    var messageList = [];
    for (var i = 0; i < lst.length; i++) {
      var pb = lst[i];
      var pDate = new moment(pb.get('payDate'));
      var dayOffset = Math.round(pDate.diff(now,'days',true));
      if(_.contains(offsets,dayOffset)){
        console.log(dayOffset);
        console.log(now.format());
        console.log(pDate.format());
        messageList.push(concretePayBack(pb, pb.get('loan'), 0));
      }
    };
    response.success('success');
  });
      计算每次需要还的钱
      var message = {
        'template':'payback',
        'mobilePhoneNumber':'18516171260',
        'username': 'guo',
        'now': '2015-08-02',
        'day': '1',
        'money': '1000.00',
        'mobile': '18516171260',
        'company': '昆山贷款',
        'loaner': '郭意亮'
      };
      AV.Cloud.requestSmsCode(message).then(function(){
        response.success("success");
      }, function(err){
        response.success("fail!");
      });
   
});

function concretePayBack(lpb, loan, overdueMoney) {
  var result = {};
  result['username'] =  loan.get('loaner').get('name');
  if(!loan.get('loaner').get('mobilePhoneNumber')){
    return null;
  }
  result['mobile'] = loan.get('owner').get('mobilePhoneNumber');
  if(loan.get('owner').get('infoObject')){
    result['loaner'] = loan.get('owner').get('infoObject')['name'];
  }else{
    result['loaner'] = '信贷员';
  }
  result['mobilePhoneNumber'] =  loan.get('loaner').get('mobilePhoneNumber');
  result['payDate'] = lpb.get('payDate'); //应还日期
  result['payBackMoney'] = lpb.get('payBackMoney') || 0; //已还的金额
  result['money'] = lpb.get('payMoney') - result['payBackMoney'];
  return result;
};



