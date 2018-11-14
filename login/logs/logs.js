
var condition = require('../../utils/condition.js')
var globaldata = require('../../utils/globaldata.js');
var util = require('../../utils/util.js');
var time = require('../../utils/time.js');
Page({

  //使用data必须用this.data.name形式
  data: {
    name: '',
    password: '',
    requiredata: '', //收到的用户信息
    all_warehouse: '', //收到的所有的仓库信息
    all_warehouse_array: [], //仓库姓名合集
    index:8,  //选择的哪项  默认为2
    chosen_warehouse:'',
    all_storage_location:'',
    all_material:'',
    all_supplier: '',
    all_supply:'',
    is_logining:'0'
  },

  onShow: function () {
    /*
    var x = "###112121"
    var y = "12"
    console.log(x.indexOf(y))
    */
    var that=this
    //获得仓库的所有内容
    var con = condition.NewCondition();
    con = condition.AddFirstOrder('name', ' ASC');//???ASC DESC都一样
    wx.request({
      url: globaldata.url + 'warehouse/'+globaldata.account+'warehouse/' + con,
      success: function (res) {
        //console.log(res)
        //console.log(res.data.length)
        var res_temp = res
        that.setData({
          all_warehouse: res
        })
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
      complete: function ()
      {
        globaldata.all_warehouse = that.data.all_warehouse 
        //test
        /*
        console.log('all_warehouse：')
        console.log(that.data.all_warehouse.data[0].name)
        console.log(that.data.all_warehouse.data[0])
        console.log(that.data.all_warehouse)
        console.log(that.data.all_warehouse.data.length)
        */
        //testend
        var all_warehouse_array=[];
        for (var i = 0; i < that.data.all_warehouse.data.length; i++) {
          all_warehouse_array.push(that.data.all_warehouse.data[i].name);//添加数组的功能
        } 
        console.log(all_warehouse_array)
        that.setData({
          all_warehouse_array:all_warehouse_array
        })
        that.getAllStorageLocation()
        //that.getAllMaterial()
        //that.getAllSupplier()
      }
    })
  },

  WarehouseChose: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  
  },

  // 获取输入账号 
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password:e.detail.value
    })
  },


  //order是排序
  //'http://localhost:9000/ledger/WMS_Template/person/{"conditions":[{"key":"name","relation":"EQUAL","values":["2"]},{"key":"password","relation":"EQUAL","values":["2"]}],"orders":[]}'
  // 登录 
  login: function () {
    //var that=this  子类函数中必须使用that.data...的形式来调用data{}中的内容
    var that=this
    if(that.data.is_logining==0){
      that.setData({
        is_logining:1
      })
    }
    /*
    else{
      return
    }
    */
    if (this.data.name.length == 0 || this.data.password.length == 0) {
      that.setData({
        is_logining: 1
      })
      wx.showToast({
        title: '账号或密码不能为空',
        icon: 'none',
        duration: 1000
      })
    } 
     else {
       
      var con=condition.NewCondition();
      con = condition.AddFirstCondition('name', 'EQUAL', this.data.name);
      con = condition.AddCondition('password', 'EQUAL', this.data.password);

      var contest2 =condition.NewCondition();
      contest2 = condition.AddFirstCondition('password', 'ADD', this.data.password);

      console.log('condition test:  ');
      console.log(con);
      console.log('condition test end  ');
      
      console.log('condition test2:  ');
      console.log(contest2);
      console.log('condition test2 end  ');
      /*
      var jsonObj = JSON.parse(jsonTest)
      console.log(jsonObj) 

      var jsonStr = JSON.stringify(jsonObj)   
      console.log(jsonStr) 
      */
      wx.request({
        //TODO 常量
        url: globaldata.url + 'ledger/' + globaldata.account +'person/'+con,
        method: 'GET',//GET为默认方法   /POST
        success: function (res) {
          console.log("succeed connect")
          //定义变量 不这么定义好像无法赋值到globaldata中
          var res_temp=res
          that.setData({
            requiredata: res
          })
         
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
        complete: function () //请求完成后执行的函数
        {
          if (that.data.requiredata.statusCode == '500'|| that.data.requiredata.statusCode== '404') {
            console.log('连接超时')
            wx.showModal({
              title: '错误',
              content: '连接超时',
              showCancel: false,
            })
          }
          else if(that.data.requiredata.data.length==0){
            console.log('登陆失败')
            wx.showToast({
              title: '登录失败,请检查用户名或者密码是否输入正确',
              icon: 'none',
              duration: 1500
            })
          }
          else {     
            //test
            console.log('resquiredata：')   
            console.log(that.data.requiredata.data[0].name)   
            console.log(that.data.requiredata.data[0])      
            console.log(that.data.requiredata)
            //testend
            
            globaldata.chosen_warehouse=that.data.all_warehouse.data[that.data.index]
            //console如果以'...'+变量的形式构成 则变量无法正常显示出来
            console.log(globaldata.chosen_warehouse)
            globaldata.user_id = that.data.requiredata.data[0].id
            globaldata.user_name=that.data.requiredata.data[0].name
            globaldata.user_role =that.data.requiredata.data[0].role
            globaldata.all_user_messages=that.data.requiredata.data[0]
            that.getAllSupply()

            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 1500,

            })


            setTimeout(function () {
              wx.hideToast()
            }, 1500)

            wx.navigateTo({
              //这个url不能是tabBar中的页面
              //url: '../../main/scan/scan'
              url: '../../main/chose/chose'
            })

          }
        }
      })
    }
  },

  //获得库位的所有内容
  getAllStorageLocation:function(){
    var that = this
    var con = condition.NewCondition();
    con = condition.AddFirstOrder('name', ' ASC');//???ASC DESC都一样
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'storage_location/' + con,
      success: function (res) {
        //console.log(res)
        //console.log(res.data.length)
        var res_temp = res
        if (res_temp.statusCode == 500) {
          wx.showToast({
            title: '网络连接超时，请检查网络是否可用',
            icon: 'none',
            duration: 2000
          })
        }
        that.setData({
          all_storage_location: res
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

        globaldata.all_storage_location = that.data.all_storage_location
        //test
        console.log('all_storage_location：')
        console.log(that.data.all_storage_location)
        //testend
      }
    })
  },


  //右上角分享功能
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: '',
      path: '/pages/list/list?id=' + that.data.scratchId,
      success: function (res) {
        // 转发成功

        that.shareClick();
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },



  getAllMaterial: function () {
    var that = this
    var con = condition.NewCondition();
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'material/' + con,
      success: function (res) {
        var res_temp = res
        if (res_temp.statusCode == 500) {
          wx.showToast({
            title: '网络连接超时，请检查网络是否可用',
            icon: 'none',
            duration: 2000
          })
        }
        that.setData({
          all_material: res
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

        globaldata.all_material = that.data.all_material
        //test
        console.log('all_material：')
        console.log(that.data.all_material)
        //testend
      }
    })
  },
  
  getAllSupplier: function () {
    var that = this
    var con = condition.NewCondition();
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'supplier/' + con,
      success: function (res) {
        var res_temp = res
        if (res_temp.statusCode == 500) {
          wx.showToast({
            title: '网络连接超时，请检查网络是否可用',
            icon: 'none',
            duration: 2000
          })
        }
        that.setData({
          all_supplier: res
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

        globaldata.all_supplier = that.data.all_supplier
        //test
        console.log('all_supplier：')
        console.log(that.data.all_supplier)
        //testend
      }
    })
  },

  getAllSupply: function () {
    var that = this
    var con = condition.NewCondition();
    con = condition.AddFirstCondition('enabled', 'EQUAL',1);
    con = condition.AddCondition('warehouseId', 'EQUAL', globaldata.chosen_warehouse.id);
    wx.request({
      url: globaldata.url + 'warehouse/' + globaldata.account + 'supply/' + con,
      success: function (res) {
        var res_temp = res
        if (res_temp.statusCode == 500) {
          wx.showToast({
            title: '网络连接超时，请检查网络是否可用',
            icon: 'none',
            duration: 2000
          })
        }
        /*
        var x = JSON.stringify(res_temp)
        console.log(x)
        var list = res.data.object.list;
        list.forEach(function (item, index, array) {
          array[index] = {
            firstImage: item.imageList[0].url,
            name: item.name,
            productId: item.productId
          }
        });
        */
        that.setData({
          all_supply: res
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

        globaldata.all_supply = that.data.all_supply
        //test
        console.log('all_supply：')
        console.log(that.data.all_supply)
        //testend
      }
    })
  }
})