
var condition = require('../../utils/condition.js')
var globaldata = require('../../utils/globaldata.js');

Page({
  //使用data必须用this.data.name形式
  data: {
    name: '',
    password: '',
    requiredata:''
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
    if (this.data.name.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '账号或密码不能为空',
        icon: 'none',
        duration: 1000
      })
    } 
     else {
       //condition情况下会收到所有的
      var jsonTest = '{"conditions":[{"key":"name","relation":"EQUAL","values":["2"]},{"key":"password","relation":"EQUAL","values":["2"]}]}'   

      //condition test 
      //condition.AddCondition('name','EQUAL','2');
      var input_name=this.data.name;
      var input_password =this.data.password;
      var contest=condition.NewCondition();//TODO 全局变量
      contest= condition.AddFirstCondition('name', 'EQUAL', input_name);
      contest = condition.AddCondition('password', 'EQUAL', input_password);

      var contest2 =condition.NewCondition();
      contest2 = condition.AddFirstCondition('password', 'ADD', input_password);

      console.log('condition test:  ');
      console.log(contest);
      console.log('condition test end  ');
      
      console.log('condition test2:  ');
      console.log(contest2);
      console.log('condition test2 end  ');
      /*
      var jsonObj = JSON.parse(jsonTest)
      console.log(jsonObj) 

      var jsonStr = JSON.stringify(jsonObj)   
      console.log(jsonStr) */
      wx.request({
        //TODO 常量
        url: globaldata.url+contest,
        
        data: {//发送给后台的数据
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'GET',//GET为默认方法   /POST
        success: function (res) {
          //sectionData = res.data;
          console.log("succeed connect")
          /*
          var userInfo = JSON.stringify(res.data);

          console.log(res)
          console.log(res.data)
          console.log('res.data.length:'+res.data.length)
          console.log(res.data[0])
          */
          //console.log(res.data[0].name)
          //定义变量
          var res_temp=res
          that.setData({
            requiredata: res
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
        complete: function () //请求完成后执行的函数
        {
          
          console.log('res:')
          console.log(that.data.requiredata.statusCode)
          console.log(that.data.requiredata.data)
          console.log(that.data.requiredata.data[0])
          console.log(that.data.requiredata.data[0].name)
          console.log('res end')
          
          //TODO 500是字符串
          if (that.data.requiredata.statusCode == '500'|| that.data.requiredata.statusCode== '404') {
            //console.log('res:' + requiredata.statusCode)
            console.log('连接超时')
            wx.showToast({
              title: '连接超时',
              icon: 'none',
              duration: 1500
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
                                 that.data.requiredata.data[0].name
            globaldata.user_name=that.data.requiredata.data[0].name
            globaldata.user_role =that.data.requiredata.data[0].role
            wx.navigateTo({
              //这个url不能是tabBar中的页面
              url: '../../main/scan/scan'
            })
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 1500
            })

          }
        }
      })


    }
  }
})