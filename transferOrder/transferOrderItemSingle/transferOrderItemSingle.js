//C37800031 181024 001 F1062284
//C37800031181024001F1062284
var condition = require('../../utils/condition.js');
var globaldata = require('../../utils/globaldata.js');
var time = require('../../utils/time.js');
var timer = require('../../utils/wxTimer.js'); 
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
    chosen_transfer_order: '',
    transfer_order_item_list: '',
    index: '',//选择的条目顺序
    hide: [],
    scan_success: '0',
    scan_model:'2',
    focus:'false',
    first_come:'0',
    //所有的码
    barcode: [],
    //判断长度
    codeLength:'',
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
      date_today_YMDhms: YMDhms,
      barcode: globaldata.transfer_barcode,
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
      supply: '',
      rescode: '',
      first_come:1,
      focus:'true'
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
        supply: '',
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
        supply:'',
      });
    }
  },

  scan_gun: function (e) {
    var that = this
    var value = e.detail.value
    var success=1
    that.setData({
      codeLength:value.length,
    });
    if (that.data.scan_model == 1) {
      /*
      if (!(/^[0-9]*$/.test(value))) {
        that.setData({
          rescode: ''
        });
      }
      else {
        if ((/^[0-9]{7}$/.test(value))) { 
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
      }*/
    }
    else if (that.data.scan_model == 2) {
      if (!(/^[0-9,A-Z]*$/.test(value))) {
        that.setData({
          rescode: ''
        });
      }
      else {
        if (value.length == 1) {
          var x = new Date();
          var y = x.getTime();
          console.log("当前时间戳【扫码开始】为：" + y);
        }
          if(value.length>=24){
            //开启定时器
            var wxTimer = new timer({
              judgeTime: "70",
              complete: function () {
                console.log("完成了")
                if (that.data.codeLength == value.length && value.length!=24) {  
                  that.setData({
                    rescode: value,
                    //focus:false,
                  });
                  var barcode = that.data.barcode

                  for (var i = 0; i < barcode.length; i++) {
                    if (barcode[i] == value) {
                      wx.showModal({
                        title: '警告！！！',
                        content: '条码重复扫描',
                        showCancel: false,
                      })
                      that.setData({
                        rescode: '',
                      });
                      success = 0
                    }
                  }
                  if (success == 1) {
                    that.setData({
                      rescode: value,
                    });
                    var x = new Date();
                    var y = x.getTime();
                    console.log("当前时间戳【扫码end】为：" + y);
                    that.getSupply()
                  }
                }
              }
            })
            wxTimer.start(that);
          }
      }
    }
  },

  getTransferOrderItem: function () {
    var that = this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('transferOrderId', 'EQUAL', that.data.chosen_transfer_order.id);
    if (that.data.supply != '') {
      con = condition.AddCondition('supplyId', 'EQUAL', that.data.supply.id);
    }
    if (that.data.scan_model == 2 && that.data.rescode.length != 0) {
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
      complete: function () {
        if (that.data.transfer_order_item_list.data.length == 1 && that.data.first_come == 0) {
        }
        if (that.data.first_come == 1) {
          that.setData({
            first_come: 0
          })
        }
      }
    })
  },


  recover: function () {
    var that = this
    that.data
    that.setData({
      supply: '',
      rescode:'',
    })
    that.getTransferOrderItem()
  },

  scan: function () {
    var that = this
    var rescode = ''
    var success = 1
    wx.scanCode({
      success: (res) => {
        console.log(res)
        that.setData({
          rescode: res.result
        });
        rescode = res.result
        console.log(that.data.rescode)
      },
      complete: function () {
        var barcode = that.data.barcode
        console.log("缓存的")
        console.log(barcode)
        for (var i = 0; i < barcode.length; i++) {
          if (barcode[i] == rescode) {
            wx.showModal({
              title: '警告！！！',
              content: '条码重复扫描',
              showCancel: false,
            })
            that.setData({
              rescode: ''
            });
            success = 0
          }
        }
        if (success == 1) {
          that.setData({
            rescode: rescode
          });
          that.getSupply()
        }
      }
    })
  },
  getSupply: function () {
    //获得供货信息
    var that = this
    that.setData({
      scan_success: '0'
    })
    var rescode
    if (that.data.scan_model == 1) {
      rescode = that.data.rescode
    }
    if (that.data.scan_model == 2) {
      rescode = that.data.rescode.slice(0,9)
    }
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('barCodeNo', 'EQUAL', rescode);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'supply/' + con,
      method: 'GET',
      success: function (res) {
        //console.log("succeed connect")
        //console.log(globaldata.url + 'warehouse/' + globaldata.account + 'supply/' + con)
        var res_temp = res
        if (res_temp.data.length == 0) {
          wx.showModal({
            title: '警告！！！',
            content: '该供货码不存在',
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
                supply: res_temp.data[0],
                scan_success:'1'
              })
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
        if(that.data.scan_success=='1'){
          that.setData({
            scan_success: '0'
          })
        }
        that.update()
        that.getTransferOrderItem()
      }
    })
  },



  update: function () {
    var that = this
    var res_temp
    var index = -1
    for (var i = 0; i < that.data.transfer_order_item_list.data.length; i++) {
      if (that.data.transfer_order_item_list.data[i].supplyId == that.data.supply.id) {
        index = i
      }
    }
    if (that.data.transfer_order_item_list.data[index].realAmount == that.data.transfer_order_item_list.data[index].scheduledAmount) {
      wx.showModal({
        title: '错误',
        content: '该条目【计划数量装车】已完成',
        showCancel: false,
      })
    }
    else {
      var realAmount = that.data.transfer_order_item_list.data[index].realAmount / that.data.transfer_order_item_list.data[index].unitAmount + 1
      var object_output_transfer_order_item = {
        "id": that.data.transfer_order_item_list.data[index].id,
        "transferOrderId": that.data.transfer_order_item_list.data[index].transferOrderId,
        "supplyId": that.data.transfer_order_item_list.data[index].supplyId,
        "sourceStorageLocationId": that.data.transfer_order_item_list.data[index].sourceStorageLocationId,
        "sourceUnit": that.data.transfer_order_item_list.data[index].sourceUnit,
        "sourceUnitAmount": that.data.transfer_order_item_list.data[index].sourceUnitAmount,
        "targetStorageLocationId": that.data.transfer_order_item_list.data[index].targetStorageLocationId,
        "scheduledAmount": that.data.transfer_order_item_list.data[index].scheduledAmount,
        "realAmount": realAmount * that.data.transfer_order_item_list.data[index].unitAmount,
        "unit": that.data.transfer_order_item_list.data[index].data[index].unit,
        "unitAmount": that.data.transfer_order_item_list.data[index].data[index].unitAmount,
        "comment": that.data.transfer_order_item_list.data[index].data[index].comment,
        "operateTime": that.data.date_today_YMDhms,
        "personId": that.data.user_id
      }
      console.log(object_output_transfer_order_item)
      wx.request({
        url: globaldata.url + 'warehouse/' + globaldata.account + 'transfer_order_item/',
        data: [object_output_transfer_order_item],
        method: 'PUT',
        header: { 'content-type': 'application/json' },
        success: function (res) {
          console.log(res)
          res_temp = res
        },
        //请求失败
        fail: function (err) {
          console.log("false")
          wx.showModal({
            title: '连接失败,请检查你的网络或者服务端是否开启',
            content: '',
            showCancel: false,
          })
        },
        complete: function () {
          if (res_temp.statusCode == 200) {
            wx.showToast({
              title: '存入成功',
              icon: 'success',
              duration: 200,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  
                }, 200)
              }
            })
          }
          else {
            wx.showModal({
              title: '错误',
              content: '' + res_temp.data,
              showCancel: false,
            })
          }
        }
      })
    }

  },




})