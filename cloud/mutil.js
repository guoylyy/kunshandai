/**
 * @author globit allen
 */
var moment = require('moment');
var util = require('util');
var mlog=require('cloud/mlog.js');

/*
  Date 计算工具
 */
function addMonth(d, monthOffset){
  return moment(d).add(monthOffset,'month');
}

/*
  render json 工具
 */
function doErr(err){
  console.log(err);
}
function renderError(res, error) {
  if (error == null) {
    error = {
      message: "Unknown error",
      code: 500
    };
  };
  res.status(error.code).json(error);
}
function renderSuccess(res){
  return renderResult(res,'success', 200);
}
function rejectFn(promise){
  return function(error){
    promise.reject(error);
  }
}
function logErrorFn(){
  return function(err){
    mlog.logError(err);
  }
}
function renderForbidden(res) {
  mlog.log('render forbidden');
}
function renderNotFound(res){
  renderError(res, {code:404, message:'找不到对象!'});
}
function renderResult(res, result, code) {
  res.status(code).json({result: result, code:code});
}
function renderData(res, data) {
  res.status(200).json({data: data, code:200});
}
function renderErrorData(res, data){
  res.status(200).json(data);
}
function renderDataWithCode(res, data, code) {
  res.status(code).json({data: data, code:code});
}
function wrapperStrToDate(dateStr){
  return new Date(dateStr);
}

exports.renderErrorData = renderErrorData;
exports.doErr=doErr;
exports.renderDataWithCode = renderDataWithCode;
exports.renderNotFound=renderNotFound;
exports.renderSuccess=renderSuccess;
exports.renderError=renderError;
exports.rejectFn=rejectFn;
exports.renderForbidden=renderForbidden;
exports.logErrorFn=logErrorFn;
exports.renderResult=renderResult;
exports.renderData=renderData;
exports.wrapperStrToDate=wrapperStrToDate;

exports.addMonth=addMonth;