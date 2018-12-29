// pages/allDraws/allDraws.js
const reqUrl = require('../../utils/reqUrl');
const formatTime = require('../../utils/util.js');
const formatTimes = require('../../utils/utilTime.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 跳转详情
  detailList:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id + '&type=' + 10,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask:true
    })

    wx.request({
      url: reqUrl +'lotteryRecord',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success:res =>{
        wx.hideLoading();
        if (res.data.error_code == 0){
          let datas = res.data.msg;
          let lottery_time = 'res.data.msg.lottery_time';
          let price = 'res.data.msg.price';
          for (let i = 0; i < datas.length; i++) {
            datas[i]["lottery_time"] = formatTimes.formatTimeTwo(datas[i]["lottery_time"], 'M月D日')
            datas[i]["price"] = formatTime.toMoney(datas[i]["price"])
          }
          this.setData({
            msgList:res.data.msg,
            [lottery_time]:datas
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

  }
})