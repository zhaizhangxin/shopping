// pages/lottery/lottery.js
const reqUrl = require('../../utils/reqUrl');
var dateTimePicker = require('../../utils/dateTimePicker.js');
var imgArr = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartArr: [{
      title: "小程序跳转"
    }],
    inputText:true,
    img_url: [],
    productInfo: [],
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2019,
    endYear: 2050,
    data_times:0
  },
  

  // 奖品图片
  // 点击选取照片
  chooseImage: function () {
    var that = this;
    let counts = that.data.img_url.length;
    let count = 9 - counts;
    wx.chooseImage({
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res);
        var len = that.data.imgCount + res.tempFilePaths.length;
        if (res.tempFilePaths.length > 0) {
          if (len == 9) {
            that.setData({
              hideAdd: 1
            })
          } else {
            that.setData({
              hideAdd: 0
            })
          }
          // 把每次选择的图push到数组
          // let img_url = that.data.img_url;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            imgArr.push(res.tempFilePaths[i])
          }
          that.setData({
            imgCount: len,
            img_url: imgArr,
            tempFiles: res.tempFiles
          })
        }
      },
    })
  },


  // 提交信息
  formSubmit(e){
    let values = e.detail.value;
    let that = this;
    that.setData({
      values: values
    })
    // console.log(values);
    
    if (values.path != "" && values.appid == ""){
      wx.showModal({
        title: '提示',
        content: '请填写跳转路径和appid',
        showCancel: false,
        success: function (res) { }
      })
    } else if (values.path == "" && values.appid != ""){
      wx.showModal({
        title: '提示',
        content: '请填写跳转路径和appid',
        showCancel: false,
        success: function (res) { }
      })
    }else{
      if (values.lottery_time != "" && values.name != "" && values.product_name != "" && values.product_num != "" && that.data.data_times != 0 && imgArr.length != 0){
        wx.showLoading({
          title: '提交中...',
          mash: true
        })

        if (imgArr.length != 0) {
          var uploadImgCount = 0;
          for (let i = 0; i < imgArr.length; i++) {
            var sponsor = imgArr[i];
            wx.uploadFile({
              url: reqUrl + 'upload',
              method: 'POST',
              filePath: sponsor,
              formData: {
                path: 'sponsor'
              },
              name: 'file',
              header: {
                token: wx.getStorageSync('token'),
                'content-type': 'multipart/form-data'
              },
              success: res => {
                uploadImgCount++;
                var data = JSON.parse(res.data);
                console.log(data);
                var productInfo = that.data.productInfo;
                productInfo.push(data.msg)
                that.setData({
                  productInfo: productInfo
                })
                if (uploadImgCount == imgArr.length) {
                  // wx.hideLoading();

                  that.sponsor();
                }
              },
              fail: function (res) {
                wx.hideToast();
                wx.showModal({
                  title: res.data.msg,
                  content: '上传图片失败',
                  showCancel: false,
                  success: function (res) { }
                })
                that.setData({
                  missionBtn: true
                })
              },
              complete: function (res) { },
            })
          }
        } else {
          // wx.hideLoading();
          // that.sponsor();
        }
      }else{
        wx.showModal({
          title: '提示',
          content: '请完善商品信息',
          showCancel: false,
          success: function (res) { }
        })
      }
    }
    
      // console.log('form发生了submit事件，携带数据为：', e.detail.value);
  },
  // 上传信息
  sponsor:function(){
    var that = this;
    let dataValue = this.data.values;
    dataValue.imgArr = that.data.productInfo;
    wx.request({
      url: reqUrl + 'addSponsor',
      header: {
        token: wx.getStorageSync('token')
      },
      data: dataValue,
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        wx.hideLoading();
        if (res.data.error_code == 0){
          wx.showModal({
            title: '提交成功',
            content: '',
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
    imgArr = [];
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    this.setData({
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
  },
  
  changeDateTime1(e) {
    this.setData({
      data_times:1,
      dateTime1: e.detail.value
    });
  },

  changeDateTimeColumn1(e) {
    console.log(e.detail.value)
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
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