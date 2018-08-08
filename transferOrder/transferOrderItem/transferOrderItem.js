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
    transfer_order_item_source_storage_location_array:[],
    transfer_order_item_target_storage_location_array:[],
    chosen_transfer_order:'',
    transfer_order_item_list: '',
    index: '',//选择的条目顺序
    hide: [],
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
    console.log(query.chosen_transfer_order)
    var chosen_transfer_order_json = JSON.parse(query.chosen_transfer_order)
    this.setData({
      supply: supply_json,
      chosen_transfer_order: chosen_transfer_order_json,
      supplier_id: query.supplier_id,
      supplier_name: query.supplier_name,
      material_id: query.material_id,
      material_name: query.material_name,
      material_no: query.material_no,
      material_product_line: query.material_product_line
    });
    that.getTransferOrderItem()
    //that.getStorageLocation()
  },
 
  getTransferOrderItem: function () {
    var that = this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('transferOrderId', 'EQUAL', that.data.chosen_transfer_order.id);
    con = condition.AddCondition('supplyId', 'EQUAL', that.data.supply.id);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'transfer_order_item/' + con,
      method: 'GET',
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'transfer_order_item/' + con)
        var res_temp = res
        that.setData({
          transfer_order_item_list: res_temp
        })
        console.log('transfer 信息：')
        console.log(that.data.transfer_order_item_list)
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
        var hide = [];
        var transfer_order_item_source_storage_location_array=[];
        var transfer_order_item_target_storage_location_array = [];
        for (var i = 0; i < that.data.transfer_order_item_list.data.length; i++) {
          hide.push(true);//添加数组的功能
          var id_s = that.data.transfer_order_item_list.data[i].sourceStorageLocationId
          var id_t = that.data.transfer_order_item_list.data[i].targetStorageLocationId
          for (var j = 0; j < that.data.all_storage_location.data.length; j++) {
            if (that.data.all_storage_location.data[j].id==id_s){
              transfer_order_item_source_storage_location_array.push(that.data.all_storage_location.data[j].name)
            }
            if (that.data.all_storage_location.data[j].id == id_t) {
              transfer_order_item_target_storage_location_array.push(that.data.all_storage_location.data[j].name)
            }
          }
        }
        that.setData({
          hide: hide,
          transfer_order_item_source_storage_location_array: transfer_order_item_source_storage_location_array,
          transfer_order_item_target_storage_location_array: transfer_order_item_target_storage_location_array
        })
        console.log(transfer_order_item_source_storage_location_array)
        console.log(transfer_order_item_target_storage_location_array)
      }
    })
  },

  choseItem: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;

    var supply = JSON.stringify(that.data.supply);
    var chosen_transfer_order = JSON.stringify(that.data.chosen_transfer_order);
    
    var chosen_transfer_order_item = that.data.transfer_order_item_list.data[index]
    console.log(chosen_transfer_order_item)
    var chosen_transfer_order_item = JSON.stringify(chosen_transfer_order_item);
    console.log(chosen_transfer_order_item)
    var transvar =
      'chosen_transfer_order=' + chosen_transfer_order + '&' +  //选择的 
      'chosen_transfer_order_item=' + chosen_transfer_order_item + '&' +  //选择的 item
      'supply=' + supply + '&' +
      'supplier_id=' + that.data.supplier_id + '&' +
      'supplier_name=' + that.data.supplier_name + '&' +
      'material_id=' + that.data.material_id + '&' +
      'material_name=' + that.data.material_name + '&' +
      'source_storage_location_name=' + that.data.transfer_order_item_source_storage_location_array[index] + '&' +
      'target_storage_location_name=' + that.data.transfer_order_item_target_storage_location_array[index] 
    wx.navigateTo({
      url: '../../transferOrder/transferOrderItemChange/transferOrderItemChange' + '?' + transvar
    })
  },
  /*
  updateAllItem:function(form,i){
    var that = this 
    var object_output_delivery_order_item = {
      "id": that.data.chosen_delivery_order_item.id,
      "deliveryOrderId": that.data.chosen_delivery_order_item.deliveryOrderId,
      "supplyId": that.data.chosen_delivery_order_item.supplyId,
      "sourceStorageLocationId": that.data.chosen_delivery_order_item.sourceStorageLocationId,
      "state": 0,//0:待装车 1:装车中 2:装车完成   这个好像是后台自动改变的
      "scheduledAmount": that.data.chosen_delivery_order_item.scheduledAmount,
      "realAmount": form.realAmount,
      "loadingTime": form.loadingTime,
      "unit": form.unit,
      "unitAmount": form.unitAmount,
      "comment": that.data.chosen_delivery_order_item.comment,
      "personId": that.data.user_id
    }
    console.log(object_output_delivery_order_item)
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'delivery_order_item/',
      data: [object_output_delivery_order_item],
      method: 'PUT',
      header: {'content-type': 'application/json'},
      success: function (res) {
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
      complete: function () {
        if (i < that.data.transfer_order_item_list.data.length-1){
          that.updateAllItem(form,i+1)
        }
      }
    })
  },*/

 
  update: function (e) {
    var that = this 
    var form = e.detail.value
    console.log("form messages")
    console.log(form.sourceUnit0)
    console.log(form.sourceUnit1)
/*
        console.log("delivery order:")
        var object_output_delivery_order = {
          "id": that.data.delivery_order.id,
          "warehouseId": that.data.delivery_order.warehouseId, //auto 
          "no": that.data.delivery_order.no,
          "state": that.data.delivery_order.state,
          "description": that.data.delivery_order.description,
          "driverName":that.data.delivery_order.driverName,
          "liscensePlateNumber": that.data.delivery_order.liscensePlateNumber,
          "deliverTime": that.data.delivery_order.deliverTime,
          "returnNoteNo":that.data.delivery_order.returnNoteNo,
          "returnNoteTime": that.data.delivery_order.returnNoteTime,
          "createPersonId": that.data.delivery_order.createPersonId,
          "createTime": that.data.delivery_order.createTime,
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
              icon: 'none',
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

    })*/
  },
})