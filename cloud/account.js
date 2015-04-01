
var _ = require('underscore');
var anonymousToken = 'anonymous';
var anonymousCid = 'anonymousCid';
var mlog = require('cloud/mlog.js');
var config = require('cloud/config.js');
var mutil = require('cloud/mutil.js');

function isLogin() {
  return AV.User.current();
}

exports.isLogin = isLogin;
