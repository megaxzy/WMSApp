//???假设有两种东西 我已经送件了一种 那另外一种还能送检吗？
var condition = require('../../utils/condition.js');
var globaldata = require('../../utils/globaldata.js');
var time = require('../../utils/time.js');
Page({
  data: {
    name: '',
    role:'',
    authority:'',
    user_id:'',
    warehouse_id:'',
    date: '',//选择的时间
    date_today: '',//今天的时间
    date_today_YMDhms: '',//今天的时间
    supply:'', //供货信息
    chosen_transfer_order:'',
    transfer_order_item_list: '',
    index: '',//选择的条目顺序
    hide: [],
  },
  onLoad: function (query) {
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
      user_id:globaldata.user_id,
      warehouse_id:globaldata.chosen_warehouse.id,
      date:date,
      date_today:date,
      date_today_YMDhms: YMDhms
    })
    console.log(query.chosen_transfer_order)
    var chosen_transfer_order_json = JSON.parse(query.chosen_transfer_order)
    this.setData({
      chosen_transfer_order: chosen_transfer_order_json
    }); 
    that.getTransferOrderItem()
  },
 
 
  onShow: function () {
    var that = this
 
    that.setData({
      supply:'',
      rescode:''
    }); 
    that.getTransferOrderItem()
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
        that.getTransferOrderItem()
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


  getTransferOrderItem: function () {
    var that = this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('transferOrderId', 'EQUAL', that.data.chosen_transfer_order.id);
    if(that.data.supply!=''){
      con = condition.AddCondition('supplyId', 'EQUAL', that.data.supply.id);
    }
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'transfer_order_item/' + con,
      method: 'GET',
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'transfer_order_item/' + con)
        var res_temp = res
        that.setData({
          transfer_order_item_list: res_temp
        })
        console.log('transfer 信息：', that.data.transfer_order_item_list)
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
      }
    })
  },

  choseItem: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;

    var chosen_transfer_order = JSON.stringify(that.data.chosen_transfer_order);    
    var chosen_transfer_order_item = that.data.transfer_order_item_list.data[index]
    var chosen_transfer_order_item = JSON.stringify(chosen_transfer_order_item)
  
    var transvar =
      'chosen_transfer_order=' + chosen_transfer_order + '&' +  
      'chosen_transfer_order_item=' + chosen_transfer_order_item 
    wx.navigateTo({
      url: '../../transferOrder/transferOrderItemChange/transferOrderItemChange' + '?' + transvar
    })
  },
 


  scan: function () {
    var that = this
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

        console.log(that.data.rescode)
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
    var that = this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('barCodeNo', 'EQUAL', that.data.rescode);
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
          if (that.data.chosen_transfer_order.supplierId != res_temp.data[0].supplierId) {
            wx.showToast({
              title: '警告！！！该供货码不属于该供货商，请切换入库单或修改信息',
              icon: 'none',
              duration: 4000,
            })
            setTimeout(function () {
              wx.hideToast()
            }, 4000)
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
            else {
              that.setData({
                supply: res_temp.data[0]
              })
              console.log(that.data.supply)
              console.log(res.data[0].barCodeNo)//TODO 暂时查不到barcodeno
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
        wx.showToast({
          title: '扫码成功',//TODO此处还可以使用
          icon: 'success',
          duration: 2000,
        })
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
        that.getTransferOrderItem()
      }
    })
  },
})