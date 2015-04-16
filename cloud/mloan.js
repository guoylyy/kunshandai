var Loan = AV.Object.extend('Loan');
var LoanPayBack = AV.Object.extend('LoanPayBack'); //收入列表
var LoanRecord = AV.Object.extend('LoanRecord'); //支出列表
var util = require('util');
var moment = require('moment');
var mlog = require('cloud/mlog.js');
var mutil = require('cloud/mutil.js');
var mconfig = require('cloud/mconfig.js');


/*********************************************
 * 针对首次放款的工厂类
 */
var loanRecordFactory = {};
function calculateOutMoney(loan, interestsMoney){
    var lr = new AV.Object('LoanRecord');
    var outMoney = loan.amount - interestsMoney - loan.keepCost - loan.assureCost -
           loan.serviceCost - loan.otherCost;
    //TODO:添加本次放款的时间
    lr.set('interestsMoney', -interestsMoney);
    lr.set('keepCost', -loan.keepCost);
    lr.set('assureCost', -loan.assureCost);
    lr.set('serviceCost', -loan.serviceCost);
    lr.set('otherCost', -loan.otherCost);
    lr.set('outMoney', outMoney);
    lr.set('order',0); //标记为首次放款
    return lr;
};
function getAVLoanRecord(){
    return new AV.Object('LoanRecord');
}
/**
 * 先息后本放款计算
 * @process
 *     放款期扣除所有利息以及其他费用，余额为放款金额
 */
loanRecordFactory.xxhb = function(loan){
    var interestsMoney = loan.amount * loan.payTotalCircle * loan.interests;
    var loanRecord = calculateOutMoney(loan, interestsMoney);
    return loanRecord;
};
/**
 * 等额本息计算
 * @process:
 *       周期初只扣除管理费等费用
 * @param  {[type]} loan [description]
 */
loanRecordFactory.debx = function(loan){
    var interestsMoney = 0; //放款时候扣的利息
    var loanRecord = calculateOutMoney(loan, interestsMoney);
    return loanRecord;
};
/**
 * 周期初息后本放款计算
 * @process:
 * @param  {[type]} loan [description]
 */
loanRecordFactory.zqcxhb = function(loan){
    var interestsMoney = loan.amount * loan.interests * loan.payCircle; //先收第一期的利息
    var loanRecord = calculateOutMoney(loan, interestsMoney);
    return loanRecord;
}
loanRecordFactory.zqmxhb = function(loan){
    var interestsMoney = 0; 
    var loanRecord = calculateOutMoney(loan, interestsMoney);
    return loanRecord;
}
loanRecordFactory.dqhbfx = function(loan){
    var interestsMoney = 0; //放款时候扣的利息
    var loanRecord = calculateOutMoney(loan, interestsMoney);
    return loanRecord;
}
loanRecordFactory.factory = function(loan){
    return new loanRecordFactory[loan.get('payWay')](loan.attributes);
};
/* End of 放款的工厂类 */


/********************************************
 * 针对还款的工厂类, 目前只实现了首次的还款任务生成
 */
function generateLoanPayBack(payMoney, payDate, status){
    var loanPayBack = new AV.Object('LoanPayBack');
    loanPayBack.set('payDate', payDate);
    loanPayBack.set('payMoney', payMoney);
    loanPayBack.set('status', mconfig.loanPayBackStatus.paying.value);
    return loanPayBack;
};
var loanPayBackFactory = {};
loanPayBackFactory.xxhb = function(loan){
    var outMoney = loan.amount;
    var d = moment(loan.firstPayDate).add(loan.payTotalCircle * loan.payCircle,'month').format();
    return generateLoanPayBack(outMoney, d, mconfig.loanPayBackStatus.paying.value);
};
//等额本息需要每月还利息 + 本金 + 逾期违约金
//生成之时预约违约金为 0
loanPayBackFactory.debx = function(loan){
    var baseMoney = loan.amount / loan.payTotalCircle; //每期本金
    var interestsMoney = loan.amount * loan.interests * loan.payCircle;
    var overdueMoney = 0;
    var d = moment(loan.firstPayDate).format();
    return generateLoanPayBack(baseMoney + interestsMoney + overdueMoney, d, mconfig.loanPayBackStatus.paying.value);
};
//周期初还本付息
//期间只收利息
loanPayBackFactory.zqcxhb = function(loan){
    var baseMoney = 0; //每期还本金
    var interestsMoney = loan.amount * loan.interests * loan.payCircle;
    var overdueMoney = 0;
    var d = moment(loan.firstPayDate).add(loan.payCircle,'month').format();
    return generateLoanPayBack(interestsMoney, d, mconfig.loanPayBackStatus.paying.value);
};
//周期末息后本 
loanPayBackFactory.zqmxhb = function(loan){
    var baseMoney = 0; //每期还本金
    var interestsMoney = loan.amount * loan.interests * loan.payCircle;
    var overdueMoney = 0;
    var d = moment(loan.firstPayDate).add(loan.payCircle,'month').format();
    return generateLoanPayBack(interestsMoney, d, mconfig.loanPayBackStatus.paying.value);
};
//到期本息
loanPayBackFactory.dqhbfx = function(loan){
    var baseMoney = loan.amount;
    var d = moment(loan.firstPayDate).add(loan.payCircle * loan.payTotalCircle,'month').format();
    var overdueMoney = 0;
    var interestsMoney = loan.amount* loan.interests * loan.payCircle * loan.payTotalCircle;
    return generateLoanPayBack(interestsMoney+ baseMoney, d, mconfig.loanPayBackStatus.paying.value);
}
loanPayBackFactory.factory = function(loan){
    return new loanPayBackFactory[loan.get('payWay')](loan.attributes);
};
/* End of 针对还款的工厂类 
 * ****************************/


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
    loan.set('owner', u);
    loan.set('loanType', reqBody.loanType); //TODO: check is this in dict or not
    loan.set('amount', reqBody.amount);
    loan.set('spanMonth', reqBody.spanMonth);
    loan.set('startDate', mutil.wrapperStrToDate(reqBody.startDate)); //合同相关
    loan.set('endDate', mutil.wrapperStrToDate(reqBody.endDate)); //合同相关
    loan.set('payCircle', reqBody.payCircle); //还款周期,每几月还一次
    loan.set('payTotalCircle', reqBody.payTotalCircle); //共需要还几期
    loan.set('interests', reqBody.interests);
    loan.set('assureCost', reqBody.assureCost);
    loan.set('serviceCost', reqBody.serviceCost);
    loan.set('overdueCostPercent', reqBody.overdueCostPercent);
    loan.set('otherCost', reqBody.otherCost);
    loan.set('keepCost', reqBody.keepCost);
    loan.set('payWay', reqBody.payWay);

    //还款时间
    //根据还款类型确认初次还款日期
    loan.set('firstPayDate', mutil.wrapperStrToDate(reqBody.firstPayDate));
    loan.set('status', mconfig.loanStatus.draft.value);
    return loan;
}

exports.createBasicLoan=createBasicLoan;
exports.calculateLoanRecord=calculateLoanRecord;
exports.calculatePayBackMoney=calculatePayBackMoney;