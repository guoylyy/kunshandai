var Loan = AV.Object.extend('Loan');
var LoanPayBack = AV.Object.extend('LoanPayBack'); //收入列表
var LoanRecord = AV.Object.extend('LoanRecord'); //支出列表
var util = require('util');
var moment = require('moment');
var mlog = require('cloud/mlog.js');
var mutil = require('cloud/mutil.js');
var mconfig = require('cloud/mconfig.js');


/*
 * 针对首次放款的工厂类
 */
var loanRecordFactory = {};
function calculateOutMoney(loan, interestsMoney, lr){
    var outMoney = loan.amount - interestsMoney - loan.keepCost - loan.assureCost -
           loan.serviceCost - loan.otherCost;
    lr.set('interestsMoney', -interestsMoney);
    lr.set('keepCost', -loan.keepCost);
    lr.set('assureCost', -loan.assureCost);
    lr.set('serviceCost', -loan.serviceCost);
    lr.set('otherCost', -loan.otherCost);
    lr.set('outMoney', outMoney);
    lr.set('order',0); //标记为首次放款
    return lr;
};

loanRecordFactory.debx = function(loan){
    console.log(loan.payWay);
    return null;
};
/**
 * 先息后本放款计算
 * @process
 *     放款期扣除所有利息以及其他费用，余额为放款金额
 */
loanRecordFactory.xxhb = function(loan){
    var loanRecord = new AV.Object('LoanRecord');
    var interestsMoney = loan.amount * loan.payTotalCircle * loan.interests;
    calculateOutMoney(loan, interestsMoney, loanRecord);
    return loanRecord;
};
loanRecordFactory.factory = function(loan){
    return new loanRecordFactory[loan.get('payWay')](loan.attributes);
};
/* End of 放款的工厂类 */


/****************************
 * 针对还款的工厂类
 */
var loanPayBackFactory = {};
loanPayBackFactory.xxhb = function(loan){
    var loanPayBack = new AV.Object('LoanPayBack');
    var outMoney = loan.amount;
    var d = moment(loan.firstPayDate).add(loan.payTotalCircle,'month').format();
    loanPayBack.set('payDate',d);
    loanPayBack.set('payMoney',outMoney);
    loanPayBack.set('status',mconfig.loanPayBackStatus.paying.value);
    return loanPayBack;
};
loanPayBackFactory.debx = function(loan){
    var loanPayBack = new AV.Object('LoanPayBack');  
};
loanPayBackFactory.factory = function(loan){
    return new loanPayBackFactory[loan.get('payWay')](loan.attributes);
};
/* End of 还款的工厂类 */


/*
 * 以下是暴露给外部的访问的方法
 */
function calculateLoanRecord(loan){
    var lr = loanRecordFactory.factory(loan);
    return lr;
}
//各种不同类型的
function calculatePayBackMoney(loan){
    var lpb = loanPayBackFactory.factory(loan);
    return lpb
}
function createBasicLoan(reqBody, u){
    //var loan = new Loan();
    var loan = new AV.Object('Loan');
    loan.set('owner',u);

    loan.set('loanType', reqBody.loanType); //TODO: check is this in dict or not
    
    loan.set('amount', reqBody.amount);
    loan.set('spanMonth', reqBody.spanMonth);
    loan.set('startDate', mutil.wrapperStrToDate(reqBody.startDate)); //合同相关
    loan.set('endDate', mutil.wrapperStrToDate(reqBody.endDate)); //合同相关
    loan.set('payCircle', reqBody.payCircle); //还款周期
    loan.set('payTotalCircle', reqBody.payTotalCircle); //还款总周期: 应该计算
    loan.set('interests', reqBody.interests);
    loan.set('assureCost', reqBody.assureCost);
    loan.set('serviceCost', reqBody.serviceCost);
    loan.set('overdueCostPercent', reqBody.overdueCostPercent);
    loan.set('otherCost', reqBody.otherCost);
    loan.set('keepCost', reqBody.keepCost);
    loan.set('payWay', reqBody.payWay);
    //放款时间
    //根据还款类型确认初次放款日期
    loan.set('firstPayDate', mutil.wrapperStrToDate(reqBody.firstPayDate));

    loan.set('status', mconfig.loanStatus.draft.value);
    return loan;
}

exports.createBasicLoan=createBasicLoan;
exports.calculateLoanRecord=calculateLoanRecord;
exports.calculatePayBackMoney=calculatePayBackMoney;