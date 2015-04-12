/*
 * 这个类是一些字典表等静态的配置信息
 */
var loanStatus ={
	draft: 0,
	paying: 1,
	completed: 2
};

var loanPayBackStatus = {
	paying: 1,
	completed: 2
};

var payBackWays = {
	debx:{
		value:'debx',
		text:'等额本息'
	},
	xxhb:{
		value:'xxhb',
		text:'先息后本'
	},
	zqcxhb:{
		value:'zqcxhb',
		text:'周期初息后本'
	},
	zqmxhb:{
		value:'zqmxhb',
		text:'周期末息后本'
	},
	dqhbfx:{
		value:'dqhbfx',
		text:'到期还本付息'
	}
};

var loanTypes = {
	fcdy:{
		value:'fcdy',
		text:'房产抵押'
	},
	qcdy:{
		value:'qcdy',
		text:'汽车抵押'
	},
	mfdy:{
		value:'mfdy',
		text:'买房抵押'
	},
	mcdy:{
		value:'mcdy',
		text:'买车抵押'
	},
	wdy:{
		value:'wdy',
		text:'无抵押'
	},
	qtdy:{
		value:'qtdy',
		text:'其他抵押'
	}
};


exports.loanStatus = loanStatus;
exports.loanPayBackStatus = loanPayBackStatus;
exports.payBackWays = payBackWays;
exports.loanTypes = loanTypes;