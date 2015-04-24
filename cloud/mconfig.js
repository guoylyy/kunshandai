/*
 * 这个类是一些字典表等静态的配置信息
 */
exports.pageSize = 10
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

exports.getConfigMapByValue = getConfigMapByValue;
exports.convertDictToList = convertDictToList;
exports.loanStatus = loanStatus;
exports.loanPayBackStatus = loanPayBackStatus;
exports.payBackWays = payBackWays;
exports.loanTypes = loanTypes;