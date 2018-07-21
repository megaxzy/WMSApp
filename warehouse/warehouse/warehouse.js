
var condition = require('../../utils/condition.js');
var globaldata = require('../../utils/globaldata.js');
var time = require('../../utils/time.js');
Page({
  data: {
    name: '',
    role:'',
    authority:'',
    rescode: '',
    warehouse_list:'',
    warehouse_id:'',
    date:'',
  },
  onShow: function () {
    //获取时间
    var Y=time.Y
    var M=time.M
    var D=time.D
    var date=Y+'-'+M+'-'+D
    this.setData({
      name:globaldata.user_name,
      role:globaldata.user_role,
      warehouse_id:globaldata.chosen_warehouse.id,
      date:date
    })

    var that = this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('warehouseId', 'EQUAL', that.data.warehouse_id);
    //con = condition.AddFirstOrder('name', ' DESC');//???DESC和ASC没有区别
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account +'supply/' + con,
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
          warehouse_list: res
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
  scan: function () {
    wx.scanCode({
      scanType: 'barCode',
      success: (res) => {
        console.log(res)
        this.setData({
          rescode:res
        });
        console.log(res.result)
        console.log(rescode.result)
      }
    })
  },
  enterware: function () {
    
  }
})