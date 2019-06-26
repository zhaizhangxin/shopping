// pages/welfareMall/welfareMall.js
const reqUrl = require('../../utils/reqUrl');
const formatTime = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    earn:[],
    product:[],
    signData:[],
    integral:'',
    shareId:'',
    gif:'',
    pointMask:false
  },
  // 签到
  signTop:function(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: reqUrl + 'signIn',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        wx.hideLoading();
        if (res.data.error_code == 0) {
          this.welfareMall();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { }
    })
  },
  // 分享抽奖、点击抽奖
  shareIndex:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  // 关注公众号显示
  pointMove:function(){
    this.setData({
      pointMask:true
    })
  },
  // 关闭公众号
  exitPoint:function(){
    this.setData({
      pointMask: false
    })
  },
  // 关注公众号接口
  earnPoint:function(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: reqUrl + 'attentionAward',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        wx.hideLoading();
        if (res.data.error_code == 0) {
          this.setData({
            pointMask: false
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          })
        }
      }
    })

  },
  // 跳转产品详情
  productDetails:function(e){
    let id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../productDetails/productDetails?id='+id,
    })
  },
  // 兑换商城
  welfareMall:function(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: reqUrl + 'welfare',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        wx.hideLoading();
        if (res.data.error_code == 0) {
          this.setData({
            earn: res.data.msg.earn,
            product: res.data.msg.product,
            integral: res.data.msg.integral,
            signData: res.data.msg.signData,
            gif: res.data.msg.gif
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
      complete: function (res) { }
    })
  },
  // 分享小程序
  shareApp:function(e){
    let id = e.currentTarget.dataset.id;
    // console.log(id);
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: reqUrl + 'shareAward',
      header: {
        token: wx.getStorageSync('token')
      },
      data:{
        type: id
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        wx.hideLoading();
        if (res.data.error_code == 0) {
          
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.welfareMall();
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
  onShareAppMessage: function (res) {
    // 50 分享抽奖
    // 60 分享小程序
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    //   if (res.target.dataset.id == '50'){
    //     return {
    //       title: wx.getStorageSync('nickName') + '正在参与抽奖，拜托你为他助力',
    //       imageUrl: this.data.shareImg,
    //       // path: '/pages/share/share?aid=' + id + '&uid=' + wx.getStorageSync('uid'),
    //       path: '/pages/share/share?aid=' + id + '&uid=' + wx.getStorageSync('uid') + '&pathId=' + 1,
    //     }
    //   }
    // }
    
  }
})