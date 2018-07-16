
var condition = require('../../utils/condition.js');

Page({
  data: {
    name: '',
    password: ''
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
      password: e.detail.value
    })
  },
  //'http://localhost:9000/ledger/WMS_Template/person/{"conditions":[{"key":"name","relation":"EQUAL","values":["2"]},{"key":"password","relation":"EQUAL","values":["2"]}],"orders":[]}'
  // 登录 
  login: function () {
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
      var contest = condition.AddFirstCondition('name', 'EQUAL', '2');
      contest = condition.AddCondition('password', 'EQUAL', '2');
      console.log('condition test:  ');
      console.log(contest);
      console.log('condition test end  ');
      
      /*
      var jsonObj = JSON.parse(jsonTest)
      console.log(jsonObj) 

      var jsonStr = JSON.stringify(jsonObj)   
      console.log(jsonStr) */
      wx.request({
        url: 'http://localhost:9000/ledger/WMS_Template/person/'+contest,
        
        data: {//发送给后台的数据
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'GET',//GET为默认方法   /POST
        success: function (res) {
          //sectionData = res.data;
          console.log("succeed")
          var userInfo = JSON.stringify(res.data);
          console.log(res.data)
          console.log(res.data.length)
          console.log(res.data[0])
          console.log(res.data[0].id)
          console.log(res.data[0].name)
        },
        //请求失败
        fail: function (err) {
          console.log("false")
          wx.showToast({
            title: '登录失败，请检查你的网络',
            icon: 'none',
            duration: 1500
          })
        },
        complete: function () { }//请求完成后执行的函数
      })
      // 这里修改成跳转的页面 
      wx.navigateTo({
        url: '../../pages/index/index'
      })
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500
      })
    }
  }
})