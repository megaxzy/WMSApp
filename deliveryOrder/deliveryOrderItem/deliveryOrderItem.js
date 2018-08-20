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
    warehouse_entry:'', //选择的那个入库单
    warehouse_entry_item:'', //条目信息
    index:'',//选择的条目顺序
    chosen_delivery_order_item:'',
    delivery_order:'',
    storage_location:'',
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
    console.log(query.chosen_delivery_order_item)
    var chosen_delivery_order_item_json = JSON.parse(query.chosen_delivery_order_item)
    this.setData({
      supply: supply_json,
      chosen_delivery_order_item: chosen_delivery_order_item_json,
      supplier_id: query.supplier_id,
      supplier_name: query.supplier_name,
      material_id: query.material_id,
      material_name: query.material_name,
      material_no: query.material_no,
      material_product_line: query.material_product_line
    });
    //TODO get the stroageLocation
    that.getDeliveryOrder()
    that.getStorageLocation()
  },

  getStorageLocation: function () {
    var that = this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('id', 'EQUAL', that.data.chosen_delivery_order_item.sourceStorageLocationId);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'storage_location/' + con,
      method: 'GET',
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'storage_location/' + con)
        var res_temp = res
        that.setData({
          storage_location: res_temp.data[0]
        })
        console.log('送检单 信息：')
        console.log(that.data.storage_location)
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





  update: function (e) {
    var that = this 
    var form = e.detail.value
    var res_temp
    console.log("chosen_delivery_order_item:")
    var object_output_delivery_order_item= {
      "id": that.data.chosen_delivery_order_item.id,
      "deliveryOrderId": that.data.chosen_delivery_order_item.deliveryOrderId,
      "supplyId":that.data.chosen_delivery_order_item.supplyId,
      "sourceStorageLocationId": that.data.chosen_delivery_order_item.sourceStorageLocationId,
      "state":0,//0:待装车 1:装车中 2:装车完成   这个好像是后台自动改变的
      "scheduledAmount": that.data.chosen_delivery_order_item.scheduledAmount,
      "realAmount":form.realAmount,
      "loadingTime":form.loadingTime,
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
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        res_temp=res
        
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
        if (res_temp.statusCode==400){
          wx.showToast({
            title: ''+res_temp.data,
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
        else{
          var object_output_delivery_order = {
            "id": that.data.delivery_order.id,
            "warehouseId": that.data.delivery_order.warehouseId, //auto 
            "no": that.data.delivery_order.no,
            "state": that.data.delivery_order.state,
            "description": that.data.delivery_order.description,
            "driverName": that.data.delivery_order.driverName,
            "liscensePlateNumber": that.data.delivery_order.liscensePlateNumber,
            "deliverTime": that.data.delivery_order.deliverTime,
            "returnNoteNo": that.data.delivery_order.returnNoteNo,
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
        
      }

    })
  },
})