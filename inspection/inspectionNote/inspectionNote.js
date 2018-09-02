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
    authority: '', //人员权限
    rescode: '',  //扫码信息
    warehouse_id: '', //warehouse id
    date: '',//选择的时间
    date_today: '',//今天的时间 
    supply: '', //供货信息
    inspection_note_list: '',
    chosen_inspection_note: '',
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
      name: globaldata.user_name,
      role: globaldata.user_role,
      warehouse_id: globaldata.chosen_warehouse.id,
      date: date,
      date_today: date
    })

  },
  onShow: function () {
    var that = this
    that.showInspectionNote();
    that.setData({
      supply: ''
    })
  },

  showInspectionNote: function () {
    var that = this

    var con = condition.NewCondition();
    con = condition.AddFirstCondition('warehouseId', 'EQUAL', that.data.warehouse_id);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'inspection_note/' + con,
      method: 'GET',
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'inspection_note/' + con)
        var res_temp = res
        that.setData({
          inspection_note_list: res_temp
        })
        console.log("由barcodeno获得的供货信息获得的条目" + res)
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
      }
    })
  },



  chose: function (e) {
    var that = this
    // 获取分类id并切换分类
    var index = e.currentTarget.dataset.index;
    var chosen_inspection_note = that.data.inspection_note_list.data[index]
    var chosen_inspection_note = JSON.stringify(chosen_inspection_note);
    var transvar =
      'chosen_inspection_note=' + chosen_inspection_note
    wx.navigateTo({
      url: '../../inspection/inspectionNoteItem/inspectionNoteItem' + '?' + transvar
    })
  },


})
