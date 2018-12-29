// pages/lottery/lottery.js
const reqUrl = require('../../utils/reqUrl');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartArr: [{
      title: "小程序跳转"
    }],
    inputValue: '',
    phone:true
  },
  // 手机号
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
    let inputValue = e.detail.value;
    if (inputValue.length == 11){
      this.setData({
        phone:false
      })
    }else{
      this.setData({
        phone: true
      })
    }
  },
  // 选择logo
  chooseImage: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        let tempfile = res.tempFilePaths;
        console.log(tempfile[0]);
        const tempFilePaths = tempfile.toString();
        that.setData({
          tempFilePaths: tempFilePaths
        })
      },
    })
  },
  // 提交信息
  formSubmit(e){
    let inputValue = this.data.inputValue;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(inputValue)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
    }else{
      wx.showLoading({
        title: '提交中...',
        mash: true
      })
      // 小程序
      if (e.detail.value.is_miniprogram == ''){
        e.detail.value.is_miniprogram = 0;
      }else{
        e.detail.value.is_miniprogram = 1;        
      }

      let values = e.detail.value;
      let that = this;
      if (this.data.tempFilePaths != undefined){
        console.log('图片');
        let sponsor = this.data.tempFilePaths;
        wx.uploadFile({
          url: reqUrl + 'upload',
          method:"POST",
          filePath: sponsor,
          formData:{
            path: 'sponsor'
          },
          name: 'file',
          header: {
            token: wx.getStorageSync('token'),
            'content-type': 'multipart/form-data'
          },
          success:res =>{
            const data = res.data;
            let dataList = JSON.parse(data);
            if (dataList.error_code == 0){
              let msglist = dataList.msg;
              if (!values.hasOwnProperty("logo")) {
                values['logo'] = msglist;
              }

              that.setData({
                values: values
              })

              that.sponsor();

            }else{
              wx.showToast({
                title: dataList.msg,
                icon: 'none',
                mask: true
              })
            }
          },
          fail:function(res){},
          complete:function(res){},
        })
      }else{
        console.log('没有图片');
       
        if (!values.hasOwnProperty("logo")){
          let tempFilePaths = this.data.tempFilePaths;
          values['logo'] = tempFilePaths;
        }
        this.setData({
          values: values
        })

        this.sponsor();
      }

      // console.log('form发生了submit事件，携带数据为：', e.detail.value);
    }
  },

  sponsor:function(){
    wx.request({
      url: reqUrl + 'addSponsor',
      header: {
        token: wx.getStorageSync('token')
      },
      data: this.data.values,
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        wx.hideLoading();
        if (res.data.error_code == 0){
          wx.showModal({
            title: '提交成功',
            content: '我们的客服人员尽快与您联系',
            showCancel: false,
            confirmColor:'#FF1946',
            success(res){
              if (res.confirm) {
                wx.switchTab({
                  url: '../index/index',
                })
              }
            }
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})