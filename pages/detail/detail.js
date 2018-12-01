const reqUrl = require('../../utils/reqUrl');
const formatTime = require('../../utils/util.js')

// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailMsg:null,

    //倒计时
    countDown: null,

    //url传参
    options:null,

    wrap:true
  },
  // 一键复制
  detaGroup: function (e) {
    var detaGroup = e.target.dataset.href;
    wx.setClipboardData({
      data: detaGroup,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res);
          }
        })
      }
    })
  },
  // 点击上报
  click(e) {
    if (this.data.detailMsg.activity.type == 1) {

      //调用组件actionSheet的_animationOuter方法
      this.selectComponent('#actionSheet').animationOuter(e.currentTarget.dataset.qr)
      return;
    }

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.request({
      url: reqUrl + 'click',
      data: {
        id: e.currentTarget.dataset.id
      },
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //用户预约事件
  submit(e) {

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //事件触发当前活动id,index
    let id = e.detail.target.dataset.id;

    if (this.data.detailMsg.detail.status == 3) {

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

          wx.hideLoading();
          if (res.statusCode === 200) {
            

            //跳订单确认页
            setTimeout(function () {
              wx.hideLoading();
              wx.navigateTo({
                url: '../confirmOrder/confirmOrder?id=' + id + '&formId=' + e.detail.formId
              })
            }, 1500)

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

      return;
    }

    wx.request({
      url: reqUrl + 'reserve',
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

          wx.showToast({
            title: '预约成功！',
            icon: 'none',
            mask: true
          })

          //预约状态改为已预约
          this.data.detailMsg.detail.is_make = 2;
          this.setData({
            detailMsg: this.data.detailMsg
          })

          //倒计时
          let time = Number(this.data.detailMsg.detail.start_time) - Math.round(new Date / 1000);

          this.setData({
            countDown: formatTime.formatTime(time)
          })

          var interval = setInterval(() => {


            if (Number(time) > 0) {
              time--;
              this.setData({
              countDown: formatTime.formatTime(time)
              })
            } else {
              this.data.detailMsg.detail.status = 3
              this.setData({
                detailMsg: this.data.detailMsg
              })

              clearInterval(interval)
            }

          }, 1000)


          wx.hideLoading();
        }

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },


  //头像换行
  wrap(){
    this.setData({
      wrap:false
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

    this.setData({
      options:options
    })


    //获取当前广告详情
    wx.request({
      url: reqUrl + 'detail',
      header: {
        token: wx.getStorageSync('token')
      },
      data:{
        a_id: options.id
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        // console.log(res)

        if (res.statusCode == 200) {
          this.setData({
            detailMsg: res.data.msg
          })
          //已预约的倒计时
          
          if (res.data.msg.detail.is_make == 2 && res.data.msg.detail.status != 3 && res.data.msg.detail.status != 5) {

            let time = Number(this.data.detailMsg.detail.start_time) - Math.round(new Date / 1000);

            this.setData({
              countDown: formatTime.formatTime(time)
            })
            
            var interval =  setInterval(() => {
              
              
              if (Number(time) > 0) {
                time--
                this.setData({
                  countDown: formatTime.formatTime(time)
                })
              } else {
                this.data.detailMsg.detail.status  = 3
                this.setData({
                  detailMsg: this.data.detailMsg
                })

                clearInterval(interval);
              }
            }, 1000)
          }


          wx.hideLoading();
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

    var id = this.data.options.id
    console.log(id);
    console.log(wx.getStorageSync('uid'));
    return {
      title: wx.getStorageSync('nickName') + '正在参与抽奖，拜托你为他助力',
      path: '/pages/share/share?aid=' + id + '&uid=' + wx.getStorageSync('uid'),
    }

    
  }
})