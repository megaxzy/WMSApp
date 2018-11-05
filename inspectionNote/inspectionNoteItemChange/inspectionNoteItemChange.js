//???假设有两种东西 我已经送件了一种 那另外一种还能送检吗？
var condition = require('../../utils/condition.js');
var globaldata = require('../../utils/globaldata.js');
var time = require('../../utils/time.js');
Page({
  data: {
    name: '',
    role: '',
    authority: '',
    user_id: '',
    warehouse_list: '',
    warehouse_id: '',
    date: '',//选择的时间
    date_today: '',//今天的时间
    date_today_YMDhms: '',//今天的时间
    supply: '', //供货信息
    inspection_note: '',
    inspection_note_item: '',
    qualified:'1'
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
      date_today_YMDhms: YMDhms,
    })
    var chosen_inspection_note_json = JSON.parse(query.chosen_inspection_note)
    var chosen_inspection_note_item_json = JSON.parse(query.chosen_inspection_note_item)
    this.setData({
      inspection_note: chosen_inspection_note_json,
      inspection_note_item: chosen_inspection_note_item_json,
    });
    
  },
  change_state_1: function (e) {
    var that = this
    var form = e.detail.value
    if(that.data.qualified==2){
      that.setData({
        qualified: '1'
      });
    }
  },
  change_state_2: function (e) {
    var that = this
    var form = e.detail.value
    if (that.data.qualified == 1) {
      that.setData({
        qualified: '2'
      });
    }
  },
  update: function (e) {
    var that = this 
    var form = e.detail.value

    if (form.returnAmount =='')
    {
      wx.showModal({
        title: '返回数量不能为空',
        content: '',
        showCancel: false,
      })
    }
    else if (form.returnAmount * form.returnUnitAmount > that.data.inspection_note_item.amount) 
    {
      wx.showModal({
        title: '返回数量不能大于送检数量',
        content: '',
        showCancel: false,
      })
    }
    else{       
      var res_temp
      console.log("inspection note item:")
      var object_output_inspection_note_item = {
        "id": that.data.inspection_note_item.id,
        "inspectionNoteId": that.data.inspection_note_item.inspectionNoteId,//auto
        "warehouseEntryItemId": that.data.inspection_note_item.warehouseEntryItemId, //auto 
        "amount": that.data.inspection_note_item.amount,
        "unit": that.data.inspection_note_item.unit,
        "unitAmount": that.data.inspection_note_item.unitAmount,
        "returnAmount": form.returnAmount * form.returnUnitAmount,
        "returnUnit": form.returnUnit,
        "returnUnitAmount": form.returnUnitAmount,
        "state": that.data.qualified,
        "comment": form.comment,
        "personId": that.data.user_id
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
          res_temp=res
        },
        //请求失败
        fail: function (err) {
          console.log("false")
          wx.showModal({
            title: '错误',
            content: '连接失败,请检查你的网络或者服务端是否开启',
            showCancel: false,
          })
        },
        complete: function () {
          if (res_temp.statusCode == 200) {
            var qul = that.data.qualified==1 ? 'true':'false'
            var x=null
            var object_output_inspection_note = 
              {
                "allFinish":false,
                "inspectFinishItems":
                  [{
                    "inspectionNoteItemId":that.data.inspection_note_item.id,
                    "qualified":qul,
                    "returnAmount":form.returnAmount,
                    "returnUnit":form.returnUnit,
                    "returnUnitAmount":form.returnUnitAmount,
                    //"returnStorageLocationId":100 ,//TODO
                    "personId":that.data.user_id,
                  }]
              }
            console.log(object_output_inspection_note)

            
            wx.request({
              url: globaldata.url + 'warehouse/' + globaldata.account + 'inspection_note/inspect_finish',
              data: [object_output_inspection_note],
              method: 'PUT',
              header: {'content-type': 'application/json'},
              success: function (res) {
                console.log(globaldata.url + 'warehouse/' + globaldata.account + 'inspection_note/inspect_finish')
                console.log(res)
                res_temp=res
              },
              //请求失败
              fail: function (err) {
                console.log("false")
                wx.showModal({
                  title: '错误',
                  content: '连接失败,请检查你的网络或者服务端是否开启',
                  showCancel: false,
                })
              },
              complete: function () {
                if(res_temp.statusCode==200)
                {
                  wx.showToast({
                    title: '修改成功',
                    icon: 'success',
                    duration: 2500,
                    success: function () {
                      setTimeout(function () {
                        //要延时执行的代码
                        wx.navigateBack();
                      }, 2500)
                    }
                  })
                }
                else
                {
                  console.log("wrong put")
                  wx.showModal({
                    title: '错误',
                    content: '' + res_temp.data,
                    showCancel: false,
                  })
                }
              }
            })
            
          }
          else{
            wx.showModal({
              title: '错误',
              content: '' + res_temp.data,
              showCancel: false,
            })
          }
        }
      })
    }
  },
})


          /*
          console.log("inspection note:")
          var object_output_inspection_note = {
            "id": that.data.inspection_note.id,
            "warehouseEntryId": that.data.inspection_note.warehouseEntryId,//auto
            "warehouseId": that.data.inspection_note.warehouseId, //auto 
            "no": that.data.inspection_note.no,
            "state": that.data.inspection_note.state,//TODO
            "description": that.data.inspection_note.description,
            "SAPNo": that.data.inspection_note.SAPNo,
            "inspectionTime": that.data.inspection_note.inspectionTime,
            "createPersonId": that.data.inspection_note.createPersonId,
            "createTime": that.data.inspection_note.createTime,
            "lastUpdatePersonId": that.data.user_id, //update
            "lastUpdateTime": that.data.date_today_YMDhms //update
          }
          console.log(object_output_inspection_note)
          console.log(that.data.inspection_note.createTime)
          console.log(that.data.inspection_note)
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
              wx.showToast({
                title: '存入成功',
                icon: 'success',
                duration: 1500,
                success: function () {
                  setTimeout(function () {
                    //要延时执行的代码
                    wx.navigateBack();
                  }, 1500)
                }
              })
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
          })*/