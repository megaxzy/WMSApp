
var timestamp = Date.parse(new Date());
timestamp = timestamp / 1000;
console.log("当前时间戳为：" + timestamp);
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

function newTime() {
  timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  n = timestamp * 1000;
  date = new Date(n);
  Y = date.getFullYear();
  M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  h = date.getHours();
  m = date.getMinutes();
  s = date.getSeconds();
  YMD = Y + "-" + M + "-" + D
  YMDhms = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s
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
  YMD = Y + "-" + M + "-" + D
  return YMD
}

function getYMDhms() {
  YMDhms = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s
  return YMDhms
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
  getY: getY,
  getM: getM,
  getD: getD,
  geth: geth,
  getm: getm,
  gets: gets,
  getYMD: getYMD,
  getYMDhms: getYMDhms,
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