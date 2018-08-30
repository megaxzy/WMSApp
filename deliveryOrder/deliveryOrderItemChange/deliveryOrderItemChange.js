//???假设有两种东西 我已经送件了一种 那另外一种还能送检吗？
var condition = require('../../utils/condition.js');
var globaldata = require('../../utils/globaldata.js');
var time = require('../../utils/time.js');
Page({
  data: {
    name: '',
    role: '',
    authority: '',
    user_id: '',
    warehouse_list: '',
    warehouse_id: '',
    date: '',//选择的时间
    date_today: '',//今天的时间
    date_today_YMDhms: '',//今天的时间
    supply: '', //供货信息
    chosen_delivery_order: '',
    chosen_delivery_order_item: '',
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
      name: globaldata.user_name,
      role: globaldata.user_role,
      user_id: globaldata.user_id,
      warehouse_id: globaldata.chosen_warehouse.id,
      date: date,
      date_today: date,
      date_today_YMDhms: YMDhms,
    })
    var chosen_delivery_order_item_json = JSON.parse(query.chosen_delivery_order_item)
    this.setData({
      chosen_delivery_order_item: chosen_delivery_order_item_json,
    });
  },

  update: function (e) {
    var that = this
    var form = e.detail.value
    var res_temp
    console.log("chosen_delivery_order_item:")


    var loadingTime = form.loadingTime
    if (loadingTime == '') {
      loadingTime = null
    }
    //TODO 正则表达式  空格
    else if (loadingTime.indexOf(":") == -1) {
      loadingTime = loadingTime + ' ' + '00:00:00'
    }



    var object_output_delivery_order_item = {
      "id": that.data.chosen_delivery_order_item.id,
      "deliveryOrderId": that.data.chosen_delivery_order_item.deliveryOrderId,
      "supplyId": that.data.chosen_delivery_order_item.supplyId,
      "sourceStorageLocationId": that.data.chosen_delivery_order_item.sourceStorageLocationId,
      "state": 0,//0:待装车 1:装车中 2:装车完成   这个好像是后台自动改变的
      "scheduledAmount": that.data.chosen_delivery_order_item.scheduledAmount,
      "realAmount": form.realAmount,
      "loadingTime": loadingTime,
      "unit": form.unit,
      "unitAmount": form.unitAmount,
      "comment": form.comment,
      "personId": that.data.user_id
    }
    console.log(object_output_delivery_order_item)
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'delivery_order_item/',
      data: [object_output_delivery_order_item],
      method: 'PUT',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        res_temp = res

        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'delivery_order_item/')
        console.log(res)
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
      /*     
      case 0: return "待装车";
      case 1: return "装车中";
      case 2: return "整单装车";
      case 3: return "发运在途";
      case 4: return "核减完成";
       */

      complete: function () {
        console.log("delivery order:")
        if (res_temp.statusCode == 400) {
          wx.showToast({
            title: '' + res_temp.data,
            icon: 'none',
            duration: 4000,
            success: function () {
              setTimeout(function () {
                //要延时执行的代码
                wx.hideToast()
              }, 4000)
            }
          })
        }
        else {
          var object_output_delivery_order = {
            "id": that.data.chosen_delivery_order.id,
            "warehouseId": that.data.chosen_delivery_order.warehouseId, //auto 
            "no": that.data.chosen_delivery_order.no,
            "state": that.data.chosen_delivery_order.state,
            "description": that.data.chosen_delivery_order.description,
            "driverName": that.data.chosen_delivery_order.driverName,
            "liscensePlateNumber": that.data.chosen_delivery_order.liscensePlateNumber,
            "deliverTime": that.data.chosen_delivery_order.deliverTime,
            "returnNoteNo": that.data.chosen_delivery_order.returnNoteNo,
            "returnNoteTime": that.data.chosen_delivery_order.returnNoteTime,
            "createPersonId": that.data.chosen_delivery_order.createPersonId,
            "createTime": that.data.chosen_delivery_order.createTime,
            "lastUpdatePersonId": that.data.user_id,
            "lastUpdateTime": that.data.YMDhms
          }
          console.log(object_output_delivery_order)
          wx.request({
            url: globaldata.url + 'warehouse/' + globaldata.account + 'delivery_order/',
            data: [object_output_delivery_order],
            method: 'PUT',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(globaldata.url + 'warehouse/' + globaldata.account + 'delivery_order/')
              console.log(res)
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 2500,
                success: function () {
                  setTimeout(function () {
                    //要延时执行的代码
                    wx.navigateBack();
                  }, 1500)
                }
              })
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

            }
          })
        }

      }

    })
  },
})