// pages/agent/mine/mine.js
const app = getApp()
var template = require('../../../../components/tabBar/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  /**跳转个人信息 */
  handlerClickPer() {
   wx.navigateTo({
     url:'/pages/organ/pages/personMessageOrgan/personMessageOrgan',
    })
  },
  handlerClickApply(){
    wx.navigateTo({
      url: '/pages/organ/pages/applyAcca/applyAcca',
    })
  },
  handlerClickProduct(){
    wx.navigateTo({
      url: '/pages/organ/pages/productCenter/productCenter',
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
    template.tabbar("tabBar", 3, this, app.globalData.userType)//0表示第一个tabbar
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