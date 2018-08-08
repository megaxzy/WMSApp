//TODO 库位编码联想  自动获取入库库位名称
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
    default_entry_storage_location_id: '', //默认入库目标库位
    default_entry_storage_location_name: '', //默认入库目标库位
    default_entry_storage_location_no: '', //默认入库目标库位
    default_qualified_storage_location_id: '', //默认入库合格品库位
    default_qualified_storage_location_name: '', //默认入库合格品库位
    default_qualified_storage_location_no: '', //默认入库合格品库位
    default_unqualified_storage_location_id: '', //默认入库不合格品库位
    default_unqualified_storage_location_name: '', //默认入库不合格品库位
    default_unqualified_storage_location_no: '', //默认入库不合格品库位
    warehouse_entry:'', //选择的那个入库单
  },
  onLoad: function (query) {
    var that = this
    //获取现在时间
    time.newTime()
    var Y = time.getY()
    var M = time.getM()
    var D = time.getD()
    var date = Y + '-' + M + '-' + D
    var YMDhms=time.getYMDhms()
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
    var warehouse_entry_json=JSON.parse(query.warehouse_entry)
    console.log(query.default_qualified_storage_location_name)
    console.log(query.default_qualified_storage_location_no)
    this.setData({
      supply: supply_json,
      supplier_id: query.supplier_id,
      supplier_name: query.supplier_name,
      material_id: query.material_id,
      material_name: query.material_name,
      material_no: query.material_no,
      material_product_line: query.material_product_line,
      default_entry_storage_location_name: query.default_entry_storage_location_name, 
      default_entry_storage_location_no: query.default_entry_storage_location_no, 
      default_qualified_storage_location_name: query.default_qualified_storage_location_name, 
      default_qualified_storage_location_no: query.default_qualified_storage_location_no, 
      default_unqualified_storage_location_name: query.default_unqualified_storage_location_name,
      default_unqualified_storage_location_no: query.default_unqualified_storage_location_no, 
      warehouse_entry:warehouse_entry_json
    });
    
    console.log(that.data.supply)
  },
  
  create: function (e) {
    var that = this 
    var form = e.detail.value
    console.log(form.qualifiedLocationName)
    console.log(form.unqualifiedLocationName)
    
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('name', 'EQUAL', form.storageLocationName);
    con = condition.AddCondition('no', 'EQUAL', form.storageLocationNo);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'storage_location/' + con,
      method: 'GET',
      success: function (res) {
        console.log("succeed connect1")
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'storage_location/' + con)
        var res_temp = res
        if (res_temp.data.length != 0){
          that.setData({
            default_entry_storage_location_id: res_temp.data[0].id, //默认入库目标库位
          })
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
      complete:function(){
        var con = condition.NewCondition();
        con = condition.AddFirstCondition('name', 'EQUAL', form.qualifiedLocationName);
        con = condition.AddCondition('no', 'EQUAL', form.qualifiedLocationNo);
        wx.request({
          url: globaldata.url + 'warehouse/' + globaldata.account + 'storage_location/' + con,
          success: function (res) {
            console.log("succeed connect1")
            console.log(globaldata.url + 'warehouse/' + globaldata.account + 'storage_location/' + con)
            var res_temp = res
            if (res_temp.data.length != 0) {
              that.setData({
                default_qualified_storage_location_id: res_temp.data[0].id, //默认入库目标库位
              })
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
            var con = condition.NewCondition();
            con = condition.AddFirstCondition('name', 'EQUAL', form.unqualifiedLocationName);
            con = condition.AddCondition('no', 'EQUAL', form.unqualifiedLocationNo);
            wx.request({
              url: globaldata.url + 'warehouse/' + globaldata.account + 'storage_location/' + con,
              success: function (res) {
                console.log("succeed connect1")
                console.log(globaldata.url + 'warehouse/' + globaldata.account + 'storage_location/' + con)
                var res_temp = res
                if (res_temp.data.length != 0) {
                  that.setData({
                    default_unqualified_storage_location_id: res_temp.data[0].id, //默认入库目标库位
                  })
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
                var res_message
                console.log("warehouseEntry:")
                console.log(that.data.warehouse_entry)
                console.log(that.data.default_entry_storage_location_id)
                console.log(that.data.default_qualified_storage_location_id)
                console.log(that.data.default_unqualified_storage_location_id)
                var object_output = {
                  "warehouseEntryId": that.data.warehouse_entry.id,//auto
                  "supplyId": that.data.supply.id, //auto 
                  "storageLocationId": that.data.default_entry_storage_location_id,//input-get
                  "qualifiedStorageLocationId": that.data.default_qualified_storage_location_id, //input-get
                  "unqualifiedStorageLocationId": that.data.default_unqualified_storage_location_id, //input-get
                  "expectedAmount": form.expectedAmount, //auto/input
                  "realAmount": form.realAmount, //auto/input
                  "unit": form.unit, //auto/input
                  "unitAmount": form.unitAmount, //auto/input
                  "inspectionAmount": form.inspectionAmount, //auto/input
                  "state": form.state, //auto/input 
                  "refuseAmount": form.refuseAmount, //auto/input
                  "refuseUnit": form.refuseUnit, //auto/input
                  "refuseUnitAmount": form.refuseUnitAmount, //auto/input
                  "personId": globaldata.user_id, //auto
                  "comment": form.comment, //input 
                  "manufactureNo": form.manufactureNo,//input
                  //???这时间应该是哪个 两个是否需要统一
                  "inventoryDate": time.YMDhms,//auto
                  //"manufactureDate": form.manufactureDate,//input
                  //"expiryDate": form.expiryDate//input
                }    
                console.log(object_output)
                wx.request({
                  url: globaldata.url + 'warehouse/' + globaldata.account + 'warehouse_entry_item/',
                  //url: 'http://localhost:9000/warehouse/WMS_Template/material/',
                  data:[object_output],
                  /*
                  data: [{
                    //e.edtailmaterialNo自动加上前后"" so is that.data...
                    "warehouseEntryId": that.data.warehouse_entry.id,//auto
                    "supplyId": that.data.supply.id, //auto 
                    "storageLocationId": that.data.default_entry_storage_location_id,//input-get
                    "qualifiedStorageLocationId": that.data.default_qualified_storage_location_id, //input-get
                    "unqualifiedStorageLocationId": that.data.default_unqualified_storage_location_id, //input-get
                    "expectedAmount": form.expectedAmount, //auto/input
                    "realAmount": form.realAmount, //auto/input
                    "unit": form.unit, //auto/input
                    "unitAmount": form.unitAmount, //auto/input
                    "inspectionAmount": form.inspectionAmount, //auto/input
                    "state": form.state, //auto/input 
                    "refuseAmount": form.refuseAmount, //auto/input
                    "refuseUnit": form.refuseUnit, //auto/input
                    "refuseUnitAmount": form.refuseUnitAmount, //auto/input
                    "personId": globaldata.user_id, //auto
                    "comment": form.comment, //input 
                    "manufactureNo": form.manufactureNo,//input
                    "inventoryDate": time.YMDhms,//auto
                    //TODO 库位的内容好像只要前面名字对了就行 后面可以自己加东西
                    //TODO 这个地方日期输入为空不行  这个地方应该可以用数据 var={}解决
                    //"manufactureDate": form.manufactureDate,//input
                    //"expiryDate": form.expiryDate//input
                  }],
                  */
                  /*[{"name": "xzy919", "no": "123456"," warehouseId": 1, "enabled": 1}] */
                  method: 'POST',
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    console.log("succeed connect")
                    console.log(res)
                    res_message=res
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
                  //TODOPUT
                  complete:function(){
                    if (res_message.data.length == 1) {
                      console.log("存入成功")
                      //实现入库单信息跟新
                      wx.request({
                        url: globaldata.url + 'warehouse/' + globaldata.account + 'warehouse_entry/',
                        data: [{
                          //e.edtailmaterialNo自动加上前后"" so is that.data...
                          "id": that.data.warehouse_entry.id,
                          "warehouseId": that.data.warehouse_entry.warehouseId,
                          "supplierId":that.data.warehouse_entry.supplierId,
                          "no": that.data.warehouse_entry.no,
                          "description":that.data.warehouse_entry.description,
                          "state":that.data.warehouse_entry.state,
                          "deliverOrderNoSRM": that.data.warehouse_entry.deliverOrderNoSRM,
                          "inboundDeliveryOrderNo": that.data.warehouse_entry.inboundDeliveryOrderNo,
                          "outboundDeliveryOrderNo": that.data.warehouse_entry.outboundDeliveryOrderNo,
                          "purchaseOrderNo": that.data.warehouse_entry.purchaseOrderNo,
                          "createPersonId": that.data.warehouse_entry.createPersonId,
                          "createTime": that.data.warehouse_entry.createTime,
                          //更新的两项 TODO 返回的页面的all_warehouse_entry需要修改
                          "lastUpdatePersonId":globaldata.user_id,
                          "lastUpdateTime": time.YMDhms
                        }],
                        method: 'PUT',
                        success: function (res) {
                          console.log(res)
                          console.log(globaldata.url + 'warehouse/' + globaldata.account + 'warehouse_entry/')
                          res_message = res
                        },
                        //请求失败
                        fail: function (err) {

                          console.log("false")
                          wx.showToast({
                            title: '连接失败,请检查你的网络或者服务端是否开启',
                            icon: 'none',
                            duration: 2000
                          })
                        }
                      })



                      wx.showToast({
                        title: '存入成功',
                        icon: 'none',
                        duration: 1500,
                        success:function(){
                          setTimeout(function () {
                            //要延时执行的代码
                            wx.navigateBack();
                          }, 1500) 
                        }
                      })
                    }
                    else{
                      console.log(res_message.data[0])
                      wx.showToast({
                        title: ''+res_message.data,
                        icon: 'none',
                        duration: 4000
                      })
                    }
                  }
                })
              }
            })
          }
        })
      }
    })
  },




  /*
  getTheLocationNo:function(e){
    var that = this
    var location_name = e.detail.value
    var location_no
    for (var i = 0; i < that.data.all_storage_location.data.length; i++) {
      if (location_name == that.data.all_storage_location.data[i].name){
        location_no = that.data.all_storage_location.data[i].no
        break
      }
      
    } 
    
  },
  getTheLocationName: function (e) {

  }
  */
})