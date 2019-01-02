//C37800031 181024 001 F1062284
//C37800031181024001F1062284
//C37800106181112002F1095904
//C37800106181112002F10959212

//C37800106181112002F10959282   //sometimes
//C37800106181112005F10959287
//C37800106181113001F10959362
//TODO 库位编码联想  自动获取入库库位名称
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
    //判断长度
    codeLength: '',
    //手机连续扫码
    is_phone:0,
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

        that.setData({
          rescode: res.result
        });
        rescode=res.result

      },
      complete: function () {
        var barcode = that.data.barcode

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
            rescode: rescode,//////////////////////that.data.codeLength ==
            codeLength:rescode.length
          });
          that.setData({
            is_phone:1
          })
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
    that.setData({
      codeLength: value.length,
    });
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
        if(value.length==1){
          var x = new Date();
          var y = x.getTime();

        }
        if (value.length >= 24) {
          //开启定时器
          var wxTimer = new timer({
            judgeTime: "500",
            complete: function () {

              if (that.data.codeLength == value.length && value.length!=24) {
                that.setData({
                  rescode: value,   
                  //focus:false,
                });
                var barcode = that.data.barcode
                //test
                var x = new Date();
                var y = x.getTime();
                console.log("当前时间戳【judge开始】为："+value +" "+value.length +" "+ y);
                //testend
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
                  //test
                  x = new Date();
                  y = x.getTime();
                  console.log("当前时间戳【扫码结束2】为：" + y);
                  //test end
                  console.log(that.data.codeLength + value.length)
                  if (that.data.codeLength == value.length){
                    that.getSupply()
                  }
                }
              }
            }
          })
          wxTimer.start(that);
        }
      }
    }
  },


  getSupply: function () {
    //获得供货信息
    var that = this

    
    /*
    var random=that.data.rescode.slice(15,that.data.rescode.length)
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('barCodeNo', 'EQUAL', rescode);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'stock_record/validate_random_code/' + con,
      header: { 'content-type': 'application/json' },
      data: [{
        randomCode:random,
        entryOrDeliver:0
      }],
      method: 'PUT',
      success: function (res) {

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
    */



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
        //console.log("succeed connect")
        //console.log(globaldata.url + 'warehouse/' + globaldata.account + 'supply/' + con)
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
              unit_number: 1
            })
          }
          that.setData({
            scan_success: 0
          })
          console.log(that.data.codeLength)
          console.log(that.data.rescode)
          if (that.data.codeLength == that.data.rescode.length) {
            that.create()
          }      
        }
      }
    })
  },

  create: function () {
    var that = this 
    var x = new Date();
    var y = x.getTime();
    //console.log("当前时间戳【入库单条目开始】为：" + y);
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

        inventoryDate = '20' + that.data.rescode.slice(9, 11) + '-' + that.data.rescode.slice(11, 13) + '-' + that.data.rescode.slice(13, 15) + ' ' + '00:00:00'
        manufactureDate=that.data.date_today_YMDhms
        unitAmount = 1
        expectedAmount = 1*that.data.rescode.slice(15, 18)
      }
      if (manufactureDate == '') {
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

      wx.request({
        url: globaldata.url + 'warehouse/' + globaldata.account + 'warehouse_entry_item/',
        data: [object_output],
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          //console.log(res)
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
          wx.showToast({
            title: '存入成功',
            icon: 'success',
            duration: 50,
            complete:function(){
              x = new Date();
              y = x.getTime();
              console.log("当前时间戳【入库单条目】完成：" + y);
            }
          })
          x = new Date();
          y = x.getTime();
          //console.log("当前时间戳【入库单条目】完成：" + y);
          if (res_message.data.length == 1) {
            //实现入库单信息跟新
            /*
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
                //console.log(res)
                //console.log(globaldata.url + 'warehouse/' + globaldata.account + 'warehouse_entry/')
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
            x = new Date();
            y = x.getTime();
            //console.log("当前时间戳【入库单结束】为：" + y);  */
            if (that.data.scan_model == 2) {
              var barcode
              barcode = that.data.barcode
              barcode.push(that.data.rescode)
              that.setData({
                barcode: barcode,
              });
              globaldata.entry_barcode = barcode
              //console.log("global缓存的内容" + globaldata.entry_barcode)
            }
            that.setData({
              supply:'',
              
              rescode: '',
              entry_storage_location_name: '',
              qualified_storage_location_name: '',
              unqualified_storage_location_name: '',
              entry_storage_location_no: '',
              qualified_storage_location_no: '',
              unqualified_storage_location_no: '',
            })
            if(that.data.is_phone==1){
              that.setData({
                focus: false,
                is_phone: 0
              })
              that.scan()
            }
            else{
              that.setData({
                focus: true,
              }) 
            }

            var barcode = that.data.barcode
            //console.log("缓存的")
            //console.log(barcode)
            x = new Date();
            y = x.getTime();
            console.log("当前时间戳【所有结束】为：" + y);
          }
          else {
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
})

