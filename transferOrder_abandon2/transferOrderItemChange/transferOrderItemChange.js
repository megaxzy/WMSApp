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
    date_no:'',//时间转no的形式
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
    var Y=time.Y
    var M=time.M
    var D=time.D
    var h=time.h
    var m=time.m
    var s=time.s
    var date=Y+'-'+M+'-'+D
    var date_no=Y+M+D+h+m+s
    var YMDhms=time.YMDhms
    this.setData({
      name:globaldata.user_name,
      role:globaldata.user_role,
      user_id:globaldata.user_id,
      warehouse_id:globaldata.chosen_warehouse.id,
      date:date,
      date_today:date,
      date_today_YMDhms: YMDhms,
      date_no:date_no,
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
  choseItem: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    that.setData({
      index: index,
    })
    var hide = that.data.hide
    if (that.data.hide[index] == true) {
      hide[index] = false
      that.setData({
        hide: hide,
      })
    }
    else {
      hide[index] = true
      that.setData({
        hide: hide,
      })
    }
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
 /*
  getDeliveryOrder:function(){
    var that = this
    var con = condition.NewCondition();
    console.log("noteid test test")
    console.log(that.data.chosen_delivery_order_item)
    con = condition.AddFirstCondition('id', 'EQUAL', that.data.chosen_delivery_order_item.deliveryOrderId);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'delivery_order/' + con,
      method: 'GET',
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'delivery_order/' + con)
        var res_temp = res
        that.setData({
          delivery_order: res_temp.data[0]
        })
        console.log('送检单 信息：')
        console.log(that.data.delivery_order)
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
    })
  },
  */
/*
  showDeliveryOrderItem: function () {
    var that = this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('warehouseEntryItemId', 'EQUAL', that.data.chosen_warehouse_entry_item.id );
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'inspection_note_item/' + con,
      method: 'GET',//GET为默认方法   /POST
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'inspection_note_item/' + con)
        var res_temp = res
        that.setData({
          inspection_note_item: res_temp.data[0]
        })
        console.log('送检单条目信息：')
        console.log(that.data.inspection_note_item)
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
        that.getInspectionNote() //如果这个要显示则放在下一条的完成部分
      }
    })
  },
*/


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
  },


  update: function (e) {
    var that = this 
    var form = e.detail.value
    console.log("form messages")
    console.log(form.sourceUnit0)
    console.log(form.sourceUnit1)
    var i=0
    var x='form.soutceUnit'+i
    console.log(x)
    console.log(form.soutceUnit + "i")
    console.log(form.soutceUnit + "'i'")
   
    that.updateAllItem(form,0)
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