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
    //inspection_note_list:'', //inspection集合
    warehouse_id:'', //warehouse id
    date: '',//选择的时间
    date_today: '',//今天的时间 
    supplier_id:'', 
    supplier_name: '',
    material_id: '',
    material_name: '',
    material_no: '',
    supply:'', //供货信息
    warehouse_entry_item_list:'',
    chosen_warehouse_entry_item:'',

    transfer_order_item_list: '',
    transfer_order:'', //用来判断是不是 备货单
    transfer_order_item_array: [],
    chosen_transfer_order_item:''
  },
  onLoad: function () {
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
    
  },
  //用来保证在退回entry界面的时候入库单信息改变
  onShow:function(){
    var that=this
    //that.showDeliveryOrderItem();
  },
  bindDateChange: function (e) {
    var that=this
    this.setData({
      date: e.detail.value
    })
    that.showDeliveryOrderItem();
  },

  showTransferOrderItem:function(){
    var that=this

    var con = condition.NewCondition();
    con = condition.AddFirstCondition('supplyId', 'EQUAL', that.data.supply.id);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'transfer_order_item/' + con,
      method: 'GET',
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'transfer_order_item/' + con)
        var res_temp = res
        that.setData({
          transfer_order_item_list: res
        })
        console.log("由barcodeno获得的供货信息获得的条目单")
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
      complete:function(){
        that.judge(0)
      }
    })
  },
  
  judge:function(i){
    var that = this

    var con = condition.NewCondition();
    con = condition.AddFirstCondition('id', 'EQUAL', that.data.transfer_order_item_list.data[i].transferOrderId);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'transfer_order/' + con,
      method: 'GET',
      success: function (res) {
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'transfer_order/' + con)
        var res_temp = res
        that.setData({
          transfer_order: res_temp.data[0]
        })
        console.log("transferOrder:")
        console.log(that.data.transfer_order)
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
        console.log("i:"+i)
        console.log(that.data.transfer_order_item_list.data.length)
        if (that.data.transfer_order.type==1){
          var transfer_order_item_array = that.data.transfer_order_item_array
          var temp = that.data.transfer_order_item_list.data[i]
          transfer_order_item_array.push(JSON.stringify(temp))
          that.setData({
            transfer_order_item_array: transfer_order_item_array
          })

        }
        if(i<that.data.transfer_order_item_list.data.length-1){
          that.judge(i+1)
        }
        else{
          console.log(that.data.transfer_order_item_array)
          /*
          var transfer_order_item_list = JSON.parse(that.data.transfer_order_item_array)
          that.setData({
            transfer_order_item_list: transfer_order_item_list
          })
         */
          console.log("judge 完成")
          console.log(JSON.stringify(that.data.transfer_order_item_array))
          console.log(that.data.transfer_order_item_array[0])
          console.log(that.data.transfer_order_item_array[0].id)
          console.log(that.data.transfer_order_item_array[0].valueOf("id"))
          var transfer_order_item_list = JSON.parse(that.data.transfer_order_item_array)
        }
      }
    })
  },

  chose: function (e) {
    var that=this
    // 获取分类id并切换分类
    var index = e.currentTarget.dataset.index;
    var chosen_transfer_order_item = that.data.transfer_order_item_list.data[index]
    //var entryId = that.data.warehouseEntry_list.data[index].id
    console.log(index)
    console.log(that.data.transfer_order_item_list.data[index])
    wx.showToast({
      title: '进入【送检单条目】生成页面',
      icon: 'none',
      duration: 2000
    })
    var supply = JSON.stringify(that.data.supply);
    var chosen_transfer_order_item = JSON.stringify(chosen_transfer_order_item);
    var transvar = 
      'chosen_transfer_order_item=' + chosen_transfer_order_item + '&' +  //选择的 入库单条目
      'supply=' +  supply + '&' +
      'supplier_id=' + that.data.supplier_id +'&'+
      'supplier_name=' + that.data.supplier_name + '&'+
      'material_id=' + that.data.material_id + '&'+
      'material_name=' + that.data.material_name + '&' +
      'material_no=' + that.data.material_no + '&' +
      'material_product_line=' + that.data.material_product_line
    wx.navigateTo({
      url: '../../transferOrder/transferOrderItem/transferOrderItem' + '?'+transvar
    })
  },

  scan: function () {
    var that=this
    //扫码
    wx.scanCode({
      scanType: 'barCode',
      success: (res) => {
        console.log(res)
        /*
        that.setData({
          //TODO此处应该是res 仅作测试
          rescode: '1234567'
        });
        console.log(that.data.rescode)
        that.getSupply()
        //根据扫码内容获得 供应商id和物料id
        //TODO 此处应该是获得  test程序中用来索取
        that.setData({
          supplier_id: that.data.supply.supplier_id,
          material_id: that.data.supply.material_id
        })*/
      },
    complete: function () {
      //test begin
      that.setData({
        //TODO此处应该是res 仅作测试
        rescode: '1234567'
      });
      console.log(that.data.rescode)
      that.getSupply()
      //根据扫码内容获得 供应商id和物料id
      //TODO 此处应该是获得  test程序中用来索取
      //根据供应商id获得供应商名称 物料id和物料名称

      //更新表单
      
    }
    })
  },
  //根据条码获得供货信息  并调用getThree...函数获得库位信息
  getSupply: function () {
    //获得供货信息
    var that=this
    var con = condition.NewCondition();
    //
    con = condition.AddFirstCondition('barCodeNo', 'EQUAL', that.data.rescode);
    con = condition.AddCondition('warehouseId', 'EQUAL', that.data.warehouse_id);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'supply/' + con,
      method: 'GET',//GET为默认方法   /POST
      success: function (res) {
        console.log("succeed connect")
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'supply/' + con)
        var res_temp = res
        that.setData({
          supply: res_temp.data[0]
        })
        console.log(that.data.supply)
        console.log(res.data[0].barCodeNo)//TODO 暂时查不到barcodeno
        that.setData({
          supplier_id: that.data.supply.supplierId,
          material_id: that.data.supply.materialId
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
      complete:function(){
        that.getSupplierName()
        that.getMaterialName()
        that.showTransferOrderItem()
      }
    })
  },
  //根据供应商id获得供应商名称
  getSupplierName:function(){
    var that=this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('id', 'EQUAL', that.data.supplier_id);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'supplier/' + con,
      method: 'GET',//GET为默认方法   /POST
      success: function (res) {
        console.log("succeed connect")
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'supplier/' + con)
        var res_temp = res.data[0].name
        that.setData({
          supplier_name: res_temp
        })
        console.log(res)
        console.log(res.data[0].name)
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

  //根物料id获得物料名称
  getMaterialName: function () {
    var that=this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('id', 'EQUAL', that.data.material_id);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'material/' + con,
      method: 'GET',//GET为默认方法   /POST
      success: function (res) {
        console.log("succeed connect")
        console.log(globaldata.url + 'warehouse/' + globaldata.account + 'material/' + con)
        var res_temp = res.data[0].name
        var res_temp_no = res.data[0].no
        var res_temp_product_line = res.data[0].productLine
        that.setData({
          material_name: res_temp,
          material_no:res_temp_no,
          material_product_line:res_temp_product_line
        })
        console.log(res)
        console.log(res.data[0].name)
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
})
