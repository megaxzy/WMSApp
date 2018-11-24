//C37800031 181024 001 F1062284
//C37800031181024001F1062284
//C37800106181112002F1095904
//C37800106181112002F10959212
//C37800106181112002F1095928
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
    focus: false,
    rescode:'',
    scan_model:'1',  //1为普通码 2为李尔码
    //
    supply:'', //供货信息
    warehouse_entry:'', //选择的那个入库单
    index:'',
    hide:[], 
    scan_success: '0',
    //所有库位信息 
    all_storage_location: '', //所有库位信息
    entry_storage_location_name:'',
    qualified_storage_location_name:'',
    unqualified_storage_location_name:'',
    entry_storage_location_no: '',
    qualified_storage_location_no: '',
    unqualified_storage_location_no: '',
    //库位模糊搜索
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
    //李尔码需求
    unit_number:'',
    //李尔 所有的码
    barcode:[],
    //李尔 时间判断
    scan_time:'',
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
      barcode:globaldata.entry_barcode
    })
    console.log(that.data.all_storage_location)
    query.warehouse_entry = query.warehouse_entry.replace(/%26/g, "&");
    var warehouse_entry_json=JSON.parse(query.warehouse_entry)
    this.setData({
      warehouse_entry:warehouse_entry_json
    });
  },
  onShow: function () {
    var that=this
  },
  change_scan_model_1: function (e) {
    var that = this
    var form = e.detail.value
    if (that.data.scan_model == 2) {
      that.setData({
        scan_model: '1',
        rescode: '',
      });
    }
  },
  change_scan_model_2: function (e) {
    var that = this
    var form = e.detail.value
    if (that.data.scan_model == 1) {
      that.setData({
        scan_model: '2',
        rescode:'',
      });
    }
  },
  scan: function () {
    var that = this
    var rescode=''
    var success=1
    //扫码
    wx.scanCode({
      success: (res) => {
        console.log(res)
        that.setData({
          rescode: res.result
        });
        rescode=res.result
        console.log(that.data.rescode)
      },
      complete: function () {
        var barcode = that.data.barcode
        console.log("缓存的")
        console.log(barcode)
        for (var i = 0; i < barcode.length; i++) {
          if(barcode[i]==rescode){
            wx.showModal({
              title: '警告！！！',
              content: '条码重复扫描',
              showCancel: false,
            })
            that.setData({
              rescode:''
            });
            success=0
          }
        }
        if(success==1){
          that.setData({
            rescode: rescode
          });
          that.getSupply()
        }
      }
    })
  },
  setLocation: function () {
    var that=this
    var entry_storage_location_name = ''
    var qualified_storage_location_name = ''
    var unqualified_storage_location_name = ''

    console.log(that.data.all_storage_location)
    console.log(that.data.supply)
    for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
      if (that.data.supply.defaultEntryStorageLocationNo == that.data.all_storage_location.data[h].no) {
        entry_storage_location_name = that.data.all_storage_location.data[h].name
      }
      if (that.data.supply.defaultQualifiedStorageLocationNo == that.data.all_storage_location.data[h].no) {
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
      entry_storage_location_no: that.data.supply.defaultEntryStorageLocationNo,
      qualified_storage_location_no: that.data.supply.defaultQualifiedStorageLocationNo,
      unqualified_storage_location_no: that.data.supply.defaultUnqualifiedStorageLocationNo,
    })
  },

  scan_gun: function (e) {
    var that = this
    var value = e.detail.value
    var success = 1
    console.log(value)
    if (that.data.scan_model == 1) {
      if (!(/^[0-9]*$/.test(value))) {
        that.setData({
          rescode: ''
        });
      }
      else {
        if ((/^[0-9]{7}$/.test(value))) {  //TODO 26
          that.setData({
            rescode: value,
            focus: false,
          });
          var barcode = that.data.barcode
          console.log("缓存的")
          console.log(barcode)
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
            that.getSupply()
          }
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
        //(/^[\s,\n,\r,\n\r]$/.test(value.slice(value.length - 1, value.length)))
        //if ((/^[0-9,A-Z]{26}$/.test(value)))
        if ((/^[0-9,A-Z]{26,27}$/.test(value))){  //TODO 26
          that.setData({
            rescode: value,
            //focus: false,
          });
          
          var barcode = that.data.barcode
          console.log("缓存的")
          console.log(barcode)
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
            that.getSupply()
          }
        }
        else {
          if ((/^[0-9,A-Z]{27,28}$/.test(value))) {
          }
        }
      }
    }
  },

  /*
  scan_gun: function (e) {
    var that = this
    var value = e.detail.value
    var success = 1
    console.log(value)
    if(that.data.scan_model==1){
      if (!(/^[0-9]*$/.test(value))) {
        that.setData({
          rescode: ''
        });
      }
      else {
        if ((/^[0-9]{7}$/.test(value))) {  //TODO 26
          that.setData({
            rescode: value,
            focus: false,
          });
          wx.hideKeyboard()
          var barcode = that.data.barcode
          console.log("缓存的")
          console.log(barcode)
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
            that.getSupply()
          }   
        }
        else {
          if ((/^[0-9]{8,9}$/.test(value))) {
          }
        }
      }
    }
    else if (that.data.scan_model == 2){
      if (!(/^[0-9,A-Z]*$/.test(value))) {
        that.setData({
          rescode: ''
        });
      }
      else {
        //(/^[\s,\n,\r,\n\r]$/.test(value.slice(value.length - 1, value.length)))
        //if ((/^[0-9,A-Z]{26}$/.test(value)))
        if(value.length==1){
          var date = new Date();
          var now = date.getTime();
          that.setData({
            scan_time: now
          })
          console.log("shijian" +now)
          if(that.judgeTime()==1){
            value = that.data.rescode//add
            console.log(value)
            if ((/^[0-9,A-Z]{25,26,27}$/.test(value))) {
              that.setData({
                rescode: value,
                focus: false,
              });
              wx.hideKeyboard()
              var barcode = that.data.barcode
              console.log("缓存的")
              console.log(barcode)
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
                that.getSupply()
              }
            }
            else{
            }
          }
        }
        else{
          var date = new Date();
          var now = date.getTime();
          that.setData({
            scan_time:now
          })
          console.log("shijian"+now)
        }
      }
    }
  },//C37800106181112002F1095904
  //C37800031181024001F1062284
  
  judgeTime:function(test){
      var that=this
      var date = new Date();
      var now = date.getTime();
      console.log("panduan "+now)
      console.log("panduas " + that.data.scan_time)
      while(1){
        var date = new Date();
        var now = date.getTime();
        var x = now - that.data.scan_time
        console.log("x=" +x)
        if(now-that.data.scan_time>2000){
          break
        }
      }
      console.log("成功jishi")
      return 1;
  },*/

  getSupply: function () {
    //获得供货信息
    var that = this
    var rescode
    if(that.data.scan_model==1){
      rescode = that.data.rescode
    }
    if(that.data.scan_model==2){
      rescode=that.data.rescode.slice(0,9)
    }

    var con = condition.NewCondition();
    con = condition.AddFirstCondition('barCodeNo', 'EQUAL', rescode);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'supply/' + con,
      header: { 'content-type': 'application/json' },
      method: 'GET',
      success: function (res) {
        console.log("succeed connect")
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'supply/' + con)
        var res_temp = res
        if (res_temp.data.length == 0) {
          wx.showModal({
            title: '警告！！！',
            content: '该供货码不存在',
            showCancel: false,
          })
          that.setData({
            rescode: '',
            focus: true,
          })
        }
        else {
          if (that.data.warehouse_entry.supplierId != res_temp.data[0].supplierId) {
            console.log(that.data.warehouse_entry.supplierId)
            console.log(res_temp.data[0].supplierId)
            wx.showModal({
              title: '警告！！！',
              content: '该供货码不属于该供货商，请切换入库单或修改信息',
              showCancel: false,
            })
            that.setData({
              rescode: '',
              focus: true,
            })
          }
          else {
            if (res_temp.data[0].warehouseId != that.data.warehouse_id) {
              wx.showModal({
                title: '警告！！！',
                content: '该供货码不属于该仓库，请切换仓库或修改信息',
                showCancel: false,
              })
              that.setData({
                rescode: '',
                focus: true,
              })
            }
            else {
              that.setData({
                supply: res_temp.data[0]
              })
              console.log(that.data.supply)
              console.log(res.data[0].barCodeNo)
              that.setData({
                supplier_id: that.data.supply.supplierId,
                material_id: that.data.supply.materialId
              })
              that.setData({
                scan_success: 1
              })
              that.setLocation()
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
        if (that.data.scan_success == 1) {
          if (that.data.scan_model == 1){
            that.setData({
              unit_number: that.data.supply.defaultEntryUnitAmount
            })
          }
          if(that.data.scan_model==2){//lierma
            that.setData({
              unit_number: that.data.rescode.slice(15,18)
            })
          }
          that.setData({
            scan_success: 0
          })
          that.create()
        }
        else{  
        }
      }
    })
  },

  create: function () {
    var that = this 
      var entry_storage_location_id=''
      var qualified_storage_location_id=''
      var unqualified_storage_location_id=''
      for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
        if (that.data.supply.defaultEntryStorageLocationNo == that.data.all_storage_location.data[h].no) {
          entry_storage_location_id = that.data.all_storage_location.data[h].id
        }
        if (that.data.supply.defaultQualifiedStorageLocationNo == that.data.all_storage_location.data[h].no) {
          qualified_storage_location_id = that.data.all_storage_location.data[h].id
        }
        if (that.data.supply.defaultUnqualifiedStorageLocationNo == that.data.all_storage_location.data[h].no) {
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
    else {
      var res_message=''
      var manufactureDate=''
      var inventoryDate = that.data.date_today_YMDhms
      var unitAmount = that.data.supply.defaultEntryUnitAmount
      var expectedAmount = that.data.supply.defaultEntryAmount

      if(that.data.scan_model==2){
        console.log(that.data.rescode)
        console.log(that.data.rescode.slice(9,15))
        inventoryDate = '20' + that.data.rescode.slice(9, 11) + '-' + that.data.rescode.slice(11, 13) + '-' + that.data.rescode.slice(13, 15) + ' ' + '00:00:00'
        console.log(inventoryDate)
        manufactureDate=that.data.date_today_YMDhms
        unitAmount = that.data.rescode.slice(15,18)
        expectedAmount=1
      }
      console.log(manufactureDate)
      if (manufactureDate == '') {
        console.log("is kong")
        manufactureDate = null
      }
      else if (manufactureDate.indexOf(":") == -1) {
        manufactureDate = manufactureDate + ' ' + '00:00:00'
      }
      var object_output = {
        "warehouseEntryId": that.data.warehouse_entry.id,//auto
        "supplyId": that.data.supply.id, //auto 

        "storageLocationId": entry_storage_location_id,//input-get
        "qualifiedStorageLocationId": qualified_storage_location_id, //input-get
        "unqualifiedStorageLocationId": unqualified_storage_location_id, //input-get

        "expectedAmount": expectedAmount * unitAmount, //auto/input

        "realAmount": expectedAmount * unitAmount, //auto/input
        "unit": that.data.supply.defaultEntryUnit, //auto/input
        "unitAmount": unitAmount, //auto/input
        
        "refuseAmount":0, //auto/input
        "refuseUnit": that.data.supply.defaultEntryUnit, //auto/input
        "refuseUnitAmount": unitAmount, //auto/input

        "inspectionAmount": 0, //auto/input

        "personId": globaldata.user_id, //auto
        "inventoryDate": inventoryDate,//auto
        "manufactureDate": manufactureDate,//input   
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
          wx.showModal({
            title: '错误',
            content: '连接失败,请检查你的网络或者服务端是否开启',
            showCancel: false,
          })
        },
        complete: function () {
          if (res_message.data.length == 1) {
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
                wx.showModal({
                  title: '错误',
                  content: '连接失败,请检查你的网络或者服务端是否开启',
                  showCancel: false,
                })
              }
            })
            wx.showToast({
              title: '存入成功',
              icon: 'success',
              duration: 200,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  //wx.navigateBack();
                  that.setData({
                    focus: true,
                    rescode:''
                  })
                }, 200)
                if(that.data.scan_model==2){
                  var barcode
                  barcode = that.data.barcode
                  barcode.push(that.data.rescode)
                  that.setData({
                    barcode: barcode,
                  });
                  globaldata.entry_barcode = barcode
                  console.log("global缓存的内容")
                  console.log(globaldata.entry_barcode)
                }

              }
            })
            that.setData({
              supply:'',
              entry_storage_location_name: '',
              qualified_storage_location_name: '',
              unqualified_storage_location_name: '',
              entry_storage_location_no: '',
              qualified_storage_location_no: '',
              unqualified_storage_location_no: '',
            })
          }
          else {
            console.log(res_message.data[0])
            wx.showModal({
              title: '错误',
              content: '' + res_message.data,
              showCancel: false,
            })
          }
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