// pages/bannerAd/bannerAd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerUrl:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    wx.showLoading({
      title:'加载中...',
      mask:true
    })
  
    //设置web-view的url
    this.setData({
      bannerUrl:options.bannerUrl
    })
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading();
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