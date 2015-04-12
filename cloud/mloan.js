
var Loan = AV.Object.extend('Loan');
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
    loan.set('startDate', mutil.wrapperStrToDate(reqBody.startDate));
    loan.set('endDate', mutil.wrapperStrToDate(reqBody.endDate));
    loan.set('payCircle', reqBody.payCircle);
    loan.set('payTotalCircle', reqBody.payTotalCircle);
    loan.set('interests', reqBody.interests);
    loan.set('assureCost', reqBody.assureMoney);
    loan.set('serviceCost', reqBody.serviceMoney);
    loan.set('overdueCostPercent', reqBody.overdueCostPercent);
    loan.set('otherCost', reqBody.otherCost);
    loan.set('keepCost', reqBody.keepCost);
    loan.set('payWay', reqBody.payWay);
    loan.set('firstPayDate', mutil.wrapperStrToDate(reqBody.firstPayDate));
	return loan;
}

function generateProject(loanId, borrowerId, assurerId){
    //需要计算还款周期等一系列的内容
    
}
exports.createBasicLoan=createBasicLoan;