var util = require('util');
var moment = require('moment');
var mlog = require('cloud/mlog.js');
var mutil = require('cloud/mutil.js');
var mconfig = require('cloud/mconfig.js');

/**
 * Message:
 *  @系统消息
 *    1. 认证
 *    2. 通知
 *    3. 
 *  @还款提醒
 *    1. 逾期项目提醒
 *    2. 
 */

var Message = AV.Object.extend('Message');

function concreteMessage(){
  
};
