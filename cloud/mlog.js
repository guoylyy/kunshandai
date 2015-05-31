/**
 */
var util=require('util');

var open=!__production;
var debug=false;

function startWith(s,prefix,f){
  if(s.indexOf(prefix)==0){
    f.call();
  }
}

function filterFn(s,f){
  startWith(s,'',f);
  //f.call();
}

function logError(error){
  error=util.inspect(error);
  log(error);
}

function log(s){
  //s=s+'';
  if(open){
    //filterFn(s,function(){
      console.log(s);
    //});
  }
}

function dlog(s){
  if(debug){
    console.log(s);
  }
}
exports.dlog=dlog;
exports.log=log;
exports.logError=logError;