//1.1.2








//json数据用wx.navigateTo需要先用JSON.stringify转码再用JSON.parse转码
//多数 API 的回调都是异步，你需要处理好代码逻辑的异步问题
//函数传入的参数只能在本层使用   无法在内部子函数中使用
/*setTimeout(function () {
   //要延时执行的代码
    wx.navigateBack();
    }, 2000)
    延时程序
*/
//???假设有两种东西 我已经送件了一种 那另外一种还能送检吗？
//???一个 一维码 对应 supply 还是 supplier+material
//???同一个函数中定义两个同样的con好像会出问题
//TODO 这个地方日期输入为空不行  这个地方应该可以用数据 var={}解决
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})