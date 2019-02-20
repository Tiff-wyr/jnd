// pages/agent/member/member.js
const app = getApp()
var template = require('../../../../components/tabBar/index.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    vip:[
      {
        money:'1元',
        time:'1次',
      },
      {
        money: '20元',
        time: '1个月',
      },
          
      {
        money: '200元',
        time: '1年',
      }
    ],
    src1:'/static/icon/1.png',
    src2: '/static/icon/2.png',
    src3: '/static/icon/3.png',
    src4: '/static/icon/4.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    template.tabbar("tabBar", 1, this, app.globalData.userType)//0表示第一个tabbar
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