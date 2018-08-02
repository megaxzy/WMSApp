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
    date_no:'',//时间转no的形式
    supplier_id: '', //supplier message
    supplier_name: '',
    material_id: '', //material message
    material_name: '',
    material_no: '',
    material_product_line: '',
    supply:'', //供货信息
    all_storage_location:'', //所有库位信息
    warehouse_entry:'', //选择的那个入库单
    warehouse_entry_item:'', //条目信息
    index:'',//选择的条目顺序
    hide:[],
  },
  onLoad: function (query) {
    var that = this
    //获取现在时间
    var Y=time.Y
    var M=time.M
    var D=time.D
    var h=time.h
    var m=time.m
    var s=time.s
    var date=Y+'-'+M+'-'+D
    var date_no=Y+M+D+h+m+s
    var YMDhms=time.YMDhms
    this.setData({
      name:globaldata.user_name,
      role:globaldata.user_role,
      user_id:globaldata.user_id,
      warehouse_id:globaldata.chosen_warehouse.id,
      date:date,
      date_today:date,
      date_today_YMDhms: YMDhms,
      date_no:date_no,
      all_storage_location: globaldata.all_storage_location
    })
    //传递上个页面给的参数
    //json数据用wx.navigateTo需要先用JSON.stringify转码再用JSON.parse转码
    var supply_json = JSON.parse(query.supply)
    var warehouse_entry_json=JSON.parse(query.warehouse_entry)
    console.log(query.default_qualified_storage_location_name)
    console.log(query.default_qualified_storage_location_no)
    this.setData({
      supply: supply_json,
      supplier_id: query.supplier_id,
      supplier_name: query.supplier_name,
      material_id: query.material_id,
      material_name: query.material_name,
      material_no: query.material_no,
      material_product_line: query.material_product_line,
      warehouse_entry:warehouse_entry_json
    });
    that.showWarehouseEntryItem()
  },

  //用来保证在退回entry界面的时候入库单信息改变
  onShow: function () {
    var that = this
    that.showWarehouseEntryItem()
  },

  choseEntryItem: function (e) {
    var that=this
    var index = e.currentTarget.dataset.index;
    that.setData({
      index:index,
    })
    var hide=that.data.hide
    if(that.data.hide[index] == true){
      hide[index]=false
      that.setData({
        hide: hide,
      })
    }
    else {
      hide[index] = true
      that.setData({
        hide: hide,
      })
    }
    /*
    var supply = JSON.stringify(that.data.supply);
    var warehouse_entry = JSON.stringify(that.data.warehouse_entry);
    var warehouse_entry_item = JSON.stringify(that.data.warehouse_entry_item.data[index]);
    var transvar =
      'warehouse_entry=' + warehouse_entry + '&' +  //选择的warehouseEntry
      'supply=' + supply + '&' + //供货信息
      'supplier_name=' + that.data.supplier_name + '&' +
      'material_name=' + that.data.material_name + '&' +
      'index=' + index + '&' +//条目个数
      'warehouse_entry_item=' + warehouse_entry_item 
      */
  },

  showWarehouseEntryItem: function () {
    var that = this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('warehouseEntryId', 'EQUAL', that.data.warehouse_entry.id );
    con = condition.AddCondition('supplyId', 'EQUAL', that.data.supply.id);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'warehouse_entry_item/' + con,
      method: 'GET',//GET为默认方法   /POST
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'warehouse_entry_item/' + con)
        var res_temp = res
        that.setData({
          warehouse_entry_item: res
        })
        console.log('条目信息：：：')
        console.log(res)
        if(res_temp.data.length==0)
        {
          wx.showToast({
            title: '该入库单中没有此物料，请重新选择',
            icon: 'none',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                //要延时执行的代码
              }, 2000)
            }
          })
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
        var hide = [];
        for (var i = 0; i < that.data.warehouse_entry_item.data.length; i++) {
          hide.push(true);//添加数组的功能
          console.log(hide[i])
        } 
        that.setData({
          hide:hide
        })
      }
    })
  },






  create: function (e) {
    var that = this 
    var form = e.detail.value

    


    console.log("inspection note:")
    var object_output_inspection_note= {
      "id":200,
      "warehouseEntryId": that.data.warehouse_entry.id,//auto
      "warehouseId": that.data.warehouse_id, //auto 
      "no":form.no,
      "state":0,
      "description":form.description,
      "SAPNo":"",
      "inspectionTime": form.inspectionTime,
      "createPersonId": that.data.user_id,
      "createTime": form.createTime,
      "lastUpdatePersonId": that.data.user_id,
      "lastUpdateTime": form.createTime
    }
    console.log(object_output_inspection_note)
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'inspection_note/',
      data: [object_output_inspection_note],
      method: 'PUT',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'inspection_note/')
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
      complete: function () {

      }
    })         
  },
})