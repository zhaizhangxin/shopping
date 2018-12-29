// pages/page/page.js
const reqUrl = require('../../utils/reqUrl');
const formatTime = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  // 攻略
  raiders: function () {
    wx.navigateTo({
      url: '../raiders/raiders',
    })
  },
  // 全部抽奖
  allDraw:function(){
    wx.navigateTo({
      url: '../allDraws/allDraws',
    })
  },
  // 积分记录
  pointRecord:function(){
    wx.navigateTo({
      url: '../pointRecord/pointRecord',
    })
  },
  // 中奖记录
  winningRecord:function(){
    wx.navigateTo({
      url: '../winningRecord/winningRecord',
    })
  },
  // 我的信息
  information:function(){
    wx.navigateTo({
      url: '../information/information',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.request({
      url: reqUrl+'my',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success:res =>{
        wx.hideLoading();
        if (res.data.error_code == 0){
          let wallets = res.data.msg.wallet;
          let wallet = formatTime.toMoney(wallets);
          this.setData({
            wallet: wallet,//余额
            integral: res.data.msg.integral//积分
          })
        }else{
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