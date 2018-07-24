
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
    supplier_id:'64',
    supplier_name: '',
    material_id: '2',
    material_name: '',
    material_no: '',
    res_temp_product_line:'',
    supply:'',
  },
  onLoad: function () {
    var that = this
    //获取现在时间
    var Y=time.Y
    var M=time.M
    var D=time.D
    var date=Y+'-'+M+'-'+D
    this.setData({
      name:globaldata.user_name,  
      role:globaldata.user_role, 
      warehouse_id:globaldata.chosen_warehouse.id, 
      date:date,       
      date_today:date  
    })
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
  chose: function () {
    var that=this
    wx.showToast({
      title: '进入【入库单条目】生成页面',
      icon: 'none',
      duration: 2000
    })
    var supply = JSON.stringify(that.data.supply);
    var transvar = 'supply=' +  supply + '&' +
      'supplier_id=' + that.data.supplier_id +'&'+
      'supplier_name=' + that.data.supplier_name + '&'+
      'material_id=' + that.data.material_id + '&'+
      'material_name=' + that.data.material_name + '&' +
      'material_no=' + that.data.material_no + '&' +
      'material_product_line=' + that.data.material_product_line 
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
        this.setData({
          rescode: res
        });
        console.log(res.result)
      }
    })
    //根据扫码内容获得 供应商id和物料id
    //TODO 此处应该是获得  test程序中用来索取
    that.setData({
      supplier_id: '176',
      material_id: '73'
    })
    //TODO 
    //获得供货信息
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('supplierId', 'EQUAL', that.data.supplier_id);
    con = condition.AddCondition('materialId', 'EQUAL', that.data.material_id);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'supply/' + con,
      data: {//发送给后台的数据
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',//GET为默认方法   /POST
      success: function (res) {
        console.log("succeed connect")
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'supply/' + con)
        var res_temp = res
        that.setData({
            supply:res_temp.data[0]
        })
        console.log(that.data.supply)
        console.log(res.data[0])
        console.log(res.data[0].barCodeNo)//TODO 暂时查不到barcodeno
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

    //同一个函数中定义两个同样的con好像会出问题???
    //根据供应商id获得供应商名称 物料id和物料名称
    that.getSupplierName()
    that.getMaterialName()
    //更新表单
    that.showWarehouseEntry()
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
  }
})