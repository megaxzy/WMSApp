
var condition = require('../../utils/condition.js');
var globaldata = require('../../utils/globaldata.js');

Page({
  data: {
    name: '',
    role:'',
    authority:'',
    rescode: ''
  },
  onShow: function () {
    this.setData({
      name:globaldata.user_name,
      role:globaldata.user_role
    })
    console.log(this.data.name)
    console.log(this.data.role)
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