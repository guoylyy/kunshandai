/*
 * 这个类是一些字典表等静态的配置信息
 */
exports.pageSize = 10
//财务统计状态科目
var fiscalStatusTypes = {
	'payed': {
		value: 'payed',
		text: '已兑付'
	},
	'unPayed':{
		value: 'unPayed',
		text: '未兑付'
	},
	'all':{
		value: 'all',
		text: '所有'
	}
};

//财务统计科目
var fiscalTypes = {
	'basicMoney':{
		value: 0,
		text: '本金'
	},
	'intersets':{
		value: 1,
		text: '利息'
	},
	'overdueMoney':{
		value: 2,
		text: '违约金'
	},
	'serviceCost':{
		value: 3,
		text: '服务费'
	},
	'assureCost':{
		value: 4,
		text: '保证金'
	},
	'keepCost':{
		value: 5,
		text: '暂收'
	},
	'otherCost':{
		value: 6,
		text: '其他费用'
	},
	'overflowMoney':{
		value: 7,
		text: '溢价'
	},
	'favourMoney':{
		value: 8,
		text: '坏账'
	},
	'all':{
		value: 9,
		text: '所有'
	}
};

var payBackTypes = {
	'normal':{
		value: 'normal',
		text: '正常还款'
	},
	'favour':{
		value: 'favour',
		text: '优惠'
	},
	'next':{
		value: 'next',
		text: '滚入下期'
	},
	'partial':{
		value: 'partial',
		text: '部分还款'
	},
	'overflow':{
		value: 'overflow',
		text: '溢价'
	}
};

var verifyStatus = {
	none: {
		value: 'none',
		text: '未认证'
	},
	pending : {
		value: 'pending',
		text: '认证中'
	},
	approved: {
		value: 'approved',
		text: '已认证'
	}
};

var loanStatus ={
	draft: {
		value:0,
		text:'未完成创建'
	},
	paying: {
		value:1,
		text:'进行中'
	},
	completed: {
		value:2,
		text:'已完成'
	}
};

var loanPayBackStatus = {
	paying: {
		value:1,
		text:'进行中'
	},
	toPaying: {
		value: 2,
		text:'未进入还款流程'
	},
	completed: {
		value:3,
		text:'已完成'
	},
	closed :{
		value:4,
		text:'已关闭'
	}
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

var fileTypes ={
	inspection: {
		value: 'inspection',
		text: '现场考察'
	},
	certification: {
		value: 'certification',
		text: '证件'
	},
	credit: {
		value: 'credit',
		text: '信用'
	},
	agreement: {
		value: 'agreement',
		text: '协议'
	},
	receipt: {
		value: 'receipt',
		text: '收据'
	},
	other: {
		value: 'other',
		text: '其他'
	}
};


var loanListTypes = {
	normal: {
		value: 'normal',
		text: '正常项目'
	},
	overdue: {
		value: 'overdue',
		text: '逾期项目'
	},
	badbill: {
		value: 'badbill',
		text: '坏账项目'
	},
	completed: {
		value: 'completed',
		text: '结清项目'
	},
	all: {
		value: 'all',
		text: '所有项目'
	}
};

var interestCalTypes = {
	dayInterest: {
		value: 'dayInterest',
		text: '按天计息'
	},
	monthInterest: {
		value: 'monthInterest',
		text: '当月收全息'
	},
	circleInterest: {
		value: 'circleInterest',
		text: '当期收全息'
	},
	allInterest: {
		value: 'allInterest',
		text: '收全息'
	}
};



function convertDictToList(key){
	if(key=='loanTypes'){
		return getKeyValueList(loanTypes);
	}else if(key=='payBackWays'){
		return getKeyValueList(payBackWays);
	}else if(key=='loanStatus'){
		return getKeyValueList(loanStatus);
	}else if(key=='loanPayBackStatus'){
		return getKeyValueList(loanPayBackStatus);
	}else if(key=='fileTypes'){
		return getKeyValueList(fileTypes);
	}else if(key=='interestCalTypes'){
		return getKeyValueList(interestCalTypes);
	}else if(key=='payBackTypes'){
		return getKeyValueList(payBackTypes);
	}else if(key=='verifyStatus'){
		return getKeyValueList(verifyStatus);
	}else if(key=='fiscalTypes'){
		return getKeyValueList(fiscalTypes);
	}else if(key=='fiscalStatusTypes'){
		return getKeyValueList(fiscalStatusTypes);
	}
	return null;
}

function getConfigMapByValue(key, value){
	var obj;
	if(key=='loanTypes'){
		obj = loanTypes;
	}else if(key=='payBackWays'){
		obj = payBackWays;
	}else if(key=='loanStatus'){
		obj = loanStatus;
	}else if(key=='loanPayBackStatus'){
		obj = loanPayBackStatus;
	}else if(key=='interestCalTypes'){
		obj = interestCalTypes;
	}else if(key=='payBackTypes'){
		obj = payBackTypes;
	}else if(key=='verifyStatus'){
		obj = verifyStatus;
	}else if(key=='fiscalTypes'){
		obj = fiscalTypes;
	}else if(key=='fiscalStatusTypes'){
		obj = fiscalStatusTypes;
	}
	if(!obj){
		return null;
	}
	var keys = Object.keys(obj);
	for (var i = 0; i < keys.length; i++) {
		if(value == obj[keys[i]].value){
			return obj[keys[i]];
		}
	};
	return null;
}

function getKeyValueList(obj){
	var keys = Object.keys(obj);
	var rlist = [];
	for (var i = 0; i < keys.length; i++) {
		var value = obj[keys[i]].value;
		var text = obj[keys[i]].text;
		rlist.push({value:value, text:text});
	};
	return rlist;
}

function getSumMap(obj){
	var keys = Object.keys(obj);
	for (var i = 0; i < keys.length; i++) {
		obj[keys[i]]['sum'] = 0;
	};
	return obj;
}

exports.fiscalStatusTypes = fiscalStatusTypes;
exports.fiscalTypes = fiscalTypes; 
exports.interestCalTypes = interestCalTypes;
exports.getSumMap = getSumMap;
exports.payBackTypes = payBackTypes;
exports.loanListTypes = loanListTypes;
exports.getConfigMapByValue = getConfigMapByValue;
exports.convertDictToList = convertDictToList;
exports.loanStatus = loanStatus;
exports.loanPayBackStatus = loanPayBackStatus;
exports.verifyStatus = verifyStatus;
exports.payBackWays = payBackWays;
exports.loanTypes = loanTypes;