
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
    date_today:''
  },
  onShow: function () {
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
  scan: function () {
    wx.scanCode({
      scanType: 'barCode',
      success: (res) => {
        console.log(res)
        this.setData({
          rescode:res
        });
        console.log(res.result)
        
      }
    })
  },
  bindDateChange: function (e) {
    var that=this
    this.setData({
      date: e.detail.value
    })
    that.showWarehouseEntry();
  },
  enterware: function () {
    
  },
  showWarehouseEntry:function(){
    var that=this
    var con = condition.NewCondition();
    var dates=[]
    dates.push(that.data.date)
    dates.push(that.data.date_today)
    con = condition.AddFirstCondition('createTime', 'BETWEEN', dates);//
    //con = condition.AddCondition('createTime', 'BETWEEN', that.data.date_today);
    //con = condition.AddFirstOrder('name', ' DESC');//???DESC和ASC没有区别
    wx.request({
      /*url:'http://localhost:9000/warehouse/WMS_Template/supply/{"conditions":[{"key":"createTime","relation":"BETWEEN","values":["2018-07-01","2018-07-22"]}],"orders":[]}',*/
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

  }
})