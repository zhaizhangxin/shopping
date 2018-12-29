// pages/confirmOrder/confirmOrder.js
const reqUrl = require('../../utils/reqUrl');
const formatTime = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:null,
    // address:null,
    orderMsg:null,
  },

  /**
   * 事件处理函数
   */

  //获取地址信息
  chooseAddress(e){
    wx.chooseAddress({
      success: res => {
        console.log(res);
        this.setData({
          'orderMsg.address': res
        })
      }
    })
    wx.getSetting({
      success(res) {
        console.log(22);
        if (res.authSetting['scope.address'] == false) {
          wx.openSetting({
            success(res) {
              console.log(res.authSetting)
              // res.authSetting = {
              //   "scope.userInfo": true,
              //   "scope.userLocation": true
              // }
            }
          })
        } 
      }
    })
    
    
    
  },

  //用户出入信息
  getMessage(e){
    console.log(e.detail.value)
  },

  //提交订单
  subOrder(e){

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    if(this.data.orderMsg.address == ''){
      wx.showToast({
        title: '请完善地址信息',
        icon:'none',
        duration:1000
      })
      return ;
    }

    wx.request({
      url: reqUrl + 'affirmOrder',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        id: this.data.options.typeid,
        address: JSON.stringify(this.data.orderMsg.address)
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => {

        wx.hideLoading();
        if (res.statusCode == 200) {         

          wx.showToast({
            title: '订单提交成功',
            icon: 'none',
            duration: 1000
          })

          wx.switchTab({
            url: '../index/index',
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }

          })

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          })

        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  //支付订单
  subPay(e){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    if (this.data.orderMsg.address == '') {
      wx.showToast({
        title: '请完善地址信息',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    
    wx.request({
      url: reqUrl + 'conversion',
      header: {
        token: wx.getStorageSync('token')
      },
      data:{
        id: this.data.options.typeid,
        type: this.data.options.type,
        address: JSON.stringify(this.data.orderMsg.address)
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        wx.hideLoading();

        if (res.statusCode == 200) {
          console.log(res);
          wx.showToast({
            title: '订单提交成功',
            icon: 'none',
            duration: 1000
          })

          wx.switchTab({
            url: '../index/index',
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }

          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          })

        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    this.setData({
      options: options
    })

    //获取订单详情
    wx.request({
      url: reqUrl + 'orderDetail',
      header: {
        token: wx.getStorageSync('token')
      },
      data:{
        id: options.typeid,
        type: options.type
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        wx.hideLoading();
        if (res.statusCode == 200) {
          let wallets = res.data.msg;
          let money = formatTime.toMoney(wallets.money);
          let wallet = formatTime.toMoney(wallets.price)
          console.log(wallet);
          console.log(money);
          this.setData({
            orderMsg: res.data.msg,
            moneyPrice: money,
            walletPrice: wallet
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('nickName') + '正在参与抽奖，拜托你为他助力',
      path: '',
      imageUrl: '../../image/banner.jpg',
    }
  }
})