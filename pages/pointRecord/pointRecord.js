// pages/pointRecord/pointRecord.js
const reqUrl = require('../../utils/reqUrl');
const formatTimes = require('../../utils/utilTime.js')


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
    wx.showLoading({
      title: '加载中...',
      mask:true
    })

    wx.request({
      url: reqUrl +'integralRecord',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success:res =>{
        wx.hideLoading();
        if (res.data.error_code == 0){
          console.log(res);

          let datas = res.data.msg;
          let create_time = 'res.data.msg.create_time';
          for (let i = 0; i < datas.length; i++) {
            datas[i]["create_time"] = formatTimes.formatTimeTwo(datas[i]["create_time"], 'M-D')
          }

          this.setData({
            msgList:res.data.msg,
            [create_time]:datas
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