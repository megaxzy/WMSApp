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
    authority:'',
    rescode: '',
    warehouseEntry_list:'',
    warehouse_id:'',
    date: '',//选择的时间
    date_today: '',//今天的时间 
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
  },
  onLoad: function () {
    var that = this
    //获取现在时间
    time.newTime() 
    var Y = time.getY()
    var M = time.getM()
    var D = time.getD()
    var date=Y+'-'+M+'-'+D
    console.log("当前时间：" + time.getYMDhms());
    this.setData({
      name:globaldata.user_name,  
      role:globaldata.user_role, 
      warehouse_id:globaldata.chosen_warehouse.id, 
      date:date,       
      date_today:date  
    })
    that.showWarehouseEntry();
  },
  //用来保证在退回entry界面的时候入库单信息改变
  onShow:function(){
    var that=this
    that.showWarehouseEntry();
  },

  bindDateChange: function (e) {
    var that=this
    this.setData({
      date: e.detail.value
    })
    that.showWarehouseEntry();
  },

  showWarehouseEntry:function(){
    var that=this
    var con = condition.NewCondition();
    var dates=[]
    dates.push(that.data.date)
    dates.push(that.data.date_today)
    con = condition.AddFirstConditions('createTime', 'BETWEEN', dates);//
    //con = condition.AddFirstOrder('name', ' DESC');//???DESC和ASC没有区别
    wx.request({
      /*url:'http://localhost:9000/warehouse/WMS_Template/supply/{"conditions":[{"key":"createTime","relation":"BETWEEN","values":["2018-07-01","2018-07-22"]}],"orders":[]}',*/
      url: globaldata.url + 'warehouse/' + globaldata.account + 'warehouse_entry/' + con,
      method: 'GET',//GET为默认方法   /POST
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'warehouse_entry/' + con)
        var res_temp = res
        that.setData({
          warehouseEntry_list: res
        })
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
      complete: function () //请求完成后执行的函数
      {
      }
    })

  },
  chose: function (e) {
    var that=this
    // 获取分类id并切换分类
    //TODO
    var index = e.currentTarget.dataset.index;
    var chosen_warehouse_entry = that.data.warehouseEntry_list.data[index]
    //var entryId = that.data.warehouseEntry_list.data[index].id
    console.log(index)
    console.log(that.data.warehouseEntry_list.data[index])
    wx.showToast({
      title: '进入【入库单条目】生成页面',
      icon: 'none',
      duration: 2000
    })
    console.log(that.data.default_qualified_storage_location_name)
    var supply = JSON.stringify(that.data.supply);
    var warehouse_entry =JSON.stringify(chosen_warehouse_entry);
    var transvar = 
      'warehouse_entry=' + warehouse_entry + '&' +
      'supply=' +  supply + '&' +
      'supplier_id=' + that.data.supplier_id +'&'+
      'supplier_name=' + that.data.supplier_name + '&'+
      'material_id=' + that.data.material_id + '&'+
      'material_name=' + that.data.material_name + '&' +
      'material_no=' + that.data.material_no + '&' +
      'material_product_line=' + that.data.material_product_line + '&' +
      'default_entry_storage_location_name=' + that.data.default_entry_storage_location_name + '&' + 
      'default_entry_storage_location_no=' + that.data.default_entry_storage_location_no + '&' + 
      'default_qualified_storage_location_name=' + that.data.default_qualified_storage_location_name + '&' +
      'default_qualified_storage_location_no=' + that.data.default_qualified_storage_location_no + '&' +
      'default_unqualified_storage_location_name=' + that.data.default_unqualified_storage_location_name + '&' +
      'default_unqualified_storage_location_no=' + that.data.default_unqualified_storage_location_no
    wx.navigateTo({
      //这个url不能是tabBar中的页面
      //url: '../../main/scan/scan'
      
      url: '../../warehouse/warehouseEntryItem/warehouseEntryItem' + '?'+transvar
    })
  },
  scan: function () {
    var that=this
    //扫码
    wx.scanCode({
      scanType: 'barCode',
      success: (res) => {
        console.log(res)
        /*
        that.setData({
          //TODO此处应该是res 仅作测试
          rescode: '1234567'
        });
        console.log(that.data.rescode)
        that.getSupply()
        //根据扫码内容获得 供应商id和物料id
        //TODO 此处应该是获得  test程序中用来索取
        that.setData({
          supplier_id: that.data.supply.supplier_id,
          material_id: that.data.supply.material_id
        })*/
      },
    complete: function () {
      //test begin
      that.setData({
        //TODO此处应该是res 仅作测试
        rescode: '1234567'
      });
      console.log(that.data.rescode)
      that.getSupply()
      //根据扫码内容获得 供应商id和物料id
      //TODO 此处应该是获得  test程序中用来索取

      //test end
      
      //同一个函数中定义两个同样的con好像会出问题???
      //根据供应商id获得供应商名称 物料id和物料名称

      //更新表单
      that.showWarehouseEntry()
    }
    })
  },
  //根据条码获得供货信息  并调用getThree...函数获得库位信息
  getSupply: function () {
    //获得供货信息
    var that=this
    var con = condition.NewCondition();
    //
    con = condition.AddFirstCondition('barCodeNo', 'EQUAL', that.data.rescode);
    //con = condition.AddCondition('warehouseId', 'EQUAL', that.data.warehouse_id);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'supply/' + con,
      header: {'content-type': 'application/json'},
      method: 'GET',
      success: function (res) {
        console.log("succeed connect")
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'supply/' + con)
        var res_temp = res
        if (res_temp.data.length ==0){
          wx.showToast({
            title: '该供货码不存在',
            icon: 'none',
            duration: 2000,
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        }
        else{
          if (res_temp.data[0].warehouseId != that.data.warehouse_id) {
            wx.showToast({
              title: '警告！！！该供货码不属于该仓库，请切换仓库或修改信息',//TODO此处还可以使用
              icon: 'none',
              duration: 2000,
            })
            setTimeout(function () {
              wx.hideToast()
            }, 2000)
          }
        }
        that.setData({
          supply: res_temp.data[0]
        })
        console.log(that.data.supply)
        console.log(res.data[0].barCodeNo)//TODO 暂时查不到barcodeno
        that.setData({
          supplier_id: that.data.supply.supplierId,
          material_id: that.data.supply.materialId
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
      complete:function(){
        
        that.getThreeOfDefaultEntryStroageLocationMessages()
        that.getSupplierName()
        that.getMaterialName()
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
        method: 'GET',//GET为默认方法   /POST
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
        }
      })
    }
  }

})
