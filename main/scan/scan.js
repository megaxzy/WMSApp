
var condition = require('../../utils/condition.js');
var rescode;
var that;
Page({
  data: {
    name: '',
    password: '',
    rescode:''
  },

  // 获取输入账号 
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
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