// pages/share/share.js
const reqUrl = require('../../utils/reqUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:[],
    msg:null,
    options:null,
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

  getUserInfo(e){

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // wx.showLoading({
    //   title: '授权登录中...',
    //   mask: true
    // })


    if (e.detail.userInfo) {

      wx.setStorageSync('nickName', e.detail.userInfo.nickName)

      wx.request({
        url: reqUrl + 'setinfo',
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


          if (res.statusCode == 200) {

            var that = this;
            wx.request({
              url: reqUrl + 'help',
              header: {
                token: wx.getStorageSync('token')
              },
              data: {
                a_id: this.data.options.aid,
                uid: this.data.options.uid
              },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: res => {
                // console.log(res)

                wx.hideLoading();
                if (res.statusCode == 200) {

                  wx.showToast({
                    title: '助力成功',
                    icon: 'success',
                    mask: true
                  })

                  // console.log('share' + this.data.msg.share)
                  // console.log('msg' + res.data.msg)
                  // console.log(this)
                  var share = 'msg.share.' + wx.getStorageSync('uid');
                  // console.log(share)
                  this.setData({
                    'msg.is_help': 2,
                    [share]: res.data.msg
                  })
                  // console.log(that)

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
    
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    this.setData({
      options: options
    })

    //异步登录执行完的 resolve 
    getApp().login().then(res => {


      if (res.statusCode == 200) {

        wx.request({
          url: reqUrl + 'share',
          header: {
            token: wx.getStorageSync('token')
          },
          data: {
            a_id: options.aid,
            uid: options.uid
          },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: res => {
            // console.log(res.data.msg)


            wx.hideLoading();
            if (res.statusCode == 200) {

              var data = new Date(res.data.msg.start_time * 1000);

              this.setData({
                msg: res.data.msg,
                'data[0]': data.getMonth() + 1,
                'data[1]': data.getDate(),
                'data[2]': data.getHours() >= 10 ? data.getHours() : (data.getHours() + '0'),
                'data[3]': data.getMinutes() >= 10 ? data.getMinutes() : (data.getMinutes() + '0'),
              })

            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                mask: true
              })
              
              wx.switchTab({
                url: '../index/index'
              })
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })
  
      } else {
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })

      }

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
    var options = this.data.options
    return {
      title: wx.getStorageSync('nickName') + '正在参与抽奖，拜托你为他助力',
      path: '/pages/share/share?aid=' + options.aid + '&uid=' + options.uid,
    }
  }
})