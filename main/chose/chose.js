
var condition = require('../../utils/condition.js');
var globaldata = require('../../utils/globaldata.js');

Page({
  data: {
    name: '',
    role:'',
    authority:'',
    rescode: '',
    warehouse:''
  },
  onShow: function () {
    this.setData({
      name:globaldata.user_name,
      role:globaldata.user_role,
      warehouse: globaldata.chosen_warehouse.name
    })
    console.log(this.data.name)
    console.log(this.data.role)
  },



  link:function(){
    wx.navigateTo({
      url: '../../main/blueTooth/blueTooth',
      success: function () {
        wx.showLoading({
          title: '正在进入 蓝牙选择',
        })
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },
  
  enterWarehouseEntry: function () {
    wx.navigateTo({
      //这个url不能是tabBar中的页面
      //url: '../../main/scan/scan'
      url: '../../warehouse/warehouseEntry/warehouseEntry',
      success:function(){
        wx.showLoading({
          title: '正在进入 入库单扫码模式',
        })
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },
  enterInspectionNote: function () {
    wx.navigateTo({
      //这个url不能是tabBar中的页面
      //url: '../../main/scan/scan'
      url: '../../inspectionNote/inspectionNote/inspectionNote',
      success: function () {
        wx.showLoading({
          title: '正在进入 送检单扫码模式',
        })
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },
  enterTransferOrder: function () {
    wx.navigateTo({
      //这个url不能是tabBar中的页面
      //url: '../../main/scan/scan'
      url: '../../transferOrder/transferOrder/transferOrder',
      success: function () {
        wx.showLoading({
          title: '正在进入 备货单扫码模式',
        })
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },
  enterDeliveryOrder: function () {
    wx.navigateTo({
      //这个url不能是tabBar中的页面
      //url: '../../main/scan/scan'
      url: '../../deliveryOrder/deliveryOrder/deliveryOrder',
      success: function () {
        wx.showLoading({
          title: '正在进入 出库单扫码模式',
        })
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },
})