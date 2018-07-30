
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


  enterWarehouseEntry: function () {
    wx.navigateTo({
      //这个url不能是tabBar中的页面
      //url: '../../main/scan/scan'
      url: '../../warehouse/warehouseEntry/warehouseEntry',
      success:function(){
        wx.showToast({
          title: '正在进入 入库单扫码模式',
          icon: 'success',
          duration: 2000,
        })
      }
    })
  },
  enterInspectionNote: function () {
    wx.navigateTo({
      //这个url不能是tabBar中的页面
      //url: '../../main/scan/scan'
      url: '../../inspection/choseWarehouseEntry/choseWarehouseEntry',
      success: function () {
        wx.showToast({
          title: '正在进入 送检单扫码模式',
          icon: 'success',
          duration: 2000,
        })
      }
    })
  },
})