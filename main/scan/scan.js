
var condition = require('../../utils/condition.js');
var globaldata = require('../../utils/globaldata.js');
var rescode;

Page({
  data: {
    name: '',
    password: '',
    rescode: ''
  },
  onShow: function () {
  
    this.setData({
      name:globaldata.user_name
    })
    console.log(this.data.name)
  },


  scan: function () {
    wx.scanCode({
      scanType: 'barCode',
      success: (res) => {
        console.log(res)
        rescode=res
        this.setData({rescode:res});
        console.log(res.result)
        console.log(rescode.result)
      }
    })
  },
  enterware: function () {
    
  }
})