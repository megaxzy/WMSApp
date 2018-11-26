//C37800031 181024 001 F1062284
//C37800031181024001F1062284
var condition = require('../../utils/condition.js');
var globaldata = require('../../utils/globaldata.js');
var time = require('../../utils/time.js');
Page({
  data: {
    name: '',
    role:'',
    authority:'',
    user_id:'',
    warehouse_id:'',
    date: '',//选择的时间
    date_today: '',//今天的时间
    date_today_YMDhms: '',//今天的时间
    supply:'', //供货信息
    chosen_transfer_order:'',
    transfer_order_item_list: '',
    index: '',//选择的条目顺序
    hide: [],
    scan_success:'0',
    scan_model:'1',
    rescode:'',
    first_come: '0',
  },
  onLoad: function (query) {
    var that = this
    //获取现在时间
    time.newTime()
    var Y = time.getY()
    var M = time.getM()
    var D = time.getD()
    var date = Y + '-' + M + '-' + D
    var YMDhms = time.getYMDhms()
    console.log("当前时间：" + time.getYMDhms());
    this.setData({
      name:globaldata.user_name,
      role:globaldata.user_role,
      user_id:globaldata.user_id,
      warehouse_id:globaldata.chosen_warehouse.id,
      date:date,
      date_today:date,
      date_today_YMDhms: YMDhms
    })
    console.log(query.chosen_transfer_order)
    var chosen_transfer_order_json = JSON.parse(query.chosen_transfer_order)
    this.setData({
      chosen_transfer_order: chosen_transfer_order_json
    }); 
    that.getTransferOrderItem()
  },
 
 
  onShow: function () {
    var that = this
 
    that.setData({
      supply:'',
      rescode:'',
      supply:'',
      first_come: 1,
    }); 
    that.getTransferOrderItem()
  },

  change_scan_model_1: function (e) {
    var that = this
    var form = e.detail.value
    if (that.data.scan_model == 2) {
      that.setData({
        scan_model: '1',
        rescode: '',
        supply:'',
      });
    }
  },
  change_scan_model_2: function (e) {
    var that = this
    var form = e.detail.value
    if (that.data.scan_model == 1) {
      that.setData({
        scan_model: '2',
        rescode: '',
        supply: '',
      });
    }
    //连续扫码跳转
    that.singleTrans()
  },

  singleTrans: function () {
    var that = this
    var chosen_transfer_order = that.data.chosen_transfer_order
    chosen_transfer_order = JSON.stringify(chosen_transfer_order);
    console.log("123456789456789")
    console.log(chosen_transfer_order)
    var transvar =
      'chosen_transfer_order=' + chosen_transfer_order
    wx.navigateTo({
      url: '../../transferOrder/transferOrderItemSingle/transferOrderItemSingle' + '?' + transvar
    })
  },
  scan_gun: function (e) {
    var that = this
    var value = e.detail.value
    if (that.data.scan_model == 1) {
      if (!(/^[0-9]*$/.test(value))) {
        that.setData({
          rescode: ''
        });
      }
      else {
        if ((/^[0-9]{7}$/.test(value))) {  //TODO 26
          that.setData({
            rescode: value
          });
          console.log(that.data.rescode)
          that.getSupply()
        }
        else {
          if ((/^[0-9]{8,9}$/.test(value))) {
          }
        }
      }
    }
    else if (that.data.scan_model == 2) {
      if (!(/^[0-9,A-Z]*$/.test(value))) {
        that.setData({
          rescode: ''
        });
      }
      else {
        if ((/^[0-9,A-Z]{26}$/.test(value))) {  //TODO 26
          that.setData({
            rescode: value
          });
          console.log(that.data.rescode)
          that.getSupply()
        }
        else {
          if ((/^[0-9,A-Z]{27,28}$/.test(value))) {
          }
        }
      }
    }

  },


  getTransferOrderItem: function () {
    var that = this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('transferOrderId', 'EQUAL', that.data.chosen_transfer_order.id);
    if(that.data.supply!=''){
      con = condition.AddCondition('supplyId', 'EQUAL', that.data.supply.id);
    }
    if (that.data.scan_model == 2 && that.data.rescode.length!=0) {
      con = condition.AddCondition('unitAmount', 'EQUAL', that.data.rescode.slice(15, 18));
    }
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'transfer_order_item/' + con,
      method: 'GET',
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'transfer_order_item/' + con)
        var res_temp = res
        that.setData({
          transfer_order_item_list: res_temp
        })
        console.log('transfer 信息：', that.data.transfer_order_item_list)
      },
      //请求失败
      fail: function (err) {
        console.log("false")
        wx.showToast({
          title: '连接失败,请检查你的网络或者服务端是否开启',
          icon: 'none',
          duration: 2000
        })
      },
      complete:function(){
        if (that.data.transfer_order_item_list.data.length == 1 && that.data.first_come == 0) {
          that.directTrans()
        }
        if (that.data.first_come == 1) {
          that.setData({
            first_come: 0
          })
        }
      }
    })
  },

  choseItem: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;

    var chosen_transfer_order = JSON.stringify(that.data.chosen_transfer_order);    
    var chosen_transfer_order_item = that.data.transfer_order_item_list.data[index]
    var chosen_transfer_order_item = JSON.stringify(chosen_transfer_order_item)
  
    var transvar =
      'chosen_transfer_order=' + chosen_transfer_order + '&' +  
      'chosen_transfer_order_item=' + chosen_transfer_order_item 
    wx.navigateTo({
      url: '../../transferOrder/transferOrderItemChange/transferOrderItemChange' + '?' + transvar
    })
  },
 
  directTrans: function () {
    var that = this
    var index = 0

    var chosen_transfer_order = JSON.stringify(that.data.chosen_transfer_order);
    var chosen_transfer_order_item = that.data.transfer_order_item_list.data[index]
    var chosen_transfer_order_item = JSON.stringify(chosen_transfer_order_item)

    var transvar =
      'chosen_transfer_order=' + chosen_transfer_order + '&' +
      'chosen_transfer_order_item=' + chosen_transfer_order_item
    wx.navigateTo({
      url: '../../transferOrder/transferOrderItemChange/transferOrderItemChange' + '?' + transvar
    })
  },

  scan: function () {
    var that = this
    //扫码
    wx.scanCode({
      success: (res) => {
        console.log(res)
        that.setData({
          rescode: res.result
        });
      },
      complete: function () {

        console.log(that.data.rescode)
        that.getSupply()

      }
    })
  },
  getSupply: function () {
    var that = this
    that.setData({
      scan_success:'0'
    })
    var rescode
    if (that.data.scan_model == 1) {
      rescode = that.data.rescode
    }
    if (that.data.scan_model == 2) {
      rescode = that.data.rescode.slice(0, 9)
    }
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('barCodeNo', 'EQUAL', rescode);
    
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'supply/' + con,
      method: 'GET',//GET为默认方法   /POST
      success: function (res) {
        console.log("succeed connect")
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'supply/' + con)
        var res_temp = res
        console.log(res)
        console.log(res_temp.data.length)
        if (res_temp.data.length == 0) {
          wx.showModal({
            title: '警告！！！',
            content: '该供货码不存在',
            showCancel: false,
          })
        }
        else {
          console.log(that.data.chosen_transfer_order.supplierId)
          console.log(res_temp.data[0].supplierId)
          if (that.data.chosen_transfer_order.supplierId != res_temp.data[0].supplierId) {
            wx.showModal({
              title: '警告！！！',
              content: '该供货码不属于该供货商，请切换入库单或修改信息',
              showCancel: false,
            })
          }
          else {
            
            if (res_temp.data[0].warehouseId != that.data.warehouse_id) {
              wx.showModal({
                title: '警告！！！',
                content: '该供货码不属于该仓库，请切换仓库或修改信息',
                showCancel: false,
              })
            }
            else {
              that.setData({
                supply: res_temp.data[0]
              })
              console.log("supply 是什么")
              console.log(that.data.supply)
              that.setData({
                scan_success: '1'
              })
            }

          }
        }

      },
      //请求失败
      fail: function (err) {
        console.log("false")
        wx.showToast({
          title: '连接失败,请检查你的网络或者服务端是否开启',
          icon: 'none',
          duration: 2000
        })
      },
      complete: function () {
        if(that.data.scan_gun=='1'){
          wx.showToast({
            title: '扫码成功',//TODO此处还可以使用
            icon: 'success',
            duration: 2000,
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
          that.setData({
            scan_success: '0'
          })
        }
        that.getTransferOrderItem()
      }
    })
  },
  recover: function () {
    var that = this
    that.data
    that.setData({
      supply: '',
      rescode: '',
    })
    that.getTransferOrderItem()
  },
})