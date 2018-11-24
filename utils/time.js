var x = new Date();
var y = x.getTime();
console.log("当前时间戳为：" + y);
var timestamp = Date.parse(new Date());
console.log("当前时间戳为：" + timestamp );
timestamp = timestamp / 1000;

//获取当前时间  
var n = timestamp * 1000;
var date = new Date(n);

var Y
var M
var D
var h
var m
var s
var YMD
var YMDhms

var n_yesterday = n - 24 * 60 * 60
var date_yesterday = new Date(n_yesterday)
var Y_yesterday
var M_yesterday
var D_yesterday
var YMD_yesterday


var n_tom = n - 24 * 60 * 60
var date_tom = new Date(n_tom)
var Y_tom
var M_tom
var D_tom
var YMD_tom


function newTime() {
  timestamp = Date.parse(new Date());
  var ts=timestamp
  timestamp = timestamp / 1000;
  
  n = timestamp * 1000;
  date = new Date(n);

  n_yesterday = n - 24 * 60 * 60 * 1000 * 60 //这是*几就是几天 *7
  date_yesterday = new Date(n_yesterday)
  
  n_tom = n + 24 * 60 * 60 * 1000 * 3 //这是*几就是几天 *7
  date_tom = new Date(n_tom)
  
  Y = date.getFullYear();
  M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  h = date.getHours();
  m = date.getMinutes();
  s = date.getSeconds();

  Y_yesterday = date_yesterday.getFullYear();
  M_yesterday = (date_yesterday.getMonth() + 1 < 10 ? '0' + (date_yesterday.getMonth() + 1) : date_yesterday.getMonth() + 1);
  D_yesterday = date_yesterday.getDate() < 10 ? '0' + date_yesterday.getDate() : date_yesterday.getDate();

  Y_tom = date_tom .getFullYear();
  M_tom = (date_tom.getMonth() + 1 < 10 ? '0' + (date_tom.getMonth() + 1) : date_tom .getMonth() + 1);
  D_tom = date_tom.getDate() < 10 ? '0' + date_tom .getDate() : date_tom .getDate();

  YMD = Y + "-" + M + "-" + D
  YMDhms = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s
  YMD_yesterday = Y_yesterday + "-" + M_yesterday + "-" + D_yesterday
  return ts
}

function getY() {
  //年  
  Y = date.getFullYear();
  return Y
}

function getM(){
  //月  
  M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  return M
}

function getD() {
  //日  
  D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return D
}

function geth() {
  //时  
  h = date.getHours();
  return h
}

function getm() {
  //分  
  m = date.getMinutes();
  return m
}


function gets() {
  //秒  
  s = date.getSeconds();
  return s
}

function getYMD() {
  Y = date.getFullYear();
  M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  YMD = Y + "-" + M + "-" + D
  return YMD
}

function getYMDhms() {
  Y = date.getFullYear();
  M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  h = date.getHours();
  m = date.getMinutes();
  s = date.getSeconds();
  YMDhms = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s
  return YMDhms
}

function getYesterdayY() {
  //年  
  Y_yesterday = date_yesterday.getFullYear();
  return Y_yesterday
}

function getYesterdayM() {
  //月  
  M_yesterday = (date_yesterday.getMonth() + 1 < 10 ? '0' + (date_yesterday.getMonth() + 1) : date_yesterday.getMonth() + 1);
  return M_yesterday
}

function getYesterdayD() {
  //日  
  D_yesterday = date_yesterday.getDate() < 10 ? '0' + date_yesterday.getDate() : date_yesterday.getDate();
  return D_yesterday
}

function getYesterdayYMD() {
  Y_yesterday = date_yesterday.getFullYear();
  M_yesterday = (date_yesterday.getMonth() + 1 < 10 ? '0' + (date_yesterday.getMonth() + 1) : date_yesterday.getMonth() + 1);
  D_yesterday = date_yesterday.getDate() < 10 ? '0' + date_yesterday.getDate() : date_yesterday.getDate();
  YMD_yesterday = Y_yesterday + "-" + M_yesterday + "-" + D_yesterday
  return YMD_yesterday
}


function getTomorrowY() {
  //年  
  Y_tom = date_tom.getFullYear();
  return Y_tom
}

function getTomorrowM() {
  //月  
  M_tom = (date_tom.getMonth() + 1 < 10 ? '0' + (date_tom.getMonth() + 1) : date_tom.getMonth() + 1);
  return M_tom
}

function getTomorrowD() {
  //日  
  D_tom = date_tom.getDate() < 10 ? '0' + date_tom.getDate() : date_tom.getDate();
  return D_tom
}

function getTomorrowYMD() {
  Y_tom = date_tom.getFullYear();
  M_tom = (date_tom.getMonth() + 1 < 10 ? '0' + (date_tom.getMonth() + 1) : date_tom.getMonth() + 1);
  D_tom = date_tom.getDate() < 10 ? '0' + date_tom.getDate() : date_tom.getDate();
  YMD_tom = Y_tom + "-" + M_tom + "-" + D_tom
  return YMD_tom
}

module.exports = {
  YMDhms: YMDhms,
  YMD: YMD,
  Y:Y,
  M:M,
  D:D,
  h:h,
  m:m,
  s:s,
  YMD_yesterday: YMD_yesterday,
  Y_yesterday: Y_yesterday,
  M_yesterday: M_yesterday,
  D_yesterday: D_yesterday,

  getY: getY,
  getM: getM,
  getD: getD,
  geth: geth,
  getm: getm,
  gets: gets,
  getYMD: getYMD,
  getYMDhms: getYMDhms,

  getYesterdayY: getYesterdayY,
  getYesterdayM: getYesterdayM,
  getYesterdayD: getYesterdayD,
  getYesterdayYMD: getYesterdayYMD,

  getTomorrowY: getTomorrowY,
  getTomorrowM: getTomorrowM,
  getTomorrowD: getTomorrowD,
  getTomorrowYMD: getTomorrowYMD,

  newTime: newTime
}

/*
var util = require('../../utils/util.js');

var date = util.formatTime; //返回当前时间对象

var timestamp = Date.parse(new Date());
timestamp = timestamp / 1000;
console.log("当前时间戳为：" + timestamp);

//获取当前时间  
var n = timestamp * 1000;
var date = new Date(n);
//年  
var Y = date.getFullYear();
//月  
var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
//日  
var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
//时  
var h = date.getHours();
//分  
var m = date.getMinutes();
//秒  
var s = date.getSeconds();
var date_ymd = Y + M + D

console.log("当前时间：" + Y + M + D + h + ":" + m + ":" + s);
console.log(date)
console.log(date.getDate())
module.exports = {
  date_ymd: date_ymd 
}
*/