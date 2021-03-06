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
    warehouseEntry_list:'',
    warehouse_id:'',
    date: '', //选择的时间
    date_today: '', //今天的时间 
    date_yesterday:'', //昨天的时间
    date_tomorrow: '',//以后的时间
    qualified: '2',
  },
  onLoad: function () {
    var that = this
    //获取现在时间
    time.newTime()
    var Y = time.getY()
    var M = time.getM()
    var D = time.getD()
    var Y_yesterday = time.getYesterdayY()
    var M_yesterday = time.getYesterdayM()
    var D_yesterday = time.getYesterdayD()
    var Y_tomorrow = time.getTomorrowY()
    var M_tomorrow = time.getTomorrowM()
    var D_tomorrow = time.getTomorrowD()
    var date_today = Y + '-' + M + '-' + D
    var date_yesterday = Y_yesterday + '-' + M_yesterday + '-' + D_yesterday
    var date_tomorrow = Y_tomorrow + '-' + M_tomorrow + '-' + D_tomorrow
    this.setData({
      name:globaldata.user_name,  
      role:globaldata.user_role, 
      warehouse_id:globaldata.chosen_warehouse.id, 
      date: date_yesterday,       
      date_today:date_today,
      date_yesterday:date_yesterday,
      date_tomorrow: date_tomorrow,
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
  change_state_1: function (e) {
    var that = this
    var form = e.detail.value
    if (that.data.qualified == 2) {
      that.setData({
        qualified: '1'
      });
    }
    that.showWarehouseEntry();
  },
  change_state_2: function (e) {
    var that = this
    var form = e.detail.value
    if (that.data.qualified == 1) {
      that.setData({
        qualified: '2'
      });
    }
    that.showWarehouseEntry();
  },
  showWarehouseEntry:function(){
    var that=this
    var con = condition.NewCondition();
    var dates=[]
    dates.push(that.data.date)
    dates.push(that.data.date_tomorrow)
    con = condition.AddFirstConditions('createTime', 'BETWEEN', dates);
    con = condition.AddCondition('warehouseId', 'EQUAL', that.data.warehouse_id);
    if (that.data.qualified == 2) {
      con = condition.AddCondition('state', 'EQUAL', 0)
    }
    if (that.data.qualified == 1) {
      con = condition.AddCondition('state', 'NOT_EQUAL', 0)
    }
    //con = condition.AddFirstOrder('createTime',' ASC');//???DESC和ASC没有区别
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'warehouse_entry/' + con,
      method: 'GET',
      success: function (res) {

        var res_temp = res
        that.setData({
          warehouseEntry_list: res
        })

      },
      fail: function (err) {

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
    var index = e.currentTarget.dataset.index;
    var chosen_warehouse_entry = that.data.warehouseEntry_list.data[index]

    var warehouse_entry =JSON.stringify(chosen_warehouse_entry);
    warehouse_entry = warehouse_entry.replace(/&/g, "%26");
    var transvar = 
      'warehouse_entry=' + warehouse_entry 
    wx.navigateTo({url: '../../warehouse/warehouseEntryItem/warehouseEntryItem' + '?'+transvar})
  },
})
