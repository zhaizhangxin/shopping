const reqUrl = require('../../utils/reqUrl');
const formatTime = require('../../utils/util.js')
const formatTimes = require('../../utils/utilTime.js')

//index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // banner广告
    bannerMsg: null,

    //roll滚动数据
    rollMsg: [],

    //活动信息
    // activityMsg: [{ start_time: 1532998490,is_make:2,status:1}],
    activityMsg:[],

    //倒计时
    countDown:[],

    // 签到
    signMask:true
  },

  // 攻略
  raiders:function(){
    wx.navigateTo({
      url: '../raiders/raiders',
    })
  },

  // 点击跳转详情
  details:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id='+id+'&type='+10,
    })
  },
  // 我要上首页
  lottery:function(){
    wx.navigateTo({
      url: '../lottery/lottery',
    })
  },
  // 签到成功（关闭窗口）
  signSuccess:function(){
    this.setData({
      signMask:false
    })
  }, 
  // 福利商城
  welfareMall:function(){
    wx.navigateTo({
      url: '../welfareMall/welfareMall',
    })
  },
   


  /**
   * 事件处理函数
   */

  //用户预约事件
  submit(e){

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //事件触发当前活动id,index
    let id = e.detail.target.dataset.id;
    let index = e.detail.target.dataset.index;        

    if (this.data.activityMsg[index].status == 3){
      console.log(e.detail.formId);
      wx.request({
        url: reqUrl + 'rush',
        data: {
          a_id: id,
          form_id: e.detail.formId
        },
        header: {
          token: wx.getStorageSync('token')
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: res => {         

          if (res.statusCode === 200) {

            //跳订单确认页
            setTimeout(function(){
              wx.hideLoading();
              wx.navigateTo({
                url: '../confirmOrder/confirmOrder?id=' + id + '&formId=' + e.detail.formId
              })
            },1500)
            
            
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

      return ;
    }
  
    wx.request({
      url: reqUrl + 'reserve',
      data:{
        a_id: id,
        form_id: e.detail.formId
      },
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => {
  
        wx.hideLoading();

        if (res.statusCode === 200) {

          wx.showToast({
            title: '预约成功',
            icon: 'success',
            mask: true
          })
          
          //预约状态改为已预约
          this.data.activityMsg[index].is_make  = 2;
          this.data.activityMsg[index].participants_num++;
          this.setData({
            activityMsg: this.data.activityMsg
          })

          //倒计时          
          let time = Number(this.data.activityMsg[index].start_time) - Math.round(new Date / 1000);          
          let countDown = 'countDown[' + index + ']';

          this.setData({
            [countDown]: formatTime.formatTime(time)
          })

          var interval = setInterval(() => {
            
            if (Number(time) > 0) {      
              time--;
              this.setData({
                [countDown]: formatTime.formatTime(time)
              })
            } else {
              this.data.activityMsg[index].status = 3
              this.setData({ 
                activityMsg: this.data.activityMsg
              })

              clearInterval(interval);
            } 

          }, 1000)
                
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.request({
      url: reqUrl + 'index',
      header: {
        // code: wx.getStorageSync('code')
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        console.log(res);
        wx.hideLoading();
        if (res.data.error_code == 0) {
          let datas = res.data.msg.activity;
          let lottery_time = 'res.data.msg.activity.lottery_time';
          let price = 'res.data.msg.activity.price';
          
          for (let i = 0; i < datas.length; i++) {
            datas[i]["lottery_time"] = formatTimes.formatTimeTwo(datas[i]["lottery_time"], 'M月D日 h:m');
            // datas[i]["price"] = formatTime.toMoney(datas[i]["price"]);
          }
          
          let wallets = res.data.msg.wallet;
          let wallet = formatTime.toMoney(wallets);

          this.setData({
            wallet: wallet, //账户余额
            integral: res.data.msg.integral, //积分余额
            activity: res.data.msg.activity, //活动信息
            signIn: res.data.msg.signIn,
            [lottery_time]: datas,
            // [price]:datas
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
      title: wx.getStorageSync('nickName') + '喊你来0元拿大奖，速来！',
      path: '/pages/login/login',
      imageUrl: '../../image/banner.jpg',
    }
  }
  
})
