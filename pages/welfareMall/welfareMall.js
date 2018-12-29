// pages/welfareMall/welfareMall.js
const reqUrl = require('../../utils/reqUrl');
const formatTime = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    getingCash:false,
    countDown:null
  },
  // 现金弹框
  getting_Cash:function(){
    this.setData({
      getingCash:true
    })
  },
  // 关闭现金弹框
  exitGetting:function(){
    this.setData({
      getingCash:false
    })
  },
  // 兑换记录
  redemptionRecord:function(){
    wx.navigateTo({
      url: '../redemptionRecord/redemptionRecord',
    })
  },
  // 获取积分
  welfare:function(){
    wx.switchTab({
      url: '../welfare/welfare',
    })
  },
  // 去领钱
  winningRecord:function(){
    wx.navigateTo({
      url: '../winningRecord/winningRecord',
    })
  },
  // 去抽奖
  index:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  // 跳转产品详情
  productDetails:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../productDetails/productDetails?id='+id,
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
      url: reqUrl +'welfare',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success:res=>{
        wx.hideLoading();
        console.log(res);
        if (res.data.error_code == 0){

          let time = Number(res.data.msg.timeLimit.end_time) - Math.round(new Date / 1000);
          this.setData({
            countDown: formatTime.formatTime(time)
          })
          var interval = setInterval(() => {
            if (Number(time) > 0) {
              time--
              this.setData({
                countDown: formatTime.formatTime(time)
              })
            } else {
              // this.data.detailMsg.detail.status  = 3
              // this.setData({
              //   detailMsg: this.data.detailMsg
              // })
              clearInterval(interval);
            }
          }, 1000)

          let balances = res.data.msg.balance;
          let toMoneyprice = formatTime.toMoney(balances);
          // 限时兑换
          let datas = res.data.msg.timeLimit.data;
          let balance = 'res.data.msg.timeLimit.data.balance';
          for (let i = 0; i < datas.length; i++) {
            datas[i]["balance"] = formatTime.toMoney(datas[i]["balance"]);
          }

          // 热门兑换
          let data_s = res.data.msg.hot.data;
          let balance_s = 'res.data.msg.hot.data.balance';
          for (let i = 0; i < data_s.length; i++) {
            data_s[i]["balance"] = formatTime.toMoney(data_s[i]["balance"]);
          }

          this.setData({
            // 已兑换数量
            conversionRecordCount: res.data.msg.conversionRecordCount,
            //已领取积分
            integral: res.data.msg.integral,
            //已领取现金
            balance: toMoneyprice,
            balanceNotGet: res.data.msg.balanceNotGet,
            timeLimit: res.data.msg.timeLimit,
            hot: res.data.msg.hot,
            [balance]:datas,
            [balance_s]:data_s
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          })
        }
      },
      fail:function(res){},
      complete:function(res){}
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