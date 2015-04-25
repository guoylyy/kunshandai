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
    lr.set('order',1); //标记为首次放款
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
    var interestsMoney = loan.amount * loan.payTotalCircle * loan.payCircle * loan.interests;
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
var loanPayBackFactory = {
    payBackInit: {},
    overdueMoneyCal : {}
};
function generateLoanPayBack(loan, payMoney, payDate, status, order){
    var loanPayBack = new AV.Object('LoanPayBack');
    loanPayBack.set('payDate', payDate);
    loanPayBack.set('payMoney', payMoney);
    loanPayBack.set('status', status);
    loanPayBack.set('order',order);
    loanPayBack.set('loan', loan);
    return loanPayBack;
};
//先息后本，只生成一期还款,首次还款日期是最终还款日期
loanPayBackFactory.payBackInit.xxhb = function(loanObj, loan){
    var outMoney = loan.amount;
    var d = moment(loan.firstPayDate).format();//todo:修改成首次还款日期日期
    return [generateLoanPayBack(loanObj, outMoney, d, mconfig.loanPayBackStatus.paying.value, 1)];
};
//等额本息需要每月还利息 + 本金 + 逾期违约金
//生成之时预约违约金为 0
loanPayBackFactory.payBackInit.debx = function(loanObj, loan){
    var baseMoney = loan.amount / loan.payTotalCircle; //每期本金
    var interestsMoney = loan.amount * loan.interests * loan.payCircle;
    var overdueMoney = 0;
    var rlist = [];
    for (var i = 1; i <= loan.payTotalCircle; i++) {
        var status = mconfig.loanPayBackStatus.paying.value;
        var d = moment(loan.firstPayDate).add(loan.payCircle*(i-1), 'month').format();
        if(i > 1){
            status = mconfig.loanPayBackStatus.toPaying.value;
        }
        rlist.push(generateLoanPayBack(loanObj, baseMoney + interestsMoney + overdueMoney, 
            d, status, i));
    };
    return rlist;
};
//周期初还本付息
//期间只收利息
loanPayBackFactory.payBackInit.zqcxhb = function(loanObj, loan){
    var baseMoney = 0; //每期还本金
    var interestsMoney = loan.amount * loan.interests * loan.payCircle;
    var overdueMoney = 0;
    var rlist = [];
    for (var i = 1; i <= loan.payTotalCircle; i++) {
        var status = mconfig.loanPayBackStatus.paying.value;
        var d = moment(loan.firstPayDate).add(loan.payCircle*(i-1), 'month').format();
        if(i > 1){
            status = mconfig.loanPayBackStatus.toPaying.value;
        }
        rlist.push(generateLoanPayBack(loanObj, baseMoney + interestsMoney + overdueMoney, 
            d, status, i));
    };
    return rlist;
};
//周期末息后本 
loanPayBackFactory.payBackInit.zqmxhb = function(loanObj, loan){
    var baseMoney = 0; //每期还本金
    var interestsMoney = loan.amount * loan.interests * loan.payCircle;
    var overdueMoney = 0;
    var rlist = [];
    for (var i = 1; i <= loan.payTotalCircle; i++) {
        var status = mconfig.loanPayBackStatus.paying.value;
        var d = moment(loan.firstPayDate).add(loan.payCircle*(i-1), 'month').format();
        if(i > 1){
            status = mconfig.loanPayBackStatus.toPaying.value;
        }
        rlist.push(generateLoanPayBack(loanObj, baseMoney + interestsMoney + overdueMoney, 
            d, status, i));
    };
    return rlist;
};
//到期本息
loanPayBackFactory.payBackInit.dqhbfx = function(loanObj, loan){
    var baseMoney = loan.amount;
    var d = moment(loan.firstPayDate).format();
    var overdueMoney = 0;
    var interestsMoney = loan.amount* loan.interests * loan.payCircle * loan.payTotalCircle;
    return [generateLoanPayBack(loanObj, interestsMoney+ baseMoney, d, mconfig.loanPayBackStatus.paying.value, 1)];
};

//还款的违约金计算
loanPayBackFactory.overdueMoneyCal.xxhb = function(loanObj, currDate){
    return 0;
};
loanPayBackFactory.overdueMoneyCal.debx = function(loanObj, currDate){
    return 0;
};
loanPayBackFactory.overdueMoneyCal.zqcxhb = function(loanObj, currDate){
    return 0;
};
loanPayBackFactory.overdueMoneyCal.zqmxhb = function(loanObj, currDate){
    return 0;
};
loanPayBackFactory.overdueMoneyCal.dqhbfx = function(loanObj, currDate){
    return 0;
};

loanPayBackFactory.factory = function(loan){
    return new loanPayBackFactory.payBackInit[loan.get('payWay')](loan, loan.attributes);
};

loanPayBackFactory.overdueMoney = function(loan, currDate){
    return new loanPayBackFactory.overdueMoneyCal[loan.get('payWay')](loan, currDate);
};
/* End of 针对还款的工厂类 
 * ****************************/

/*
 * 以下是暴露给外部的访问的方法
 */
function calculateLoanRecord(loan){
    return loanRecordFactory.factory(loan);
};
//各种不同类型的
function calculatePayBackMoney(loan){
    return loanPayBackFactory.factory(loan);
};
//计算违约金接口
function calculateOverdueMoney(loan, currDate){
    return loanPayBackFactory.overdueMoney(loan, currDate);
};
function createBasicLoan(reqBody, u){
    var loan = new AV.Object('Loan');
    loan.set('owner', u);
    return updateLoan(loan, reqBody);
};

function updateLoan(loan, reqBody){
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

    loan.set('otherCostDesc', reqBody.otherCostDesc);
    loan.set('keepCostDesc', reqBody.keepCostDesc);

    loan.set('payedMoney', 0);
    //还款时间
    //根据还款类型确认初次还款日期
    loan.set('currPayDate', mutil.wrapperStrToDate(reqBody.firstPayDate));
    loan.set('firstPayDate', mutil.wrapperStrToDate(reqBody.firstPayDate));
    loan.set('status', mconfig.loanStatus.draft.value);
    return loan;
};

exports.calculateOverdueMoney = calculateOverdueMoney;
exports.updateLoan = updateLoan;
exports.createBasicLoan=createBasicLoan;
exports.calculateLoanRecord=calculateLoanRecord;
exports.calculatePayBackMoney=calculatePayBackMoney;