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
		value:0,
		text:'等额本息'
	},
	xxhb:{
		value:1,
		text:'先息后本'
	},
	zqcxhb:{
		value:2,
		text:'周期初息后本'
	},
	zqmxhb:{
		value:3,
		text:'周期末息后本'
	},
	dqhbfx:{
		value:4,
		text:'到期还本付息'
	}
};

var loanTypes = {
	fcdy:{
		value:0,
		text:'房产抵押'
	},
	qcdy:{
		value:1,
		text:'汽车抵押'
	},
	mfdy:{
		value:2,
		text:'买房抵押'
	},
	mcdy:{
		value:3,
		text:'买车抵押'
	},
	wdy:{
		value:4,
		text:'无抵押'
	},
	qtdy:{
		value:5,
		text:'其他抵押'
	}
};


exports.loanStatus = loanStatus;
exports.loanPayBackStatus = loanPayBackStatus;
exports.payBackWays = payBackWays;
exports.loanTypes = loanTypes;