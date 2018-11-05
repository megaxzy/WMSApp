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
    transfer_order_list: '',
    chosen_transfer_order: '',
    qualified:'2',
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

    that.setData({
      supply: '',
      rescode:''
    })
    that.showTransferOrder();
  },

  change_state_1: function (e) {
    var that = this
    var form = e.detail.value
    if (that.data.qualified == 2) {
      that.setData({
        qualified: '1'
      });
    }
    that.showTransferOrder();
  },
  change_state_2: function (e) {
    var that = this
    var form = e.detail.value
    if (that.data.qualified == 1) {
      that.setData({
        qualified: '2'
      });
    }
    that.showTransferOrder();
  },


  scan_gun: function (e) {
    var that = this
    var value = e.detail.value
    console.log(value)
    if (!(/^[0-9]*$/.test(value))) {
      that.setData({
        //TODO此处应该是res 仅作测试
        rescode: ''
      });
    }
    else {
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
        that.showTransferOrder()
      }
      else {
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

  /*
  bindDateChange: function (e) {
    var that=this
    this.setData({
      date: e.detail.value
    })
    that.showDeliveryOrder();
  },
  */

  showTransferOrder:function(){
    var that=this

    var con = condition.NewCondition();
    con = condition.AddFirstCondition('warehouseId', 'EQUAL', that.data.warehouse_id);
    con = condition.AddCondition('type', 'EQUAL', 0);
    if (that.data.supply.length!=''){
      con = condition.AddCondition('supplierId', 'EQUAL', that.data.supply.supplierId);
    }
    if (that.data.qualified == 2) {
      con = condition.AddCondition('state', 'NOT_EQUAL', 2)
    }
    if (that.data.qualified == 1) {
      con = condition.AddCondition('state', 'EQUAL', 2)
    }
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'transfer_order/' + con,
      method: 'GET',
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'transfer_order/' + con)
        var res_temp = res
        that.setData({
          transfer_order_list: res_temp
        })
        console.log("由barcodeno获得的供货信息获得的条目"+res)
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
    var chosen_transfer_order = that.data.transfer_order_list.data[index]
    console.log(index)
    console.log(that.data.transfer_order_list.data[index])
    var supply = JSON.stringify(that.data.supply);
    var chosen_transfer_order = JSON.stringify(chosen_transfer_order);
    var transvar = 
      'chosen_transfer_order=' + chosen_transfer_order
    wx.navigateTo({
      url: '../../transferOrder0/transferOrder0Item/transferOrder0Item' + '?'+transvar
    })
  },

  scan: function () {
    var that=this
    //扫码
    wx.scanCode({
      scanType: 'barCode',
      success: (res) => {
        console.log(res)
        that.setData({
          rescode: res.result
        });

      },
    complete: function () {
      //test begin
      that.getSupply()
      //根据扫码内容获得 供应商id和物料id
      //TODO 此处应该是获得  test程序中用来索取
      //根据供应商id获得供应商名称 物料id和物料名称
      //更新表单
      
    }
    })
  },

  recover: function () {
    var that = this
    that.data
    that.setData({
      supply: '',
      rescode: '',
    })
    that.showTransferOrder()
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
        if (that.data.rescode == 0) {
          wx.showToast({
            title: '扫码失败',
            icon: 'none',
            duration: 2000,
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        }
        else{
          wx.showToast({
            title: '扫码成功',//TODO此处还可以使用
            icon: 'success',
            duration: 2000,
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        }

        that.showTransferOrder()
      }
    })
  },
  
})
