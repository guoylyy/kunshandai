var Loan = AV.Object.extend('Loan');
var File = AV.Object.extend('_File');
var LoanPayBack = AV.Object.extend('LoanPayBack'); //收入列表
var LoanRecord = AV.Object.extend('LoanRecord'); //支出列表
var LoanPawn = AV.Object.extend('LoanPawn');
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
    lr.set('interestsMoney', -interestsMoney);
    lr.set('keepCost', -loan.keepCost);
    lr.set('assureCost', -loan.assureCost);
    lr.set('serviceCost', -loan.serviceCost);
    lr.set('otherCost', -loan.otherCost);
    lr.set('baseMoney', loan.amount);
    lr.set('outMoney', 0);
    lr.set('shouldOutMoney', outMoney);
    lr.set('order',1); //标记为首次放款
    lr.set('isPayed', false);
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
    overdueMoneyCal : {},
    finishBillParmsCal: {}
};
function generateLoanPayBack(loan, payMoney, interestsMoney, payDate, status, order){
    var loanPayBack = new AV.Object('LoanPayBack');
    loanPayBack.set('payDate', payDate);
    loanPayBack.set('payBackDate', payDate);
    loanPayBack.set('payMoney', payMoney);
    loanPayBack.set('interestsMoney', interestsMoney);
    loanPayBack.set('status', status);
    loanPayBack.set('order',order);
    loanPayBack.set('payedMoney', 0);
    loanPayBack.set('offsetMoney', 0);
    loanPayBack.set('payBackMoney', 0);
    loanPayBack.set('overflowMoney', 0);
    loanPayBack.set('loan', loan);
    return loanPayBack;
};
//先息后本，只生成一期还款,首次还款日期是最终还款日期
loanPayBackFactory.payBackInit.xxhb = function(loanObj, loan){
    var outMoney = loan.amount;
    var d = moment(loan.firstPayDate).format();//todo:修改成首次还款日期日期
    return [generateLoanPayBack(loanObj, outMoney, 0, d, mconfig.loanPayBackStatus.paying.value, 1)];
};
//等额本息需要每月还利息 + 本金 + 逾期违约金
//生成之时预约违约金为 0
loanPayBackFactory.payBackInit.debx = function(loanObj, loan){
    var baseMoney = loan.amount / loan.payTotalCircle; //每期本金
    var interestsMoney = loan.amount * loan.interests * loan.payCircle;
    var overdueMoney = 0;
    var rlist = [];
    var endDate = new moment(loan.endDate);
    for (var i = 1; i <= loan.payTotalCircle; i++) {
        var status = mconfig.loanPayBackStatus.paying.value;
        var d = moment(loan.firstPayDate).add(loan.payCircle*(i-1), 'month');
        if(d > endDate){
            d = endDate; //控制还款日期不能超过项目结束日日期
        }
        if(i > 1){
            d.subtract(1, 'days');
        }
        d = d.format();
        if(i > 1){
            status = mconfig.loanPayBackStatus.toPaying.value;
        }
        rlist.push(generateLoanPayBack(loanObj, baseMoney + interestsMoney + overdueMoney, interestsMoney,
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
    var endDate = new moment(loan.endDate);
    for (var i = 1; i <= loan.payTotalCircle; i++) {
        var status = mconfig.loanPayBackStatus.paying.value;
        var d = moment(loan.firstPayDate).add(loan.payCircle*(i-1), 'month');
        if(i > 1){
            d.subtract(1, 'days');
        }
        if(d > endDate){
            d = endDate; //控制还款日期不能超过项目结束日日期
        }
        d = d.format();
        if(i > 1){
            status = mconfig.loanPayBackStatus.toPaying.value;
        }
        if(i == loan.payTotalCircle)
            interestsMoney = 0;
        rlist.push(generateLoanPayBack(loanObj, baseMoney + interestsMoney + overdueMoney, interestsMoney,
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
    var endDate = new moment(loan.endDate);
    for (var i = 1; i <= loan.payTotalCircle; i++) {
        var status = mconfig.loanPayBackStatus.paying.value;
        var d = moment(loan.firstPayDate).add(loan.payCircle*(i-1), 'month');
        if(i > 1){
            d.subtract(1, 'days');
        }
        if(d > endDate){
            d = endDate; //控制还款日期不能超过项目结束日日期
        }
        d = d.format();
        if(i > 1){
            status = mconfig.loanPayBackStatus.toPaying.value;
        }
        rlist.push(generateLoanPayBack(loanObj, baseMoney + interestsMoney + overdueMoney, interestsMoney,
            d, status, i));
    };
    return rlist;
};
//到期本息
loanPayBackFactory.payBackInit.dqhbfx = function(loanObj, loan){
    var baseMoney = parseFloat(loan.amount);
    var d = moment(loan.firstPayDate).format();
    var overdueMoney = 0;
    var interestsMoney = baseMoney * loan.interests * loan.spanMonth;
    return [generateLoanPayBack(loanObj, interestsMoney+ baseMoney, interestsMoney, d, mconfig.loanPayBackStatus.paying.value, 1)];
};

/*****************
* 还款的违约金计算
*/
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


//提前结清违约金和退还项目利息计算接口
//
function getFinishBillTemplate(){
    return {
        income: { //收入金额
            amount: 0,
            overdueMoney: 0,
            interest:0
        },
        outcome: {  //应该退还的金额
            assureCost : 0,
            keepCost : 0,
            interest : 0,
            payedMoney: 0,
            favourMoney:0
        },
        sum: 0
    };
}
function calBillSum(bill){
    var income = bill.income;
    var outcome = bill.outcome;
    var sum = (income.amount + income.overdueMoney + income.interest) -
                (outcome.assureCost + outcome.keepCost + outcome.interest 
                    + outcome.payedMoney);
    if(bill.income.overdueBreach != undefined){
        sum += bill.income.overdueBreach;
    }
    bill.sum = sum;
    return bill;
}

function fillBasicMap(loanObj){
    var rc = getFinishBillTemplate();
    rc.outcome.assureCost = loanObj.get('assureCost');
    rc.outcome.keepCost = loanObj.get('keepCost');
    return rc;
}
/**/
function stepNx(startDate, currDate, currentStep, payCircle){
    var start = new moment(startDate.toDate());
    start.add((currentStep-1) * payCircle, 'months');
    start.add(-1, 'days');
    var end = new moment(startDate.toDate());
    end.add((currentStep) * payCircle, 'months');
    end.add(-1, 'days');
    var Nx = currDate.diff(start, 'days') / end.diff(start, 'days');
    return Nx;
}

function convertParameters(loan, params){
    mlog.dlog(params);
    var currentDate = params.currDate;
    var currentStep = params.currentStep;
    var currentStepDate = params.currentStepDate;
    
    var map = {};
    var stepStartDate = preStepDate(currentStepDate);
    var startDate = new moment(loan.startDate); //合同开始日期
    var currDate = new moment(currentDate);  //当前日期
    var endDate = new moment(loan.endDate);    //合同结束日期
    
    mlog.dlog('开始日期    '+ startDate.format('YYYY-MM-DD'));
    mlog.dlog('周期开始日期 ' + stepStartDate.format('YYYY-MM-DD'));
    mlog.dlog('还款日期    '+ currDate.format('YYYY-MM-DD'));
    mlog.dlog('合同结束日期 '+ endDate.format('YYYY-MM-DD'));

    map['totalDay'] = endDate.diff(startDate,'days');
    map['unPayedDay'] = endDate.diff(currDate, 'days');
    map['unPayedTotalDay'] = endDate.diff(stepStartDate, 'days') + 1;
    map['payedMonth'] = currDate.diff(startDate, 'months') + 1;
    map['unPayedMonth'] = endDate.diff(currDate, 'months');

    map['stepPayedMonth'] = currDate.diff(stepStartDate, 'months') + 1;

    map['T'] = loan.spanMonth;
    map['Tx'] = 1 -  map['unPayedDay']/map['totalDay']; //已经经过的比率
    map['Tsx'] = 1 - map['unPayedDay']/map['unPayedTotalDay']; //需要还款的比例
    map['P'] = loan.amount;
    map['i'] = loan.interests;
    map['j'] = currentStep; //当前还款期数
    map['N'] = loan.payTotalCircle; //总期数
    map['k'] = loan.payCircle; //每期的月数
    map['n'] = map['payedMonth']; //已经经过的月份
    map['ov'] = loan.overdueCostPercent;

    map['dStep'] = calDateInWhichStep(loan, currDate.toDate());

    map['Nx'] = stepNx(startDate, currDate, currentStep, loan.payCircle);

    //逾期天数
    map['od'] = currDate.diff(endDate, 'days') > 0 ? currDate.diff(endDate, 'days'):0;
    return map;
}

function calDateInWhichStep(loan,currDate){
    var step;
    var payCircle = loan.payCircle;
    var mdate = new moment(currDate);
    var start = new moment(loan.startDate);
    var offset = new moment(loan.firstPayDate);
    if(mdate.isBefore(start) || mdate.isSame(start)){
        step = 1;
    }else{
        for (var i = 0; i < loan.payTotalCircle; i++) {
            var offs = offset.add(payCircle * i, 'months');
            if(mdate.isAfter(start) && mdate.isBefore(offs)){
                step = (i+1);
                break;
            }
        };
    }
    if(step == undefined){
        step == loan.payTotalCircle;
    }
    return step;
}

function preStepDate(currentStepDate){
    var m = new moment(currentStepDate);
    m.add(1, 'days');
    return m;
}

loanPayBackFactory.finishBillParmsCal.xxhb = function(loanObj, data){
    var rc = fillBasicMap(loanObj);
    var map = convertParameters(loanObj.attributes, data);
    rc.income.overdueMoney = map.P * map.ov * map.od;
    mlog.dlog('先息后本计算');
    mlog.dlog(map);
    if(map['od'] <= 0){
        switch(data.interestCalType){
            case mconfig.interestCalTypes.dayInterest.value:
                rc.outcome['interest'] = map.P * map.i * map.T * (1 - map.Tx);
                break;
            case mconfig.interestCalTypes.monthInterest.value:
                rc.outcome['interest'] = map.P * map.i * (map.T - map.n);
                break;
            case mconfig.interestCalTypes.circleInterest.value:
                rc.outcome['interest'] = 0; //只有一期，所以当期不用退了
                break;
            case mconfig.interestCalTypes.allInterest.values:
                rc.outcome['interest'] = 0;
                break;
            default:
                break;
        };
    }
    checkBill(rc);
    return rc;
};
loanPayBackFactory.finishBillParmsCal.debx = function(loanObj, data){
    var rc = fillBasicMap(loanObj);
    var map = convertParameters(loanObj.attributes, data);
    rc.income.overdueMoney = map.P * map.ov * map.od;
    mlog.dlog(map);
    if(map.od <= 0){
        switch(data.interestCalType){
            case mconfig.interestCalTypes.dayInterest.value:                
                rc.income['interest'] = map.P * map.i * (map.N - map.j + 1) * map.k * map.Tsx;
                break;
            case mconfig.interestCalTypes.monthInterest.value:
                rc.income['interest'] = map.P * map.i * (map.n - (map.j - 1)* map.k) ;
                break;
            case mconfig.interestCalTypes.circleInterest.value:
                rc.income['interest'] = map.P * map.i * map.k * (map.dStep - map.j + 1);
                break;
            case mconfig.interestCalTypes.allInterest.value:
                rc.income['interest'] = map.P * map.i * (map.N - (map.j - 1)) * map.k;
                break;
            default:
                break;
        };
    }else{
        rc.income['interest'] = map.P * map.i * (map.N - (map.j - 1)) * map.k;
    }
    //加入提前结清违约金
    var curr = new moment(data.currDate);
    var endDate = new moment(loanObj.get('endDate'));
    var startDate = new moment(loanObj.get('startDate'));
    var days = 0;
    if(curr.isBefore(startDate)){
        curr = startDate;
    }
    if(curr.isBefore(endDate)){
        days = endDate.diff(curr,'days');
    }
    mlog.dlog('提前结清天数:'+days);
    rc.income['overdueBreach'] = loanObj.get('overdueBreachPercent') * map.P * days;
    checkBill(rc);
    mlog.dlog(rc);
    return rc;
};
loanPayBackFactory.finishBillParmsCal.zqcxhb = function(loanObj, data){
    var rc = fillBasicMap(loanObj);
    var map = convertParameters(loanObj.attributes, data);
    rc.income.overdueMoney = map.P * map.ov * map.od;
    if(map.od > 0){
        data.interestCalType = mconfig.interestCalTypes.allInterest.value;
    }
    mlog.dlog('周期初息后本计算');
    mlog.dlog(data);
    mlog.dlog(map);
    switch(data.interestCalType){
        case mconfig.interestCalTypes.dayInterest.value:
            rc.outcome['interest'] = map.P * map.i * (1 - map.Nx) * map.k;
            break;
        case mconfig.interestCalTypes.monthInterest.value:
            rc.outcome['interest'] = map.P * map.i * (map.j * map.k - map.n);
            break;
        case mconfig.interestCalTypes.circleInterest.value:
            rc.outcome['interest'] = 0;
            break;
        case mconfig.interestCalTypes.allInterest.value:
            rc.outcome['interest'] = 0;
            rc.income['interest'] = map.P * map.i * (map.N - map.j) * map.k;
            break;
        default:
            break;
    };
    checkBill(rc);
    return rc;
};
loanPayBackFactory.finishBillParmsCal.zqmxhb = function(loanObj, data){
    var rc = fillBasicMap(loanObj);
    var map = convertParameters(loanObj.attributes, data);
    rc.income.overdueMoney = map.P * map.ov * map.od;
    if(map.od > 0){
        data.interestCalType = mconfig.interestCalTypes.allInterest.value;
    }
    mlog.dlog('周期末息后本计算');
    //mlog.dlog(data);
    mlog.dlog(map);
    switch(data.interestCalType){
        case mconfig.interestCalTypes.dayInterest.value:
            rc.income['interest'] = map.P * map.i * (map.N - map.j + 1) * map.k * map.Tsx;
            break;
        case mconfig.interestCalTypes.monthInterest.value:
            rc.income['interest'] = map.P * map.i * map.stepPayedMonth;
            break;
        case mconfig.interestCalTypes.circleInterest.value:
            rc.income['interest'] = map.P * map.i * map.k * (map.dStep - map.j + 1);
            break;
        case mconfig.interestCalTypes.allInterest.value:
            rc.income['interest'] = map.P * map.i * (map.N - (map.j - 1)) * map.k;
            break;
        default:
            break;
    };
    checkBill(rc);
    return rc;
};
loanPayBackFactory.finishBillParmsCal.dqhbfx = function(loanObj, data){
    
    var rc = fillBasicMap(loanObj);
    var map = convertParameters(loanObj.attributes, data);
    rc.income.overdueMoney = map.P * map.ov * map.od;
    mlog.dlog('到期还本付息计算');
   // mlog.dlog(data);
    mlog.dlog(map);
    if(map.od <= 0){
        switch(data.interestCalType){
            case mconfig.interestCalTypes.dayInterest.value:
                rc.income['interest'] = map.P * map.i * map.T * map.Tx; //按天计息
                break;
            case mconfig.interestCalTypes.monthInterest.value:
                rc.income['interest'] = map.P * map.i * map.n;
                break;
            case mconfig.interestCalTypes.circleInterest.value:
                rc.income['interest'] = map.P * map.i * map.T; //只有一期，所以当期不用退了
                break;
            case mconfig.interestCalTypes.allInterest.values:
                rc.income['interest'] = map.P * map.T * map.i;
                break;
            default:
                break;
        };
    }else{
        rc.income['interest'] = map.P * map.T * map.i;
    }
    checkBill(rc);
    return rc;
};

function checkBill(bill){
    if(bill.income['interest'] < 0){
        bill.income['interest'] = 0;
    }
}


loanPayBackFactory.factory = function(loan){
    return new loanPayBackFactory.payBackInit[loan.get('payWay')](loan, loan.attributes);
};

loanPayBackFactory.overdueMoney = function(loan, currDate){
    return new loanPayBackFactory.overdueMoneyCal[loan.get('payWay')](loan, currDate);
};

loanPayBackFactory.finishBillParms = function(loan, data){
    return new loanPayBackFactory.finishBillParmsCal[loan.get('payWay')](loan, data);
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
//计算结清违约金接口和退还利息的接口
function calculateFinishBillParms(loan, data){
    return loanPayBackFactory.finishBillParms(loan, data);
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
    loan.set('currPayStep', 1); //设置当前期数
    loan.set('interests', reqBody.interests);
    loan.set('assureCost', reqBody.assureCost);
    loan.set('serviceCost', reqBody.serviceCost);
    loan.set('overdueCostPercent', reqBody.overdueCostPercent);//违约金率 千分之
    loan.set('otherCost', reqBody.otherCost);
    loan.set('keepCost', reqBody.keepCost);
    loan.set('payWay', reqBody.payWay);

    if(reqBody.payWay == mconfig.payBackWays.debx.value){
        loan.set('overdueBreachPercent', reqBody.overdueBreachPercent);
    }else{
        loan.set('overdueBreachPercent', parseFloat(0));
    }

    loan.set('isSmsRemind', reqBody.isSmsRemind);
    loan.set('isEmailRemind', reqBody.isEmailRemind);

    loan.set('otherCostDesc', reqBody.otherCostDesc);
    loan.set('keepCostDesc', reqBody.keepCostDesc);

    loan.set('payedMoney', 0);

    //还款时间
    //根据还款类型确认初次还款日期
    //存储一个正常的首次还款时间
    //loan.set('normalFirstPayDate', mutil.wrapperStrToDate(reqBody.normalFirstPayDate));
    loan.set('currPayDate', mutil.wrapperStrToDate(reqBody.firstPayDate));
    loan.set('firstPayDate', mutil.wrapperStrToDate(reqBody.firstPayDate));
    loan.set('status', mconfig.loanStatus.draft.value);
    return loan;
};

//获取正常还款时间
function getNormalFirstPayDate(loan){
    var loanType = loan.get('loanType');
    
}

//贷款抵押物
function createLoanPawn(reqBody){
    var pawn = new AV.Object('LoanPawn');
    pawn.set('data', reqBody.data);
    return pawn;
};

function bindPawnAttachments(pawn, attachmentIds){
    var attachments = pawn.relation("attachments");
    var query =  new AV.Query(File);
    if(attachmentIds){
        for (var i = attachmentIds.length - 1; i >= 0; i--) {
            var id = attachmentIds[i];
            query.get(id, {
                success: function(file){
                    attachments.add(file);
                    pawn.save();
                },
                error: function(object, error){
                    console.log(error);
                }
            });
        };
    }else{
        return;
    }
};

exports.calBillSum = calBillSum;
exports.calculateFinishBillParms = calculateFinishBillParms;
exports.calculateOverdueMoney = calculateOverdueMoney;
exports.updateLoan = updateLoan;
exports.createBasicLoan=createBasicLoan;
exports.calculateLoanRecord=calculateLoanRecord;
exports.calculatePayBackMoney=calculatePayBackMoney;

exports.createLoanPawn = createLoanPawn;
exports.bindPawnAttachments = bindPawnAttachments;
