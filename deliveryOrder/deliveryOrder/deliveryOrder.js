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
    warehouse_id:'', //warehouse id
    date: '',//选择的时间
    date_today: '',//今天的时间 
    supply:'', //供货信息
    delivery_order_list: '',
    chosen_delivery_order: '',
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
    
  },
  onShow:function(){
    var that=this
    that.showDeliveryOrder();
    that.setData({
      supply: ''
    })
  },

  showDeliveryOrder:function(){
    var that=this

    var con = condition.NewCondition();
    con = condition.AddFirstCondition('warehouseId', 'EQUAL', that.data.warehouse_id);

    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'delivery_order/' + con,
      method: 'GET',
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'delivery_order/' + con)
        var res_temp = res
        that.setData({
          delivery_order_list: res_temp
        })
        console.log("由barcodeno获得的供货信息获得的条目")
        console.log(res_temp)
      },
      fail: function (err) {
        console.log("false")
        wx.showToast({
          title: '连接失败,请检查你的网络或者服务端是否开启',
          icon: 'none',
          duration: 2000
        })
      },
      complete:function(){
      }
    })
  },
  


  chose: function (e) {
    var that=this
    // 获取分类id并切换分类
    var index = e.currentTarget.dataset.index;
    var chosen_delivery_order = that.data.delivery_order_list.data[index]
    console.log(index)
    console.log(that.data.delivery_order_list.data[index])
    wx.showToast({
      title: '进入【送检单条目】生成页面',
      icon: 'none',
      duration: 2000
    })
    var supply = JSON.stringify(that.data.supply);
    var chosen_delivery_order = JSON.stringify(chosen_delivery_order);
    var transvar = 
      'chosen_delivery_order=' + chosen_delivery_order
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
      that.getSupply()
      //根据扫码内容获得 供应商id和物料id
      //TODO 此处应该是获得  test程序中用来索取
      //根据供应商id获得供应商名称 物料id和物料名称
      //更新表单
      
    }
    })
  },
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
              duration: 4000,
            })
            setTimeout(function () {
              wx.hideToast()
            }, 4000)
          }
          else{
            that.setData({
              supply: res_temp.data[0]
            })
            console.log(that.data.supply)
            console.log(that.data.supply.supplierName)
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
        that.showDeliveryOrder()
      }
    })
  },
  
})
