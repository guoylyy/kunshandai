
var loanPayBackFactory = {
    payBackInit: {}
};

function generateLoanPayBack(payMoney, interestsMoney, payDate, status, order){
    var lp = {};
    lp['payDate'] = payDate;
    lp['payMoney'] = payMoney;
    lp['interestsMoney'] = interestsMoney;
    lp['status'] = status;
    lp['order'] =order;
    lp['loan'] = loan;
    return lp;
};
//先息后本，只生成一期还款,首次还款日期是最终还款日期
loanPayBackFactory.payBackInit.xxhb = function(loan){
    var outMoney = loan.amount;
    var d = moment(loan.firstPayDate).format();//todo:修改成首次还款日期日期
    return [generateLoanPayBack(outMoney, 0, d, mconfig.loanPayBackStatus.paying.value, 1)];
};
//等额本息需要每月还利息 + 本金 + 逾期违约金
//生成之时预约违约金为 0
loanPayBackFactory.payBackInit.debx = function(loan){
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
        rlist.push(generateLoanPayBack(baseMoney + interestsMoney + overdueMoney, interestsMoney,
            d, status, i));
    };
    return rlist;
};
//周期初还本付息
//期间只收利息
loanPayBackFactory.payBackInit.zqcxhb = function(loan){
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
        rlist.push(generateLoanPayBack(baseMoney + interestsMoney + overdueMoney, interestsMoney,
            d, status, i));
    };
    return rlist;
};
//周期末息后本 
loanPayBackFactory.payBackInit.zqmxhb = function(loan){
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
        rlist.push(generateLoanPayBack(baseMoney + interestsMoney + overdueMoney, interestsMoney,
            d, status, i));
    };
    return rlist;
};
//到期本息
loanPayBackFactory.payBackInit.dqhbfx = function(loan){
    var baseMoney = loan.amount;
    var d = moment(loan.firstPayDate).format();
    var overdueMoney = 0;
    var interestsMoney = loan.amount* loan.interests * loan.payCircle * loan.payTotalCircle;
    return [generateLoanPayBack(interestsMoney+ baseMoney, interestsMoney, d, mconfig.loanPayBackStatus.paying.value, 1)];
};

loanPayBackFactory.factory = function(loan){
    return new loanPayBackFactory.payBackInit[loan.payWay](loan);
};


//外部调用这个接口计算一个项目的还款流程
//@return list of LoanPackBacks
function calculatePayBackMoney(loan){
    return loanPayBackFactory.factory(loan);
};
