var Loan = AV.Object.extend('Loan');
var PayBack = AV.Object.extend('PayBack'); //收入列表
var LoanRecord = AV.Object.extend('LoanRecord'); //支出列表
var util = require('util');
var mlog = require('cloud/mlog.js');
var mutil = require('cloud/mutil.js');

/**
 * 分阶段创建项目
 * 1. 创建项目信息
 * 2. 创建联系人 - 放在contract.js里
 * 3. 根据以上的两个信息来确定一个项目，生成主项目
 */
function createBasicLoan(reqBody){
	//var loan = new Loan();
    var loan = new AV.Object('Loan');
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
    //根据还款类型确认初次还款日期
    loan.set('firstPayDate', mutil.wrapperStrToDate(reqBody.firstPayDate));
	return loan;
}

function transformLoan(l){

};

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

function calculateLoanRecord(loan){
    var lr = loanRecordFactory.factory(loan);
    return lr;
}
//各种不同类型的
function calculatePayBackMoney(loan){

}

exports.createBasicLoan=createBasicLoan;
exports.calculateLoanRecord=calculateLoanRecord;