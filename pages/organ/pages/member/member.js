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
    isKai: false,

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

  this.setData({
    isKai:true
  })
    this.setData({
      money: event.currentTarget.dataset.id
    })

    var that = this;
    wx.login({
      success: function (res) {
   
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
       

        if (that.data.money === 1) {
          that.xiaDan(openId);
        }else if(that.data.money === 2){
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
     
        var prepay_id = res.data.prepay_id
    

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
      
        var prepay_id = res.data.prepay_id
      

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
       
        var prepay_id = res.data.prepay_id
     

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
   
        that.requestPayment(res.data);
      }
    })
  },

  //付款
  requestPayment: function (obj) {
    this.setData({
      isKai: false
    })
    wx.requestPayment({
      timeStamp: obj.timeStamp,
      nonceStr: obj.nonceStr,
      package: obj.package,
      signType: obj.signType,
      paySign: obj.paySign,
      success: function (res) { 
        this.panMem()
        },
    
    })
  },


  handleLogin() {
    wx.navigateTo({
      url: '/pages/login/passLogin/passLogin',
    })
  },

  panMem() {
    let that = this
    fetch.get(`/userAgency/checkIsVip/${app.globalData.userInfo.phone}`).then(res => {
      if (res.data.status === 200) {
        that.setData({
          isMem: true
        })
      } else {
        that.setData({
          isMem: false
        })
      }
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
    wx.getSystemInfo({
      success(res) {
      
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
    that.panMem()
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
    this.panMem()
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