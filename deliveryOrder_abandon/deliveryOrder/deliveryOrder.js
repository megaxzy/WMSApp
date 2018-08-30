//加载信息
//跟新inspectionNote表格from
//扫码
//rescode获得supply信息
//supply的入库id获得storageLocation信息
//supply的物料id获得material信息
//supply供应商id获得supplier信息
//选择form 进入下一个页面
//
var condition = require('../../utils/condition.js');
var globaldata = require('../../utils/globaldata.js');
var time = require('../../utils/time.js');
Page({
  data: {
    name: '', //姓名
    role: '', //职业
    authority:'', //人员权限
    rescode: '',  //扫码信息
    //inspection_note_list:'', //inspection集合
    warehouse_id:'', //warehouse id
    date: '',//选择的时间
    date_today: '',//今天的时间 
    supplier_id:'', 
    supplier_name: '',
    material_id: '',
    material_name: '',
    material_no: '',
    supply:'', //供货信息
    warehouse_entry_item_list:'',
    chosen_warehouse_entry_item:'',

    delivery_order_item_list: '',  //所有合格的 条目信息
    chosen_delivery_order_item:'',  //点击的 条目信息

    all_delivery_order:'',//所有该仓库的deliveryOrder信息
    delivery_order_mapped_num:[], //item对应的标号
  },
  onLoad: function () {
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
      warehouse_id:globaldata.chosen_warehouse.id, 
      date:date,       
      date_today:date  
    })
    that.getAllDeliveryOrder();
  },
  //用来保证在退回entry界面的时候入库单信息改变
  onShow:function(){
    var that=this
    that.showDeliveryOrderItem();
  },

  showDeliveryOrderItem:function(){
    var that=this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('supplyId', 'EQUAL', that.data.supply.id);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'delivery_order_item/' + con,
      method: 'GET',
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'delivery_order_item/' + con)
        var res_temp = res
        that.setData({
          delivery_order_item_list: res
        })
        console.log("由barcodeno获得的供货信息获得的条目单")
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
      //找到OrderItem对应Order的标号
      complete: function () {
        var delivery_order_mapped_num = [];
        //遍历item
        for (var i = 0; i < that.data.delivery_order_item_list.data.length; i++) {
          var id_item = that.data.delivery_order_item_list.data[i].deliveryOrderId
          //遍历order
          for (var j = 0; j < that.data.all_delivery_order.data.length; j++) {
            var id_order = that.data.all_delivery_order.data[j].id
            if (id_item == id_order) {
              delivery_order_mapped_num.push(j)
            }
          }
        }
        that.setData({
          delivery_order_mapped_num: delivery_order_mapped_num,
        })
        for (var j = 0; j < that.data.delivery_order_mapped_num.length; j++){
          console.log(j+delivery_order_mapped_num[j])
        }
      }
    })
  },

  //获得该仓库deliveryOrder信息
  getAllDeliveryOrder: function () {
    var that = this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('warehouseId', 'EQUAL', that.data.warehouse_id);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'delivery_order/' + con,
      method: 'GET',
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'delivery_order/' + con)
        var res_temp = res
        that.setData({
          all_delivery_order: res
        })
        console.log("所有all_delivery_order信息")
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
    })
  },

  chose: function (e) {
    var that=this
    // 获取分类id并切换分类
    var index = e.currentTarget.dataset.index;
    var chosen_delivery_order_item = that.data.delivery_order_item_list.data[index]
    //var entryId = that.data.warehouseEntry_list.data[index].id
    console.log(index)
    console.log(that.data.delivery_order_item_list.data[index])
    wx.showToast({
      title: '进入【送检单条目】生成页面',
      icon: 'none',
      duration: 2000
    })
    var supply = JSON.stringify(that.data.supply);
    var chosen_delivery_order_item = JSON.stringify(chosen_delivery_order_item);
    var transvar = 
      'chosen_delivery_order_item=' + chosen_delivery_order_item + '&' +  //选择的 入库单条目
      'supply=' +  supply + '&' +
      'supplier_id=' + that.data.supplier_id +'&'+
      'supplier_name=' + that.data.supplier_name + '&'+
      'material_id=' + that.data.material_id + '&'+
      'material_name=' + that.data.material_name + '&' +
      'material_no=' + that.data.material_no + '&' +
      'material_product_line=' + that.data.material_product_line
    wx.navigateTo({
      url: '../../deliveryOrder/deliveryOrderItem/deliveryOrderItem' + '?'+transvar
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
      //根据供应商id获得供应商名称 物料id和物料名称

      //更新表单
      
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
      method: 'GET',//GET为默认方法   /POST
      success: function (res) {
        console.log("succeed connect")
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'supply/' + con)
        var res_temp = res
        if (res_temp.data.length == 0) {
          wx.showToast({
            title: '该供货码不存在',
            icon: 'none',
            duration: 2000,
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        }
        else {
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
        that.getSupplierName()
        that.getMaterialName()
        that.showDeliveryOrderItem()
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

  //根物料id获得物料名称
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
        var res_temp = res.data[0].name
        var res_temp_no = res.data[0].no
        var res_temp_product_line = res.data[0].productLine
        that.setData({
          material_name: res_temp,
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
})
