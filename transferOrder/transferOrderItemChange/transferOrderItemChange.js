//???假设有两种东西 我已经送件了一种 那另外一种还能送检吗？
var condition = require('../../utils/condition.js');
var globaldata = require('../../utils/globaldata.js');
var time = require('../../utils/time.js');
Page({
  data: {
    name: '',
    role:'',
    authority:'',
    user_id:'',
    warehouse_list:'',
    warehouse_id:'',
    date: '',//选择的时间
    date_today: '',//今天的时间
    date_today_YMDhms:'',
    supplier_id: '', //supplier message
    supplier_name: '',
    material_id: '', //material message
    material_name: '',
    material_no: '',
    material_product_line: '',
    supply:'', //供货信息
    all_storage_location:'', //所有库位信息
    source_storage_location_name:'',
    target_storage_location_name:'',
    chosen_transfer_order:'',
    chosen_transfer_order_item:'',
    transfer_order_item_list: '',
    index: '',//选择的条目顺序
    //storage_location:'',
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
      all_storage_location: globaldata.all_storage_location
    })
    //传递上个页面给的参数
    //json数据用wx.navigateTo需要先用JSON.stringify转码再用JSON.parse转码
    var supply_json = JSON.parse(query.supply)
    var chosen_transfer_order_json = JSON.parse(query.chosen_transfer_order)
    var chosen_transfer_order_item_json = JSON.parse(query.chosen_transfer_order_item)
    this.setData({
      supply: supply_json,
      chosen_transfer_order: chosen_transfer_order_json,
      chosen_transfer_order_item:chosen_transfer_order_item_json,
      supplier_id: query.supplier_id,
      supplier_name: query.supplier_name,
      material_id: query.material_id,
      material_name: query.material_name,
      source_storage_location_name: query.source_storage_location_name,
      target_storage_location_name: query.target_storage_location_name
    });
  },
  
  update: function (e) {
    var that = this
    var form = e.detail.value

    var object_output_transfer_order_item = {
      "id": that.data.chosen_transfer_order_item.id,
      "transferOrderId": that.data.chosen_transfer_order_item.transferOrderId,
      "supplyId": that.data.chosen_transfer_order_item.supplyId, 
      "sourceStorageLocationId": that.data.chosen_transfer_order_item.sourceStorageLocationId,
      "sourceUnit": that.data.chosen_transfer_order_item.sourceUnit,
      "sourceUnitAmount": that.data.chosen_transfer_order_item.sourceUnitAmount,
      "targetStorageLocationId": that.data.chosen_transfer_order_item.targetStorageLocationId,
      "scheduledAmount": that.data.chosen_transfer_order_item.scheduledAmount,
      "state": that.data.chosen_transfer_order_item.state,
      "realAmount": form.realAmount,
      "unit": form.unit,
      "unitAmount":form.unitAmount,
      "comment": that.data.chosen_transfer_order_item.comment,
      "operateTime": form.operateTime,
      "personId": that.data.user_id
    }
    console.log(object_output_transfer_order_item)
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'transfer_order_item/',
      data: [object_output_transfer_order_item],
      method: 'PUT',
      header: {'content-type': 'application/json'},
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'transfer_order_item/')
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
      complete: function () {
        var object_output_transfer_order = {
          "id": that.data.chosen_transfer_order.id,
          "warehouseId": that.data.chosen_transfer_order.warehouseId, //auto 
          "supplierId": that.data.chosen_transfer_order.supplierId,
          "no": that.data.chosen_transfer_order.no,
          "state": that.data.chosen_transfer_order.state,
          "description": that.data.chosen_transfer_order.description,
          "type": that.data.chosen_transfer_order.type,
          "printTimes": that.data.chosen_transfer_order.printTimes,
          "createPersonId": that.data.chosen_transfer_order.createPersonId,
          "createTime": that.data.chosen_transfer_order.createTime,
          "lastUpdatePersonId": that.data.user_id,
          "lastUpdateTime": that.data.YMDhms
        }
        console.log(object_output_transfer_order)
        wx.request({
          url: globaldata.url + 'warehouse/' + globaldata.account + 'transfer_order/',
          data: [object_output_transfer_order],
          method: 'PUT',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(globaldata.url + 'warehouse/' + globaldata.account + 'transfer_order/')
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
          complete: function () {
            wx.navigateBack({
              delta: 1,
            })
          }
        })
      }
    })
  },
  
})