
var wxTimer = function (initObj) {
  initObj = initObj || {};
  //add
  this.judgeTime = initObj.judgeTime //判断时间

  this.beginTime = initObj.beginTime || "00:00:00";	//开始时间
  this.interval = initObj.interval || 0;				//间隔时间
  this.complete = initObj.complete;					//结束任务
  this.intervalFn = initObj.intervalFn;				//间隔任务
  //this.name = initObj.name;							//当    前计时器在计时器数组对象中的名字

  this.intervarID;									//计时ID
  this.endTime;										//结束时间
  this.endSystemTime;									//结束的系统时间
}

wxTimer.prototype = {
  //开始
  start: function (self) {
    var that = this;
    var date = new Date();
    var now = date.getTime();
    this.endTime =parseInt(this.judgeTime) + now//1970年1月1日的00：00：00的字符串日期
    console.log("this.judgeTime= " + this.judgeTime)
    console.log("now= " + now)
    console.log("this.endTime= "+ this.endTime)

    //开始倒计时
    var count = 0; //这个count在这里应该是表示s数，js中获得时间是ms，所以下面*1000都换成ms
    function begin() {
      count++
      var tmpTime = new Date().getTime();
      

      //结束执行函数
      if (that.endTime <= tmpTime) {
        if (that.complete) {
          that.complete();
        }
        that.stop();
      }
    }
    begin();
    this.intervarID = setInterval(begin, 10);
  },
  //结束
  stop: function () {
    clearInterval(this.intervarID);
  },

}

module.exports = wxTimer;










/*
    var that = this;
    var date = new Date();
    var now = date.getTime();
    this.endTime = now+this.judgeTime//1970年1月1日的00：00：00的字符串日期
    this.endSystemTime = new Date(Date.now() + this.endTime);
     */








/*function judgeTime() {
  var that = this
  var date = new Date();
  var now = date.getTime();
  console.log("panduan " + now)
  console.log("panduas " + that.data.scan_time)
  while (1) {
    var date = new Date();
    var now = date.getTime();
    var x = now - that.data.scan_time
    console.log("x=" + x)
    if (now - that.data.scan_time > 4000) {
      break
    }
  }
  console.log("成功jishi")
  return 1;
}
module.exports = {
  judgeTime:judgeTime
}*/