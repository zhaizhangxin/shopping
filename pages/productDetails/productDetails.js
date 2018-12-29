// pages/productDetails/productDetails.js
const reqUrl = require('../../utils/reqUrl');
const formatTime = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    redeemGood:false,
    cashGood:false
  },
  // 积分兑换
  redeemGoods:function(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      redeemGood:true,
      typeid: id
    })
  },
  // 关闭积分兑换
  exitRedeem:function(){
    this.setData({
      redeemGood: false
    })
  },
  // 现金兑换
  cashGoods:function(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      cashGood:true,
      typeid:id
    })
  },
  // 关闭现金兑换
  exitCash:function(){
    this.setData({
      cashGood: false
    })
  },

  // 积分兑换
  redGood:function(){
    wx.navigateTo({
      url: '../confirmOrder/confirmOrder?type=' + 20 + '&typeid=' + this.data.typeid,
    })
  },
  // 现金兑换
  redGoods:function(){
    wx.navigateTo({
      url: '../confirmOrder/confirmOrder?type=' + 30 + '&typeid=' + this.data.typeid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
    })
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    wx.request({
      url: reqUrl + 'welfareDetail/' + options.id,
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success:res =>{
        wx.hideLoading();
        console.log(res);
        if (res.data.error_code == 0){
          // 用户账号积分
          let userIntegral = res.data.msg.userIntegral;
          // 用户账号余额
          let userBalance = res.data.msg.userBalance;
          // 兑换所需积分
          let integral = res.data.msg.integral;
          // 兑换所需金额
          let balance = res.data.msg.balance;

          if (userIntegral > integral){
            this.setData({
              user_Integral: 1
            })
          }else{
            this.setData({
              user_Integral: 2
            })
          }

          if (userBalance > balance){
            this.setData({
              user_Balance: 1
            })
          }else{
            this.setData({
              user_Balance: 2
            })
          }
          // 市场价
          let price = res.data.msg;
          // let toprice = 'res.data.msg.price';
          let to_price = formatTime.toMoney(price.price);
          let to_balance = formatTime.toMoney(price.balance);

          console.log(to_price);


          this.setData({
            msgList:res.data.msg,
            to_price: to_price,
            to_balance: to_balance
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          })
        }
      },
      fail:function(){},
      complete:function(){}
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