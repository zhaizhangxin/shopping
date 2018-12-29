const reqUrl = require('../../utils/reqUrl');
const formatTime = require('../../utils/util.js')
const formatTimes = require('../../utils/utilTime.js')


// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //倒计时
    countDown: null,
    //url传参
    options:null,
    // isLottery:2,
    envalMask:false,//福利红包
    // 倒计时
    countDownNum:'60',
    timer:'',
    // 总参与人员
    participation:false,
    report:true,//抽奖是否授权
  },
  // 领取福利
  envalColl:function(e){
    console.log(e);
    let formId = e.detail.formId;
    this.setData({
      envalMask:true,
      formId: formId
    })
  },
  // 关闭福利弹框
  exitMask:function(){
    this.setData({
      envalMask: false
    })
  },
  // 立即领取福利
  click: function (e) {
    let appid = e.currentTarget.dataset.appid;
    let path = e.currentTarget.dataset.path;

    wx.navigateToMiniProgram({
      appId: appid,
      path: path,
      success: res => {
        this.lottery();
        this.setData({
          envalMask: false,
          enval:1
        })
      },
      fail: function () { },
      complete: function () { }
    })

  },
  
  // 点击抽奖
  lottery:function(){
    console.log(221);
    wx.request({
      url: reqUrl + 'lottery/' + this.data.options.id,
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      data:{
        form_id: this.data.formId
      },
      responseType: 'text',
      success:res =>{
        if (res.data.error_code == 0){
          this.setData({
            isLottery: 1
          })
          // this.countDowns();
        }else{
          this.setData({
            lotteryMsg: res.data.msg,
            isClose:1
          })
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


  // 倒计时
  countDowns:function(){
    console.log(111);
    let that = this;
    let countDownNum = that.data.countDownNum;
    that.setData({
      timer:setInterval(function(){
        countDownNum--;
        that.setData({
          countDownNum: countDownNum
        })
        if (countDownNum == 0){
          clearInterval(that.data.timer);
        }
      },1000)
    })
  },

  // 更多抽奖
  moreDraw:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  // 收货地址
  address:function(){
    console.log(this.data.options.type)
    wx.navigateTo({
      url: '../confirmOrder/confirmOrder?type=' + this.data.options.type + '&typeid=' + this.data.options.id,
    })
  },
  // 总参与人员
  allParticipate:function(){
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    wx.request({
      url: reqUrl + 'avatar/' + this.data.options.id,
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success:res =>{
        wx.hideLoading();
        if (res.data.error_code == 0){
          this.setData({
            msgList:res.data.msg,
            participation: true
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
  // 关闭总参与人员
  exitPart:function(){
    this.setData({
      participation: false
    })
  },


  //用户授权事件
  getUserInfo: function (e) {
    wx.showLoading({
      title: '授权登录中...',
      mask: true
    })

    if (e.detail.userInfo) {

      wx.setStorageSync('nickName', e.detail.userInfo.nickName)

      wx.request({
        url: reqUrl + 'go_setinfo',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        header: {
          token: wx.getStorageSync('token')
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: res => {
          wx.hideLoading();
          if (res.statusCode == 200) {
            this.setData({
              report:true
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

    } else {
      wx.hideLoading();
      wx.showToast({
        title: '授权登录失败！',
        icon: 'none',
        duration: 1000
      })
    }
  },



  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    console.log(options);
    let option_in = options;
    this.setData({
      options: options
    })
    // 分享进入
    if (option_in.hasOwnProperty('pathid')){
      if(options.pathid == 1){
        this.setData({
          report:false
        })
      }
    }else{
      this.setData({
        report:true
      })
    }

  },

  details:function(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
   
    wx.request({
      url: reqUrl + 'go_detail/' + this.data.options.id + '/' + this.data.options.uid,
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        wx.hideLoading();
        console.log(res);
        if (res.data.error_code == 0) {
          let obj = res.data.msg;
          //自动开奖时间
          let datas = res.data.msg.activity.activityTime;
          let activityTimes = 'res.data.msg.activity.activityTime';
          let times = formatTimes.formatTimeTwo(datas, 'M月D日 h:m');
          let time_days = formatTimes.formatTimeTwo(datas, 'M月D日');

          let money = res.data.msg.activity.price;
          let toMoney = 'res.data.msg.activity.price';
          let toMoneyprice = formatTime.toMoney(money);

          let time = Number(res.data.msg.activity.activityTime) - Math.round(new Date / 1000);
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

          this.setData({
            shareImg: res.data.msg.shareImg,
            activity: res.data.msg.activity,//活动内容
            ['activity.price']: toMoneyprice,
            activityTimes: times,//自动开奖时间（月 日 时 分）
            activity_days: time_days,//开奖时间（天 小时）
            detail: res.data.msg.detail,//商品详情
            avatar: res.data.msg.avatar,//参与人员头像
            isLottery: res.data.msg.isLottery,//是否参与
          })
          if (obj.hasOwnProperty("luckUser")) {
            this.setData({
              luckUser: res.data.msg.luckUser,
              is_luck: 0
            })
            console.log(this.data.luckUser);
          }
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.isClose == 1) {
      wx.showModal({
        title: '提示',
        content: this.data.lotteryMsg,
      })
    }else{
      this.details();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
    console.log(this.data.shareImg);
    var id = this.data.options.id
    console.log(id);
    console.log(wx.getStorageSync('uid'));
    return {
      title: wx.getStorageSync('nickName') + '正在参与抽奖，拜托你为他助力',
      imageUrl: this.data.shareImg,
      // path: '/pages/share/share?aid=' + id + '&uid=' + wx.getStorageSync('uid'),
      path: '/pages/share/share?aid=' + id + '&uid=' + wx.getStorageSync('uid') + '&pathId=' + 1,
    }

    
  }
})