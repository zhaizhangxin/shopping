const { appId, appSecret,appKey } = require('ad_conf.js');
const md5 = require('ad_md5.min.js');

//初始化数据
let initData = {
  appkey: appKey,
  adslot: "",
  appid: appId,
  secret: appSecret,
  code: "",
  brand: "",
  model: "",
  system: "",
  city: "",
  province: "",
  country: "",
  gender: "",
}


//用户信息状态
let status = {
  uInfo: true,
  sInfo: true
} 


//请求方法
function req(url, data, method) {
  
  return new Promise((resolve, reject) => {
    // console.log(data)
    wx.request({
      // url: 'http://192.168.1.199/Api/' + url,
      url:'http://a.51dm61.cn/' + url,
      data: data,
      method: method,
      success: res => {

        if (res.statusCode != 200) {
          reject(res);//请求失败
          return false;
        }
        
        resolve(res.data);//请求成功
      },
      fail: function (error) {
        reject(error);//请求失败
      },
    })
    
  })
}

//登录
function login(){
  //login
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (res) {
        resolve(res)
      },
      fail: function (res) {
        console.error(res)
      },
    })
  })
}

//获取用户信息
function getU(){
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            success: res => {
              var msg = res.userInfo;

              // console.log(msg.city)
              initData.city = msg.city;
              initData.province = msg.province;
              initData.country = msg.country;
              initData.gender = msg.gender;
             

              resolve(res);
            },
            fail: function (res) {
              console.error(res)
            },
            complete: function (res) { },
          })
        }else{

          //用户信息请求成功，改变用户信息状态
          status.uInfo = false;
          
          resolve(res);
        }
      },
      fail: function fail(res) {
        console.error(res)
      }
    })
  }) 
}
  
//获取终端信息
function getS(){
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: res => {
        initData.brand = res.brand;
        initData.model = res.model;
        initData.system = res.system;
      
        //用户终端请求成功，改变状态
        status.sInfo = false;

        resolve();
      },
    })
  })
}

//格式化数据
function objKeySort(obj) {
  var newkey = Object.keys(obj).sort();
  var newStr = "JTIzQCV1RkYwMSV1ODA1QSV1NzBCOSV1NEU5MiV1NTJBOCV1RYwMUAlMjM=";
  for (var i = 0; i < newkey.length; i++) {
    newStr += (newkey[i] + obj[newkey[i]]);
  }
  // console.log(newStr)
  return md5.hexMD5(newStr);
}

//初始化广告位,adslot(广告位标识),type(区分不同广告位数据)
function init(adslot,type) {
 
  //定义变量
  var reqData = {}, code;
  
  return login().then(resolve => {
    
    //赋值code
    code = resolve.code;

    return getU();
  }).then(resolve => {  
    // if (status.sInfo) {
    return getS();
    // }
  }).then(resolve => {
    //广告位数据，浅拷贝 initData 公共数据
    reqData[type] = Object.assign({}, initData);

    //赋值广告位标识,code,sign
    reqData[type].adslot = adslot;
    reqData[type].code = code;
    reqData[type].sign = objKeySort(reqData[type]);
   
    return req('request', reqData[type], "GET")
  }).then(resolve =>{ 
    return resolve.data;
  },reject => {
    console.error(reject);
    return reject;
  })
}

//点击广告
function click(clickUrl){
  wx.request({
    url: clickUrl,
    method: 'GET',
    success: function(res) {},
    fail: function(res) {},
  })
}

//关闭广告
function close(e, that) {
  that.setData({
    [e]: false
  })
}



module.exports = { init,click,close}


