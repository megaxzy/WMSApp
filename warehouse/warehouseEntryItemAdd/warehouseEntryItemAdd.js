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
    supply:'', //供货信息
    warehouse_entry:'', //选择的那个入库单
    index:'',
    hide:[], 
    //user_names:[],   
    entry_storage_location_name:'',
    qualified_storage_location_name:'',
    unqualified_storage_location_name:'',
    entry_storage_location_no: '',
    qualified_storage_location_no: '',
    unqualified_storage_location_no: '',
    all_storage_location: '', //所有库位信息
    show_unqualified_no:'false',
    vague_unqualified_no:[],
    show_unqualified_name: 'false',
    vague_unqualified_name: [],
    show_qualified_no: 'false',
    vague_qualified_no: [],
    show_qualified_name: 'false',
    vague_qualified_name: [],
    show_entry_no: 'false',
    vague_entry_no: [],
    show_entry_name: 'false',
    vague_entry_name: [],
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
      all_storage_location: globaldata.all_storage_location,
    })
    //传递上个页面给的参数
    //json数据用wx.navigateTo需要先用JSON.stringify转码再用JSON.parse转码
    var supply_json = JSON.parse(query.supply)
    console.log('收到的：'+query.warehouse_entry)
    query.warehouse_entry = query.warehouse_entry.replace(/%26/g, "&");
    var warehouse_entry_json=JSON.parse(query.warehouse_entry)
    console.log(warehouse_entry_json)
    this.setData({
      supply: supply_json,
      warehouse_entry:warehouse_entry_json
    });
    console.log(that.data.supply)


    var entry_storage_location_name = ''
    var qualified_storage_location_name = ''
    var unqualified_storage_location_name = ''

    console.log(that.data.all_storage_location)
    console.log(that.data.supply)
    for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
      if (that.data.supply.defaultEntryStorageLocationNo == that.data.all_storage_location.data[h].no) {
        entry_storage_location_name = that.data.all_storage_location.data[h].name
      }
      //console.log(that.data.all_storage_location.data[h].no)
      if (that.data.supply.defaultQualifiedStorageLocationNo==that.data.all_storage_location.data[h].no) {
        qualified_storage_location_name = that.data.all_storage_location.data[h].name
        
      }
      if (that.data.supply.defaultUnqualifiedStorageLocationNo == that.data.all_storage_location.data[h].no) {
        unqualified_storage_location_name = that.data.all_storage_location.data[h].name
      }
    }
    that.setData({
      entry_storage_location_name: entry_storage_location_name,
      qualified_storage_location_name: qualified_storage_location_name,
      unqualified_storage_location_name: unqualified_storage_location_name,
      entry_storage_location_no:that.data.supply.defaultEntryStorageLocationNo,
      qualified_storage_location_no:that.data.supply.defaultQualifiedStorageLocationNo,
      unqualified_storage_location_no: that.data.supply.defaultUnqualifiedStorageLocationNo,
    })
    console.log("three location")
    console.log(that.data.entry_storage_location_name)
    console.log(that.data.qualified_storage_location_name)
    console.log(that.data.unqualified_storage_location_name)
  },
  onShow: function () {

  },



  create: function (e) {
    var that = this 
    var form = e.detail.value

    
      var entry_storage_location_id=''
      var qualified_storage_location_id=''
      var unqualified_storage_location_id=''

      for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
        if (form.storageLocationNo == that.data.all_storage_location.data[h].no && form.storageLocationName == that.data.all_storage_location.data[h].name) {
          entry_storage_location_id = that.data.all_storage_location.data[h].id
        }
        if (form.qualifiedLocationNo == that.data.all_storage_location.data[h].no && form.qualifiedLocationName == that.data.all_storage_location.data[h].name) {
          qualified_storage_location_id = that.data.all_storage_location.data[h].id
        }
        if (form.unqualifiedLocationNo == that.data.all_storage_location.data[h].no && form.unqualifiedLocationName == that.data.all_storage_location.data[h].name) {
          unqualified_storage_location_id = that.data.all_storage_location.data[h].id
        }
      }

    

    //^匹配输入字符串开始的位置 $结束
    if (entry_storage_location_id == '') {
      wx.showModal({
        title: '入库库位信息有误',
        showCancel: false
      });
    }
    else if (qualified_storage_location_id == ''&&form.qualifiedLocationNo != '' && form.qualifiedLocationName!='') {
      wx.showModal({
        title: '合格品库位信息有误',
        showCancel: false
      });
    }
    else if (unqualified_storage_location_id == ''&&form.unqualifiedLocationNo != '' && form.unqualifiedLocationName != '') {
      wx.showModal({
        title: '不良品库位信息有误',
        showCancel: false
      });
    }
    else if (form.storageLocationName.length == 0) {
      wx.showModal({
        title: '入库库位名称不能为空',
        showCancel: false
      });
    }
    else if (form.storageLocationNo.length == 0) {
      wx.showModal({
        title: '入库库位编码不能为空',
        showCancel: false
      });
    }
    else if (form.expectedAmount.length == 0) {
      wx.showModal({
        title: '订单数量不能为空',
        showCancel: false
      });
    } 
    else if (form.realAmount.length == 0) {
      wx.showModal({
        title: '实收数量不能为空',
        showCancel: false
      });
    } 
    else if (form.unit.length == 0) {
      wx.showModal({
        title: '单位数量不能为空',
        showCancel: false
      });
    } 
    else if (form.refuseAmount.length == 0) {
      wx.showModal({
        title: '拒收数量不能为空',
        showCancel: false
      });
    } 
    else if (form.refuseUnit.length == 0) {
      wx.showModal({
        title: '拒收单位不能为空',
        showCancel: false
      });
    } 
    else if (form.refuseUnitAmount.length == 0) {
      wx.showModal({
        title: '拒收单位数量不能为空',
        showCancel: false
      });
    } 
    else if (!(/^[0-9]+[.][0-9]+$/.test(form.expectedAmount)) && !(/^[0-9][0-9]*$/.test(form.expectedAmount))) {
      wx.showModal({
        title: '订单数量格式有误',
        showCancel: false
      });
    } 
    else if (!(/^[0-9]+[.][0-9]+$/.test(form.realAmount)) && !(/^[0-9][0-9]*$/.test(form.realAmount))) {
      wx.showModal({
        title: '实收数量格式有误',
        showCancel: false
      });
    } 
    else if (!(/^[0-9]+[.][0-9]+$/.test(form.unitAmount)) && !(/^[0-9][0-9]*$/.test(form.unitAmount))) {
      wx.showModal({
        title: '单位数量格式有误',
        showCancel: false
      });
    } 
    else if (!(/^[0-9]+[.][0-9]+$/.test(form.refuseAmount)) && !(/^[0-9][0-9]*$/.test(form.refuseAmount))) {
      wx.showModal({
        title: '拒收数量格式有误',
        showCancel: false
      });
    } 
    else if (!(/^[0-9]+[.][0-9]+$/.test(form.refuseUnitAmount)) && !(/^[0-9][0-9]*$/.test(form.refuseUnitAmount))) {
      wx.showModal({
        title: '拒收单位数量格式有误',
        showCancel: false
      });
    }
    /*
    else if (!(/^([0-9]{4})-((0([1-9]{1}))|(1[1|2]))-(([0-2]([1-9]{1}))|(3[0|1]))[\s]+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5] $/.test(form.manufactureDate))  &&
    !(/^([0-9]{4})[-](([0]([1-9]{1}))|(1[0|1|2]))[-](([0-2]([1-9]{1}))|([3][0|1]))$/.test(form.manufactureDate)) && 
    ! form.manufactureDate == '') {
      wx.showModal({
        title: '生产日期格式有误',
        showCancel: false
      });
    }
    else if (!(/^(d{2}|d{4})-((0([1-9]{1}))|(1[1|2]))-(([0-2]([1-9]{1}))|(3[0|1]))[\s]+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5] $/.test(form.manufactureDate)) &&
      !(/^(d{2}|d{4})-((0([1-9]{1}))|(1[1|2]))-(([0-2]([1-9]{1}))|(3[0|1]))$/.test(form.manufactureDate)) &&
      !form.manufactureDate == '') {
      wx.showModal({
        title: '生产日期格式有误',
        showCancel: false
      });
    }
    */
    /*
    else if (!(/^[1-2][0-9]{3}[-][0-1]{0,1}[1-9][-][0-1]{0,1}[1-9][\s]}$/.test(form.manufactureDate))) {
      wx.showModal({
        title: '生产日期格式有误',
        showCancel: false
      });
    }
    */

    else{
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
          if (res_temp.data.length != 0) {
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
        complete: function () {
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
                  //TODO 添加判断
                  var manufactureDate = form.manufactureDate
                  console.log(manufactureDate.length)
                  var expiryDate = form.expiryDate
                  if (manufactureDate == '') {
                    console.log("is kong")
                    manufactureDate = null
                  }
                  //TODO 正则表达式  空格
                  else if (manufactureDate.indexOf(":")==-1) {
                    manufactureDate = manufactureDate+' '+'00:00:00'
                  }
                  
                  if (expiryDate == '') {
                    console.log("is kong")
                    expiryDate = null
                  }
                  else if (expiryDate.indexOf(":") == -1) {
                    expiryDate = expiryDate + ' ' + '00:00:00'
                  }

                  /*
                  var state
                  if (form.expectedAmount == form.realAmount){
                    state=0
                  }
                  */
                  var object_output = {
                    "warehouseEntryId": that.data.warehouse_entry.id,//auto
                    "supplyId": that.data.supply.id, //auto 

                    //TODO
                    "storageLocationId": entry_storage_location_id,//input-get
                    "qualifiedStorageLocationId":qualified_storage_location_id, //input-get
                    "unqualifiedStorageLocationId":unqualified_storage_location_id, //input-get
                    //
                    
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
                    "inventoryDate": that.data.date_today_YMDhms,//auto
                    "manufactureDate": manufactureDate,//input   
                    "expiryDate": expiryDate//input
                  }
                  console.log(object_output)
                  wx.request({
                    url: globaldata.url + 'warehouse/' + globaldata.account + 'warehouse_entry_item/',
                    data: [object_output],
                    method: 'POST',
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      console.log("succeed connect")
                      console.log(res)
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
                    },
                    //TODOPUT
                    complete: function () {
                      if (res_message.data.length == 1) {
                        console.log("存入成功")
                        //实现入库单信息跟新
                        wx.request({
                          url: globaldata.url + 'warehouse/' + globaldata.account + 'warehouse_entry/',
                          data: [{
                            //e.edtailmaterialNo自动加上前后"" so is that.data...
                            "id": that.data.warehouse_entry.id,
                            "warehouseId": that.data.warehouse_entry.warehouseId,
                            "supplierId": that.data.warehouse_entry.supplierId,
                            "no": that.data.warehouse_entry.no,
                            "description": that.data.warehouse_entry.description,
                            "state": that.data.warehouse_entry.state,
                            "deliverOrderNoSRM": that.data.warehouse_entry.deliverOrderNoSRM,
                            "inboundDeliveryOrderNo": that.data.warehouse_entry.inboundDeliveryOrderNo,
                            "outboundDeliveryOrderNo": that.data.warehouse_entry.outboundDeliveryOrderNo,
                            "purchaseOrderNo": that.data.warehouse_entry.purchaseOrderNo,
                            "createPersonId": that.data.warehouse_entry.createPersonId,
                            "createTime": that.data.warehouse_entry.createTime,
                            //更新的两项 TODO 返回的页面的all_warehouse_entry需要修改
                            "lastUpdatePersonId": globaldata.user_id,
                            "lastUpdateTime": that.data.date_today_YMDhms
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
                          icon: 'success',
                          duration: 1500,
                          success: function () {
                            setTimeout(function () {
                              //要延时执行的代码
                              wx.navigateBack();
                            }, 1500)
                          }
                        })
                      }
                      else {
                        console.log(res_message.data[0])
                        wx.showToast({
                          title: '' + res_message.data,
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
    }

  },




  //entryName
  changeEntryName: function (e) {
    var that = this
    var value = e.detail.value
    var entry_storage_location_no = ''

    for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
      if (value == that.data.all_storage_location.data[h].name) {
        entry_storage_location_no = that.data.all_storage_location.data[h].no
      }
    }
    that.setData({
      entry_storage_location_no: entry_storage_location_no,
    })

    var vague_entry_name = []
    
    var i = 0
    console.log("value", value)
    if (value != '') {
      for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
        var temp = that.data.all_storage_location.data[h].name
        if (temp.indexOf(value, 0) == 0) {
          vague_entry_name[i] = that.data.all_storage_location.data[h].name
          i++
        }
      }
    }
    that.setData({
      vague_entry_name: vague_entry_name,
    })
  },
  showEntryName: function (e) {
    var that = this
    that.changeEntryName(e)
    console.log("聚焦")
    console.log("that.data.show_entry_name", that.data.show_entry_name)
    that.setData({
      show_entry_no: 'true',
    })
    console.log("that.data.show_entry_name", that.data.show_entry_name)
  },
  hideEntryName: function (e) {
    var that = this
    console.log("丧失焦点")
    console.log("that.data.show_entry_name", that.data.show_entry_name)
    that.setData({
      show_entry_no: 'false',
    })
    console.log("that.data.show_entry_name", that.data.show_entry_name)
  },


  //entryNo
  changeEntryNo: function (e) {
    var that = this
    var value = e.detail.value
    var entry_storage_location_name = ''

    for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
      if (value == that.data.all_storage_location.data[h].no) {
        entry_storage_location_name = that.data.all_storage_location.data[h].name
      }
    }
    that.setData({
      entry_storage_location_name: entry_storage_location_name,
    })

    var vague_entry_no = []
    
    var i = 0
    console.log("value", value)
    if (value != '') {
      for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
        var temp = that.data.all_storage_location.data[h].no
        if (temp.indexOf(value, 0) == 0) {
          vague_entry_no[i] = that.data.all_storage_location.data[h].no
          i++
        }
      }
    }
    that.setData({
      vague_entry_no: vague_entry_no,
    })
  },
  showEntryNo: function (e) {
    var that = this
    that.changeEntryNo(e)
    console.log("聚焦")
    console.log("that.data.show_entry_no", that.data.show_entry_no)
    that.setData({
      show_entry_no: 'true',
    })
    console.log("that.data.show_entry_no", that.data.show_entry_no)
  },
  hideEntryNo: function (e) {
    var that = this
    console.log("丧失焦点")
    console.log("that.data.show_entry_no", that.data.show_entry_no)
    that.setData({
      show_entry_no: 'false',
    })
    console.log("that.data.show_entry_no", that.data.show_entry_no)
  },


/*
  test: function () {
    var that = this
    console.log("test")
    console.log("that.data.show_entry_no", that.data.show_unqualified_no)
    that.setData({
      show_unqualified_no: 'false',
    })
    console.log("that.data.show_entry_no", that.data.show_unqualified_no)
  },
  test2: function () {
    var that = this
    console.log("test2")
    console.log("that.data.show_entry_no", that.data.show_unqualified_no)
    that.setData({
      show_unqualified_no: 'true',
    })
    console.log("that.data.show_entry_no", that.data.show_unqualified_no)
  },
*/






  //qualifiedName
  changeQualifiedName: function (e) {
    var that = this
    var value = e.detail.value
    var qualified_storage_location_no = ''

    for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
      if (value == that.data.all_storage_location.data[h].name) {
        qualified_storage_location_no = that.data.all_storage_location.data[h].no
      }
    }
    that.setData({
      qualified_storage_location_no: qualified_storage_location_no,
    })

    var vague_qualified_name = []
    
    var i = 0
    console.log("value", value)
    if (value != '') {
      for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
        var temp = that.data.all_storage_location.data[h].name
        if (temp.indexOf(value, 0) == 0) {
          vague_qualified_name[i] = that.data.all_storage_location.data[h].name
          i++
        }
      }
    }
    that.setData({
      vague_qualified_name: vague_qualified_name,
    })
  },
  showQualifiedName: function (e) {
    var that = this
    that.changeQualifiedName(e)
    console.log("聚焦")
    console.log("that.data.show_qualified_name", that.data.show_qualified_name)
    that.setData({
      show_qualified_no: 'true',
    })
    console.log("that.data.show_qualified_name", that.data.show_qualified_name)
  },
  hideQualifiedName: function (e) {
    var that = this
    console.log("丧失焦点")
    console.log("that.data.show_qualified_name", that.data.show_qualified_name)
    that.setData({
      show_qualified_no: 'false',
    })
    console.log("that.data.show_qualified_name", that.data.show_qualified_name)
  },

  //qualifiedNo
  changeQualifiedNo: function (e) {
    var that = this
    var value = e.detail.value
    var qualified_storage_location_name = ''

    for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
      if (value == that.data.all_storage_location.data[h].no) {
        qualified_storage_location_name = that.data.all_storage_location.data[h].name
      }
    }
    that.setData({
      qualified_storage_location_name: qualified_storage_location_name,
    })

    var vague_qualified_no = []
    
    var i = 0
    console.log("value", value)
    if (value != '') {
      for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
        var temp = that.data.all_storage_location.data[h].no
        if (temp.indexOf(value, 0) == 0) {
          vague_qualified_no[i] = that.data.all_storage_location.data[h].no
          i++
        }
      }
    }
    that.setData({
      vague_qualified_no: vague_qualified_no,
    })
  },
  showQualifiedNo: function (e) {
    var that = this
    that.changeQualifiedNo(e)
    console.log("聚焦")
    console.log("that.data.show_qualified_no", that.data.show_qualified_no)
    that.setData({
      show_qualified_no: 'true',
    })
    console.log("that.data.show_qualified_no", that.data.show_qualified_no)
  },
  hideQualifiedNo: function (e) {
    var that = this
    console.log("丧失焦点")
    console.log("that.data.show_qualified_no", that.data.show_qualified_no)
    that.setData({
      show_qualified_no: 'false',
    })
    console.log("that.data.show_qualified_no", that.data.show_qualified_no)
  },





  //UnqualifiedName
  changeUnqualifiedName: function (e) {
    var that = this
    var value = e.detail.value
    var unqualified_storage_location_no = ''

    for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
      if (value == that.data.all_storage_location.data[h].name) {
        unqualified_storage_location_no = that.data.all_storage_location.data[h].no
      }
    }
    that.setData({
      unqualified_storage_location_no: unqualified_storage_location_no,
    })

    var vague_unqualified_name = []
    
    var i = 0
    console.log("value", value)
    if (value != '') {
      for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
        var temp = that.data.all_storage_location.data[h].name
        if (temp.indexOf(value, 0) == 0) {
          vague_unqualified_name[i] = that.data.all_storage_location.data[h].name
          i++
        }
      }
    }
    that.setData({
      vague_unqualified_name: vague_unqualified_name,
    })
  },
  showUnqualifiedName: function (e) {
    var that = this
    that.changeUnqualifiedName(e)
    console.log("聚焦")
    console.log("that.data.show_unqualified_name", that.data.show_unqualified_name)
    that.setData({
      show_unqualified_no: 'true',
    })
    console.log("that.data.show_unqualified_name", that.data.show_unqualified_name)
  },
  hideUnqualifiedName: function (e) {
    var that = this
    console.log("丧失焦点")
    console.log("that.data.show_unqualified_name", that.data.show_unqualified_name)
    that.setData({
      show_unqualified_no: 'false',
    })
    console.log("that.data.show_unqualified_name", that.data.show_unqualified_name)
  },

  //UnqualifiedNo
  changeUnqualifiedNo: function (e) {
    var that = this
    var value = e.detail.value    
    var unqualified_storage_location_name = ''
      
    for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
      if (value == that.data.all_storage_location.data[h].no) {
        unqualified_storage_location_name = that.data.all_storage_location.data[h].name
      }
    }
    that.setData({
      unqualified_storage_location_name: unqualified_storage_location_name,
    })

    var vague_unqualified_no =[]
    
    var i = 0
    console.log("value",value)
    if(value!='')
    {
      for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
        var temp = that.data.all_storage_location.data[h].no
        if (temp.indexOf(value,0)==0 ) {
          vague_unqualified_no[i] = that.data.all_storage_location.data[h].no
          i++
        }
      }
    }
    that.setData({
      vague_unqualified_no: vague_unqualified_no,
    })
  },
  showUnqualifiedNo:function(e){
    var that=this
    that.changeUnqualifiedNo(e)
    console.log("聚焦")
    console.log("that.data.show_unqualified_no",that.data.show_unqualified_no)
    that.setData({
      show_unqualified_no:'true',
    })
    console.log("that.data.show_unqualified_no",that.data.show_unqualified_no)
  },
  hideUnqualifiedNo: function (e) {
    var that=this
    console.log("丧失焦点")
    console.log("that.data.show_unqualified_no",that.data.show_unqualified_no)
    that.setData({
      show_unqualified_no: 'false',
    })
    console.log("that.data.show_unqualified_no",that.data.show_unqualified_no)
  },











/*
  choseEntryItem: function (e) {
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
  showAllItem: function (e) {
    var that = this 
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('warehouseEntryId', 'EQUAL',that.data.warehouse_entry.id );
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'warehouse_entry_item/' + con,
      method: 'GET',
      success: function (res) {
        console.log("succeed connect1")
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'warehouse_entry_item/' + con)
        var res_temp = res
          that.setData({
            all_warehouse_entry_item: res_temp, 
          })
        console.log(that.data.all_warehouse_entry_item)
        
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
        var hide = [];
        for (var i = 0; i < that.data.all_warehouse_entry_item.data.length; i++) {
          hide.push(true);//添加数组的功能
          console.log(hide[i])
        }
        that.setData({
          hide: hide
        })
      }
    })
  }
  */
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