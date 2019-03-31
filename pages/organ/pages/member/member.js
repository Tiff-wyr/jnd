// pages/agent/member/member.js
const app = getApp()
var template = require('../../../../components/tabBar/index.js');
import { fetch } from "../../../../utils/axios.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vip:[
      {
        money:'1元',
        time:'1次',
        fee:1,
      },
      {
        money: '20元',
        time: '1个月',
        fee: 2,
      },
          
      {
        money: '200元',
        time: '1年',
        fee: 3,
      }
    ],
    src1:'/static/icon/1.png',
    src2: '/static/icon/2.png',
    src3: '/static/icon/3.png',
    src4: '/static/icon/4.png',

    personData: {},
    isShow:true,
    money:'',
    isMem:false
  },

  pay_money(event) {

    console.log('钱', event.currentTarget.dataset.id)
    this.setData({
      money: event.currentTarget.dataset.id
    })

    var that = this;
    wx.login({
      success: function (res) {
        console.log("获得登录code\t\t" + res.code)
        that.getOpenId(res.code);
      }
    });
  },

  //获取openid
  getOpenId: function (code) {
    var that = this;
    wx.request({
      url: "https://www.rjkf001.com/wxPay/getOpenId",
      // url: "http://localhost:8082/wxPay/getOpenId",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { "code": code },
      success: function (res) {
        var openId = res.data.openid;
        console.log("获得openId\t\t" + openId);

        if (that.data.money === 1) {
          that.xiaDan(openId);
        }else if(that.data.money === 20){
          that.xiaDanS(openId);
        }else{
          that.xiaDanT(openId);
        }
      
      }
    })
  },

  //下单
  xiaDan: function (openId) {
    var that = this;
    wx.request({
      url: "https://www.rjkf001.com/wxPay/xiaDan",

      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        "openId": openId,
         "phone": app.globalData.userInfo.phone,
         "total_fee": 1,
      },
      success: function (res) {
        console.log('成功',res)
        var prepay_id = res.data.prepay_id
        console.log("统一下单返回 prepay_id-->\t\t" + prepay_id);

        that.sign(prepay_id);
      }
    })


  },
  //下单
  xiaDanS: function (openId) {
    var that = this;
    wx.request({
      url: "https://www.rjkf001.com/wxPay/xiaDan",

      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        "openId": openId,
        "phone": app.globalData.userInfo.phone,
        "total_fee": 2,
      },
      success: function (res) {
        console.log('成功', res)
        var prepay_id = res.data.prepay_id
        console.log("统一下单返回 prepay_id-->\t\t" + prepay_id);

        that.sign(prepay_id);
      }
    })


  },
  //下单
  xiaDanT: function (openId) {
    var that = this;
    wx.request({
      url: "https://www.rjkf001.com/wxPay/xiaDan",

      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        "openId": openId,
        "phone": app.globalData.userInfo.phone,
        "total_fee": 3,
      },
      success: function (res) {
        console.log('成功', res)
        var prepay_id = res.data.prepay_id
        console.log("统一下单返回 prepay_id-->\t\t" + prepay_id);

        that.sign(prepay_id);
      }
    })


  },

  //签名
  sign: function (prepay_id) {
    var that = this;
    wx.request({
      url: "https://www.rjkf001.com/wxPay/sign",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { "repay_id": prepay_id },
      success: function (res) {
        console.log("签名方法中repay_id\t\t" + res.data);
        that.requestPayment(res.data);
      }
    })
  },

  //付款
  requestPayment: function (obj) {
    wx.requestPayment({
      timeStamp: obj.timeStamp,
      nonceStr: obj.nonceStr,
      package: obj.package,
      signType: obj.signType,
      paySign: obj.paySign,
      success: function (res) { console.log("success") },
      fail: function (res) { console.log("fail") },
      complete: function (res) { console.log("complete") },
    })
  },


  handleLogin() {
    wx.navigateTo({
      url: '/pages/login/passLogin/passLogin',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    template.tabbar("tabBar", 1, this, app.globalData.userType)//0表示第一个tabbar
   let that = this
    that.setData({
      personData: app.globalData.userInfo
    })

    if (app.globalData.userInfo.vip === 1) {
      that.setData({
        isMem: true
      })
    } else {
      that.setData({
        isMem: false
      })
    }

    wx.getSystemInfo({
      success(res) {
        console.log('手机类型',res.platform)
        if(res.platform === 'android'){
          that.setData({
            isShow: true
             })
        }else{
          that.setData({
            isShow: false
          })
        }
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
  
  }
})