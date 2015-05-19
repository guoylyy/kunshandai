define(['app'],function(app){
	return app.filter('cDisplay',function(){
		var keyValues = {
			loanStatus:{
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
			},	

		 	loanPayBackStatus :{
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
			},

		   payBackWays : {
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
			},

			loanTypes: {
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
			},

			fileTypes:{
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
			}
		}
		return function(value,type){
			if(!value || !type){
				return '';
			}
			if(typeof value === 'string'){
				return keyValues[type][value].text;	
			}else{
				return value.text;	
			}
			
		}
	})
});