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
    chosen_warehouse_entry_item:'',//选择的 入库条目信息
    inspection_note:'',
    inspection_note_item:'',//送检单条目 信息
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
    var chosen_warehouse_entry_item_json = JSON.parse(query.chosen_warehouse_entry_item)
    this.setData({
      supply: supply_json,
      chosen_warehouse_entry_item: chosen_warehouse_entry_item_json,
      supplier_id: query.supplier_id,
      supplier_name: query.supplier_name,
      material_id: query.material_id,
      material_name: query.material_name,
      material_no: query.material_no,
      material_product_line: query.material_product_line
    });
    
    that.showInspectionNoteItem()
    
  },

/*
  //用来保证在退回entry界面的时候入库单信息改变
  onShow: function () {
    var that = this
    that.showWarehouseEntryItem()
  },
*/
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
  },

  getInspectionNote:function(){
    var that = this
    var con = condition.NewCondition();
    console.log("noteid test test")
    console.log(that.data.inspection_note_item.inspectionNoteId)
    con = condition.AddFirstCondition('warehouseEntryItemId', 'EQUAL', that.data.inspection_note_item.inspectionNoteId);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'inspection_note_item/' + con,
      method: 'GET',
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'inspection_note_item/' + con)
        var res_temp = res
        that.setData({
          inspection_note: res_temp.data[0]
        })
        console.log('送检单 信息：')
        console.log(that.data.inspection_note)
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
    })
  },

  showInspectionNoteItem: function () {
    var that = this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('warehouseEntryItemId', 'EQUAL', that.data.chosen_warehouse_entry_item.id );
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'inspection_note_item/' + con,
      method: 'GET',//GET为默认方法   /POST
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'inspection_note_item/' + con)
        var res_temp = res
        that.setData({
          inspection_note_item: res_temp.data[0]
        })
        console.log('送检单条目信息：')
        console.log(that.data.inspection_note_item)
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
        that.getInspectionNote() //如果这个要显示则放在下一条的完成部分
        /*
        var hide = [];
        for (var i = 0; i < that.data.warehouse_entry_item.data.length; i++) {
          hide.push(true);//添加数组的功能
          console.log(hide[i])
        } 
        that.setData({
          hide:hide
        })*/
      }
    })
  },






  update: function (e) {
    var that = this 
    var form = e.detail.value

    console.log("inspection note item:")
    var object_output_inspection_note_item= {
      "id": that.data.inspection_note_item.id,
      "inspectionNoteId": that.data.inspection_note_item.inspectionNoteId,//auto
      "warehouseEntryItemId": that.data.inspection_note_item.warehouseEntryItemId, //auto 
      "state": that.data.inspection_note_item.state,
      "amount": that.data.inspection_note_item.amount,
      "unit": that.data.inspection_note_item.unit,
      "unitAmount": that.data.inspection_note_item.unitAmount,
      "returnAmount":form.returnAmount,
      "returnUnit":form.returnUnit,
      "returnUnitAmount":form.returnUnitAmount,
      "comment": that.data.inspection_note_item.comment,
      "personId":that.data.user_id
    }
    console.log(object_output_inspection_note_item)
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'inspection_note_item/',
      data: [object_output_inspection_note_item],
      method: 'PUT',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'inspection_note_item/')
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
        console.log("inspection note:")
        var object_output_inspection_note = {
          "id": that.data.inspection_note.id,
          "warehouseEntryId": that.data.inspection_note.warehouseEntryId,//auto
          "warehouseId": that.data.inspection_note.warehouseId, //auto 
          "no": that.data.inspection_note.no,
          "state": that.data.inspection_note.state,
          "description": that.data.inspection_note.description,
          "SAPNo": that.data.inspection_note.SAPNo,
          "inspectionTime": that.data.inspection_note.inspectionTime,
          "createPersonId": that.data.inspection_note.createPersonId,
          "createTime": that.data.inspection_note.createTime,
          "lastUpdatePersonId": that.data.user_id,
          "lastUpdateTime": that.data.YMDhms
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
      }

    })
  },
})