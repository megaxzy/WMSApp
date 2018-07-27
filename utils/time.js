

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
var   YMD = Y +"-"+ M +"-"+ D
var YMDhms = Y + "-" + M + "-" + D + " "+h + ":" + m + ":" + s
console.log("当前时间：" + YMDhms );

module.exports = {
  YMDhms: YMDhms,
  YMD: YMD,
  Y:Y,
  M:M,
  D:D,
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