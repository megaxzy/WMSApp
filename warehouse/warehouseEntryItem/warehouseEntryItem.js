//加载信息
//跟新warehouseEntry表格
//扫码
//rescode获得supply信息
//supply的入库id获得storageLocation信息
//supply的物料id获得material信息
//supply供应商id获得supplier信息
//点击入库单 进入下一个页面
//

var condition = require('../../utils/condition.js');
var globaldata = require('../../utils/globaldata.js');
var time = require('../../utils/time.js');

Page({
  data: {
    name: '', //姓名
    role: '', //职业
    rescode: '', 
    warehouse_id:'',
    date: '',//选择的时间
    date_today: '',//今天的时间 
    date_yesterday:'',//过去的时间
    
    warehouse_entry:'', //选择的入库单
    warehouse_entry_item: '', //选择的入库单的item集合
    hide:[], //隐藏item用
    all_material:'', //所有物料信息
    //all_supply: '', //所有supply
    all_storage_location: '', //所有库位信息
    warehouse_entry_item_mapped_material:[],//匹配的material name
    warehouse_entry_item_mapped_supplier: [],//匹配的supplier name
    warehouse_entry_item_mapped_entry_storage_location_name: [],//匹配的
    warehouse_entry_item_mapped_qualified_storage_location_name: [],//匹配的
    warehouse_entry_item_mapped_unqualified_storage_location_name: [],//匹配的

    //下面的都是传送的信息
    supplier_id:'',
    supplier_name: '',
    material_id: '',
    material_name: '',
    material_no: '',
    material_product_line:'',
    supply:'',
    default_entry_storage_location_name: '', //默认入库目标库位
    default_entry_storage_location_no: '', //默认入库目标库位
    default_qualified_storage_location_name: '', //默认入库合格品库位
    default_qualified_storage_location_no: '', //默认入库合格品库位
    default_unqualified_storage_location_name: '', //默认入库不合格品库位
    default_unqualified_storage_location_no: '', //默认入库不合格品库位

    scan_success:'0',
    time:'',
    first_num:'1',
  },
  onLoad: function (query) {
    var that = this
    //获取现在时间
    time.newTime() 
    var Y = time.getY()
    var M = time.getM()
    var D = time.getD()
    var Y_yesterday = time.getYesterdayY()
    var M_yesterday = time.getYesterdayM()
    var D_yesterday = time.getYesterdayD()
    var date_today = Y + '-' + M + '-' + D
    var date_yesterday = Y_yesterday + '-' + M_yesterday + '-' + D_yesterday
    this.setData({
      name:globaldata.user_name,  
      role:globaldata.user_role, 
      warehouse_id:globaldata.chosen_warehouse.id, 
      date: date_yesterday,       
      date_today:date_today,
      date_yesterday:date_yesterday,
      all_material:globaldata.all_material,
      //all_supplier: globaldata.all_supplier,
      all_supply: globaldata.all_supply,
      all_storage_location: globaldata.all_storage_location
    })
    console.log("all_storage_location")
    console.log(that.data.all_storage_location)
    query.warehouse_entry = query.warehouse_entry.replace(/%26/g, "&");
    var warehouse_entry_json = JSON.parse(query.warehouse_entry)
    that.setData({
      warehouse_entry: warehouse_entry_json
    })
    that.showWarehouseEntryItem();
  },

  //用来保证在退回entry界面的时候入库单信息改变
  onShow:function(){
    var that=this

    that.setData({
      rescode:''
    })
    that.showWarehouseEntryItem();
  },
  recover: function () {
    var that = this
    that.data
    that.setData({
      supply: '',
      rescode: '',
    })
    that.showWarehouseEntryItem();
  },
  showWarehouseEntryItem:function(){
    var that=this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('warehouseEntryId', 'EQUAL', that.data.warehouse_entry.id);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'warehouse_entry_item/' + con,
      method: 'GET',
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'warehouse_entry_item/' + con)
        var res_temp = res
        that.setData({
          warehouse_entry_item: res
        })
        console.log(res)
      },
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
        for (var i = 0; i < that.data.warehouse_entry_item.data.length; i++) {
          hide.push(true);//添加数组的功能
          console.log(hide[i])
        }
        that.setData({
          hide: hide
        })
        /*
        var warehouse_entry_item_mapped_material = [];
        var warehouse_entry_item_mapped_supplier = [];
        var warehouse_entry_item_mapped_entry_storage_location_name = [];
        var warehouse_entry_item_mapped_qualified_storage_location_name = [];
        var warehouse_entry_item_mapped_unqualified_storage_location_name = [];

        for (var i = 0; i < that.data.warehouse_entry_item.data.length; i++) {
          var supply_id = that.data.warehouse_entry_item.data[i].supplyId
          for (var j = 0; j < that.data.all_supply.data.length; j++) {
            if (supply_id == that.data.all_supply.data[j].id) {
              var mapped_supply = that.data.all_supply.data[j]
              for (var k = 0; k < that.data.all_material.data.length; k++) {
                if (mapped_supply.materialId == that.data.all_material.data[k].id) {
                  var mapped_material_name = that.data.all_material.data[k].name
                  warehouse_entry_item_mapped_material.push(mapped_material_name)
                  break;
                }
              }
              for (var k = 0; k < that.data.all_supplier.data.length; k++) {
                if (mapped_supply.supplierId == that.data.all_supplier.data[k].id) {
                  var mapped_supplier_name = that.data.all_supplier.data[k].name
                  warehouse_entry_item_mapped_supplier.push(mapped_supplier_name)
                  break;
                }
              }
            }
          }
          var storageLocationId = that.data.warehouse_entry_item.data[i].storageLocationId
          console.log(storageLocationId)
          var qualifiedStorageLocationId = that.data.warehouse_entry_item.data[i].qualifiedStorageLocationId
          var unqualifiedStorageLocationId = that.data.warehouse_entry_item.data[i].unqualifiedStorageLocationId
          for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
            if (storageLocationId == that.data.all_storage_location.data[h].id) {
              var mapped_storageLocation = that.data.all_storage_location.data[h]
              warehouse_entry_item_mapped_entry_storage_location_name.push(mapped_storageLocation.name)
            }
          }
          for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
            if (qualifiedStorageLocationId == that.data.all_storage_location.data[h].id) {
              var mapped_qualifiedStorageLocation = that.data.all_storage_location.data[h]
              warehouse_entry_item_mapped_qualified_storage_location_name.push(mapped_qualifiedStorageLocation.name)
            }
          }
          for (var h = 0; h < that.data.all_storage_location.data.length; h++) {
            if (unqualifiedStorageLocationId == that.data.all_storage_location.data[h].id) {
              var mapped_unqualifiedStorageLocation = that.data.all_storage_location.data[h]
              warehouse_entry_item_mapped_unqualified_storage_location_name.push(mapped_unqualifiedStorageLocation.name)
            }
          }
        }
        that.setData({
          warehouse_entry_item_mapped_material: warehouse_entry_item_mapped_material,
          warehouse_entry_item_mapped_supplier: warehouse_entry_item_mapped_supplier,
          warehouse_entry_item_mapped_entry_storage_location_name :warehouse_entry_item_mapped_entry_storage_location_name,
          warehouse_entry_item_mapped_qualified_storage_location_name :warehouse_entry_item_mapped_qualified_storage_location_name,
          warehouse_entry_item_mapped_unqualified_storage_location_name :warehouse_entry_item_mapped_unqualified_storage_location_name
        })
        */
      }
    })
  },

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

  trans: function () {
    var that=this
    wx.showToast({
      title: '进入【入库单条目】生成页面',
      icon: 'none',
      duration: 2000
    })
    var supply = JSON.stringify(that.data.supply);
    var warehouse_entry = JSON.stringify(that.data.warehouse_entry);
    /*
    var str = 'abcadeacf';
    var str1 = str.replace('a', 'o');
    console.log(str1); 
    */
    warehouse_entry = warehouse_entry.replace(/&/g, "%26");
    console.log('发过去的：'+warehouse_entry)
    var transvar = 
      'warehouse_entry=' + warehouse_entry + '&' +
      'supply=' +  supply 
    wx.navigateTo({url: '../../warehouse/warehouseEntryItemAdd/warehouseEntryItemAdd' + '?'+transvar})
  },
  
  scan_gun: function (e) {
    var that=this
    var value = e.detail.value
    console.log(value)
    if (!(/^[0-9]*$/.test(value))) {
      that.setData({
        //TODO此处应该是res 仅作测试
        rescode: ''
      });
    }
    else{
      if ((/^[0-9]{7}$/.test(value))) {
        that.setData({
          //TODO此处应该是res 仅作测试
          rescode: value
        });
        console.log(that.data.rescode)
        that.getSupply()
        //根据扫码内容获得 供应商id和物料id
        //TODO 此处应该是获得  test程序中用来索取
        //test end
        that.showWarehouseEntryItem()
      }
      else{
        if ((/^[0-9]{8,9,10,11,12,13,14,15,16,17}$/.test(value))) {

        }
      }
    }


    /*
    setTimeout(function () {
      // 放在最后--
      total_micro_second += 1;
    }, 1)
    
    console.log(timer)
    if(that.data.first_num==1){
      that.setData({
        first_num:0
      })
    }
    else{
      if(that.data.first_num<=10){
        that.setData({
        })
      }
      else{
        that.setData({
          rescode:''
        })
      }
    }*/
  },

  fix: function (e) {
    var that = this
    var index = that.data.index;
    var warehouse_entry = JSON.stringify(that.data.warehouse_entry);
    var warehouse_entry_item = JSON.stringify(that.data.warehouse_entry_item.data[index]);
    var transvar =
      'warehouse_entry_item=' + warehouse_entry_item + '&' +
      'warehouse_entry=' + warehouse_entry + '&' +
      'index=' + index
    wx.navigateTo({ url: '../../warehouse/warehouseEntryItemFix/warehouseEntryItemFix' + '?' + transvar })
  },

  scan: function () {
    var that=this
    //扫码
    wx.scanCode({
        scanType: 'barCode',
        success: (res) => {
          console.log(res)
          that.setData({
            rescode:res.result
          });
        },
      complete: function () {
        console.log(that.data.rescode)
        that.getSupply()
        that.showWarehouseEntryItem()
      }
    })
  },
  //根据条码获得供货信息  并调用getThree...函数获得库位信息
  getSupply: function () {
    //获得供货信息
    var that=this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('barCodeNo', 'EQUAL', that.data.rescode);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'supply/' + con,
      header: {'content-type': 'application/json'},
      method: 'GET',
      success: function (res) {
        console.log("succeed connect")
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'supply/' + con)
        var res_temp = res
        if (res_temp.data.length == 0){
          wx.showModal({
            title: '警告！！！',
            content: '该供货码不存在',
            showCancel: false,
          })
        }
        else{
          if(that.data.warehouse_entry.supplierId!=res_temp.data[0].supplierId){
            console.log(that.data.warehouse_entry.supplierId)
            console.log(res_temp.data[0].supplierId)
            wx.showModal({
              title: '警告！！！',
              content: '该供货码不属于该供货商，请切换入库单或修改信息',
              showCancel: false,
            })
          }
          else
          {
            if (res_temp.data[0].warehouseId != that.data.warehouse_id) {
              wx.showModal({
                title: '警告！！！',
                content: '该供货码不属于该仓库，请切换仓库或修改信息',
                showCancel: false,
              })
            }
            else{
              that.setData({
                supply: res_temp.data[0]
              })
              console.log(that.data.supply)
              console.log(res.data[0].barCodeNo)//TODO 暂时查不到barcodeno
              that.setData({
                supplier_id: that.data.supply.supplierId,
                material_id: that.data.supply.materialId
              })
              that.getThreeOfDefaultEntryStroageLocationMessages()
              that.getSupplierName()
              that.getMaterialName()
              
              that.setData({
                scan_success: 1
              })
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
      complete:function(){
        console.log("what is happened")
        if(that.data.scan_success==1){
          wx.showToast({
            title: '扫码成功',//TODO此处还可以使用
            icon: 'success',
            duration: 2000,
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
          that.setData({
            scan_success:0
          })
          setTimeout(function () {
            that.trans()
          }, 2000)
          
        }
        else{
          console.log("what is happened")
          /*
          wx.showToast({
            title: '扫码失败',//TODO此处还可以使用
            icon: 'none',
            duration: 2000,
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
          */
        }
      }
    })
  },
  //根据供应商id获得供应商名称
  getSupplierName:function(){
    var that=this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('id', 'EQUAL', that.data.supplier_id);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'supplier/' + con,
      method: 'GET',//GET为默认方法   /POST
      success: function (res) {
        console.log("succeed connect")
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'supplier/' + con)
        var res_temp = res.data[0].name
        that.setData({
          supplier_name: res_temp
        })
        console.log(res)
        console.log(res.data[0].name)
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
      complete: function () //请求完成后执行的函数
      {
      }
    })
  },

  //根物料id获得 material name no product_line
  getMaterialName: function () {
    var that=this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('id', 'EQUAL', that.data.material_id);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'material/' + con,
      method: 'GET',//GET为默认方法   /POST
      success: function (res) {
        console.log("succeed connect")
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'material/' + con)
        var res_temp_name = res.data[0].name
        var res_temp_no = res.data[0].no
        var res_temp_product_line = res.data[0].productLine
        that.setData({
          material_name: res_temp_name,
          material_no:res_temp_no,
          material_product_line:res_temp_product_line
        })
        console.log(res)
        console.log(res.data[0].name)
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
      complete: function () //请求完成后执行的函数
      {
      }
    })
  },

  getThreeOfDefaultEntryStroageLocationMessages: function () {
    var that = this
    if (that.data.supply.defaultEntryStorageLocationId != null) {
      var con = condition.NewCondition();
      con = condition.AddFirstCondition('id', 'EQUAL', that.data.supply.defaultEntryStorageLocationId);
      wx.request({
        url: globaldata.url + 'warehouse/' + globaldata.account + 'storage_location/' + con,
        method: 'GET',
        success: function (res) {
          console.log("succeed connect1")
          console.log(globaldata.url + 'warehouse/' + globaldata.account + 'storage_location/' + con)
          var res_temp = res
          that.setData({
            default_entry_storage_location_name: res_temp.data[0].name, //默认入库目标库位
            default_entry_storage_location_no: res_temp.data[0].no, //默认入库目标库位
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
    if (that.data.supply.defaultQualifiedStorageLocationId != null) {
      var con2 = condition.NewCondition();
      con2 = condition.AddFirstCondition('id', 'EQUAL', that.data.supply.defaultQualifiedStorageLocationId);
      wx.request({
        url: globaldata.url + 'warehouse/' + globaldata.account + 'storage_location/' + con2,
        method: 'GET',//GET为默认方法   /POST
        success: function (res) {
          console.log("succeed connect2")
          console.log(globaldata.url + 'warehouse/' + globaldata.account + 'storage_location/' + con2)
          var res_temp = res
          that.setData({
            default_qualified_storage_location_name: res_temp.data[0].name, //默认入库合格品库位
            default_qualified_storage_location_no: res_temp.data[0].no, //默认入库合格品库位
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
    if (that.data.supply.defaultUnqualifiedStorageLocationId != null) {
      var con3 = condition.NewCondition();
      con3 = condition.AddFirstCondition('id', 'EQUAL', that.data.supply.defaultUnqualifiedStorageLocationId);
      wx.request({
        url: globaldata.url + 'warehouse/' + globaldata.account + 'storage_location/' + con3,
        method: 'GET',//GET为默认方法   /POST
        success: function (res) {
          console.log("succeed connect3")
          console.log(globaldata.url + 'warehouse/' + globaldata.account + 'storage_location/' + con3)
          var res_temp = res
          that.setData({
            default_unqualified_storage_location_name: res_temp.data[0].name, //默认入库不合格库位
            default_unqualified_storage_location_no: res_temp.data[0].no, //默认入库不合格库位
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
