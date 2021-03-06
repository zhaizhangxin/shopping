// pages/welfare/welfare.js
const reqUrl = require('../../utils/reqUrl');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.integralSquare();
  },
  integralSquare:function(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.request({
      url: reqUrl + 'integralSquare',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        wx.hideLoading();
        if (res.data.error_code == 0) {
          // console.log(res);
          this.setData({
            msgList: res.data.msg
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

  // 点击领积分
  click:function(e){
    let list = e.currentTarget.dataset.list;
    this.setData({
      listId: list.id
    })
    wx.navigateToMiniProgram({
      appId: list.appid,
      path: list.path,
      success:res=>{
        console.log(res);
        this.getSquareIntegral();
      },
      fail: function () {},
      complete: function () { }
    })
  },
  // 领积分接口
  getSquareIntegral:function(){
    wx.request({
      url: reqUrl +'getSquareIntegral/'+this.data.listId,
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success:res=>{
        if (res.data.error_code == 0){
          console.log(res);
          this.integralSquare();
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          })
        }
      },
      fail: function () { },
      complete: function () { }
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

  }
})