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
    warehouse_list:'',
    warehouse_id:'',
    date: '',//选择的时间
    date_today: '',//今天的时间
    date_today_YMDhms:'',
    supplier_id: '', //supplier message
    supplier_name: '',
    material_id: '', //material message
    material_name: '',
    material_no: '',
    material_product_line: '',
    supply:'', //供货信息
    warehouse_entry:'', //选择的那个入库单
    warehouse_entry_item:'',
    index:'',
  },
  onLoad: function (query) {
    var that = this
    //获取现在时间
    var Y=time.Y
    var M=time.M
    var D=time.D
    var date=Y+'-'+M+'-'+D
    var YMDhms=time.YMDhms
    this.setData({
      name:globaldata.user_name,
      role:globaldata.user_role,
      user_id:globaldata.user_id,
      warehouse_id:globaldata.chosen_warehouse.id,
      date:date,
      date_today:date,
      date_today_YMDhms: YMDhms,
    })
    //传递上个页面给的参数
    //json数据用wx.navigateTo需要先用JSON.stringify转码再用JSON.parse转码
    var supply_json = JSON.parse(query.supply)
    var warehouse_entry_json=JSON.parse(query.warehouse_entry)
    var warehouse_entry_item_json=JSON.parse(query.warehouse_entry_item)
    var index=parseInt(query.index)
    this.setData({
      supplier_name: query.supplier_name,
      material_name: query.material_name,
      index: index,
      supply: supply_json,
      warehouse_entry:warehouse_entry_json,
      warehouse_entry_item: warehouse_entry_item_json,
      
    });
    console.log(warehouse_entry_item_json)
  },

  create: function (e) {
    var that = this 
    var form = e.detail.value
    var transvar =
      'realAmount=' + form.realAmount + '&' +  //选择的warehouseEntry
      'amount=' + form.amount + '&' +
      'unit=' + form.unit + '&' +
      'unitAmount=' + form.unitAmount + '&' +
      'comment=' + form.comment 
    wx.navigateTo({
      url: '../../inspection/choseWarehouseEntryItem/choseWarehouseEntryItem' + '?' + transvar
    })
  }
})