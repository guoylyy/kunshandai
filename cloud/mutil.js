/**
 * @author globit allen
 */
var util = require('util');
var mlog=require('cloud/mlog.js');

function doErr(err){
  console.log(err);
}

function renderError(res, error) {
  console.log(error.code);
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
  renderError(res, "Forbidden area.");
}
function renderResult(res, result, code, backLink) {
  res.status(code).json({result: result, backLink: backLink, code:code});
}
function renderData(res, data) {
  res.status(200).json({data: data, code:200});
}

function wrapperStrToDate(dateStr){
  return new Date(dateStr);
}

exports.doErr=doErr;
exports.renderSuccess=renderSuccess;
exports.renderError=renderError;
exports.rejectFn=rejectFn;
exports.renderForbidden=renderForbidden;
exports.logErrorFn=logErrorFn;
exports.renderResult=renderResult;
exports.renderData=renderData;
exports.wrapperStrToDate=wrapperStrToDate;