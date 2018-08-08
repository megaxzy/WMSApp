
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

  link:function(){
    wx.navigateTo({
      url: '../../main/blueTooth/blueTooth',
      success: function () {
        wx.showToast({
          title: '正在进入 蓝牙选择',
          icon: 'none',
          duration: 2000,
        })
      }
    })
    setTimeout(function () {
      wx.hideToast()
    }, 2000)
  },
  
  enterWarehouseEntry: function () {
    wx.navigateTo({
      //这个url不能是tabBar中的页面
      //url: '../../main/scan/scan'
      url: '../../warehouse/warehouseEntry/warehouseEntry',
      success:function(){
        wx.showToast({
          title: '正在进入 入库单扫码模式',
          icon: 'none',
          duration: 2000,
        })
      }
    })
    setTimeout(function () {
      wx.hideToast()
    }, 2000)
  },
  enterInspectionNote: function () {
    wx.navigateTo({
      //这个url不能是tabBar中的页面
      //url: '../../main/scan/scan'
      url: '../../inspection/inspectionNote/inspectionNote',
      success: function () {
        wx.showToast({
          title: '正在进入 送检单扫码模式',
          icon: 'none',
          duration: 2000,
        })
      }
    })
    setTimeout(function () {
      wx.hideToast()
    }, 2000)
  },
  enterTransferOrder: function () {
    wx.navigateTo({
      //这个url不能是tabBar中的页面
      //url: '../../main/scan/scan'
      url: '../../transferOrder/transferOrder/transferOrder',
      success: function () {
        wx.showToast({
          title: '正在进入 备货单扫码模式',
          icon: 'none',
          duration: 2000,
        })
      }
    })
    setTimeout(function () {
      wx.hideToast()
    }, 2000)
  },
  enterDeliveryOrder: function () {
    wx.navigateTo({
      //这个url不能是tabBar中的页面
      //url: '../../main/scan/scan'
      url: '../../deliveryOrder/deliveryOrder/deliveryOrder',
      success: function () {
        wx.showToast({
          title: '正在进入 出库单扫码模式',
          icon: 'none',
          duration: 2000,
        })
      }
    })
    setTimeout(function () {
      wx.hideToast()
    }, 2000)
  },
})