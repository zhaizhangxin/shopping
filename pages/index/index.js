const reqUrl = require('../../utils/reqUrl');
const formatTime = require('../../utils/util.js')

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

    //获取banner广告
    wx.request({
      url: reqUrl + 'banner',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        if (res.statusCode == 200) {
          this.setData({
            bannerMsg: res.data.msg
          })

          // wx.hideLoading();
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

    //获取roll信息
    wx.request({
      url: reqUrl + 'roll',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        if (res.statusCode == 200) {
          this.setData({
            rollMsg: res.data.msg
          })

          // wx.hideLoading();
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

    //获取activity活动信息
    wx.request({
      url: reqUrl + 'activity',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {

        wx.hideLoading();
        console.log(res.data);
        if (res.statusCode == 200) {

          this.setData({
            activityMsg: res.data.msg
          })

          //已预约的倒计时
          for (let index in res.data.msg) {

            if (res.data.msg[index].is_make == 2 && res.data.msg[index].status != 3 && res.data.msg[index].status != 5) {

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
                  // console.log(index)
                  this.data.activityMsg[index].status = 3
                  this.setData({
                    activityMsg: this.data.activityMsg
                  })

                  clearInterval(interval);
                }
              }, 1000)
            }


          }

          // console.log(res)

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
