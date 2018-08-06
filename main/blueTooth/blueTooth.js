
var condition = require('../../utils/condition.js');
var globaldata = require('../../utils/globaldata.js');

function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

Page({
  data: {
    devices: [],
    connected: false,
    chs: [],
  },
  startConnect: function () {
    var that = this;
    wx.showLoading({
      title: '开启蓝牙适配'
    });
    setTimeout(function () {
      wx.openBluetoothAdapter({
        success: function (res) {
          console.log("初始化蓝牙适配器成功");
          console.log(res);
          that.getBluetoothAdapterState();
        },
        fail: function (err) {
          console.log(err);
          wx.showToast({
            title: '蓝牙初始化失败',
            duration: 2000
          })
          setTimeout(function () {
          }, 2000)
        }
      });
    }, 2000)
  },
  getBluetoothAdapterState: function () {
    var that = this;
    wx.getBluetoothAdapterState({
      success: function (res) {
        var available = res.available,
          discovering = res.discovering;
        if (!available) {
          wx.showToast({
            title: '设备无法开启蓝牙连接',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        }
        else {
          if (!discovering) {
            that.startBluetoothDevicesDiscovery();
            //that.getConnectedBluetoothDevices();
          }
        }
      }
    })
  },
  startBluetoothDevicesDiscovery: function () {
    var that = this;
    wx.showLoading({
      title: '蓝牙搜索'
    });
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,//true???
      success: function (res) {
        if (!res.isDiscovering) {
          console.log("返回到getstate")
          console.log(res)
          that.getBluetoothAdapterState();
          
        }
        else {
          console.log("开启搜索")
          console.log(res)
          that.onBluetoothDeviceFound();
        }
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },
  onBluetoothDeviceFound: function () {
    var that = this;
    console.log('搜索列表onBluetoothDeviceFound');
    wx.onBluetoothDeviceFound(function (devices) {
      console.log('new device list has founded')
      console.log(devices);
      if (devices.devices[0]) {
        var name = devices.devices[0]['name'];
        if (name != '') {
          if (name.indexOf('FeiZhi') != -1) {
            var deviceId = devices.devices[0]['deviceId'];
            that.deviceId = deviceId;
            console.log(that.deviceId);
            that.startConnectDevices();
          }
        }
      }
    })
  },

  stopBluetoothDevicesDiscovery() {
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log("关闭扫描成功")
        console.log(res)
        wx.hideToast()
      },
      complete:function(){
        wx.getBluetoothDevices({
          success: function (res) {
            console.log("show所有设备")
            console.log(res)
          },
        })
      }
    })
  },




  getConnectedBluetoothDevices: function () {
    var that = this;
    wx.getConnectedBluetoothDevices({
      services: [],
      success: function (res) {
        console.log("获取处于连接状态的设备", res);
        var devices = res['devices'],
          flag = false,
          index = 0,
          conDevList = [];
        devices.forEach(function (value, index, array) {
          if (value['name'].indexOf('FeiZhi') != -1) {
            // 如果存在包含FeiZhi字段的设备
            flag = true;
            index += 1;
            conDevList.push(value['deviceId']);
            that.deviceId = value['deviceId'];
            return;
          }
        });
        if (flag) {
          this.connectDeviceIndex = 0;
          that.loopConnect(conDevList);
        }
        else {
          if (!this.getConnectedTimer) {
            that.getConnectedTimer = setTimeout(function () {
              that.getConnectedBluetoothDevices();
            }, 5000);
          }
        }
      },
      fail: function (err) {
        if (!this.getConnectedTimer) {
          that.getConnectedTimer = setTimeout(function () {
            that.getConnectedBluetoothDevices();
          }, 5000);
        }
      }
    });
  },
  
  startConnectDevices: function (ltype, array) {
    var that = this;
    clearTimeout(that.getConnectedTimer);
    that.getConnectedTimer = null;
    clearTimeout(that.discoveryDevicesTimer);
    that.stopBluetoothDevicesDiscovery();
    this.isConnectting = true;
    wx.createBLEConnection({
      deviceId: that.deviceId,
      success: function (res) {
        if (res.errCode == 0) {
          setTimeout(function () {
            that.getService(that.deviceId);
          }, 5000)
        }
      },
      fail: function (err) {
        console.log('连接失败：', err);
        if (ltype == 'loop') {
          that.connectDeviceIndex += 1;
          that.loopConnect(array);
        }
        else {
          that.startBluetoothDevicesDiscovery();
          that.getConnectedBluetoothDevices();
        }
      },
      complete: function () {
        console.log('complete connect devices');
        this.isConnectting = false;
      }
    });
  },
  getService: function (deviceId) {
    var that = this;
    // 监听蓝牙连接
    wx.onBLEConnectionStateChange(function (res) {
      console.log(res);
    });
    // 获取蓝牙设备service值
    wx.getBLEDeviceServices({
      deviceId: deviceId,
      success: function (res) {
        that.getCharacter(deviceId, res.services);
      }
    })
  },
  getService: function (deviceId) {
    var that = this;
    // 监听蓝牙连接
    wx.onBLEConnectionStateChange(function (res) {
      console.log(res);
    });
    // 获取蓝牙设备service值
    wx.getBLEDeviceServices({
      deviceId: deviceId,
      success: function (res) {
        that.getCharacter(deviceId, res.services);
      }
    })
  }
})
