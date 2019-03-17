// pages/agent/message/message.js
const app = getApp()
var template = require('../../../../components/tabBar/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: '1',
    messData: [
      {
        name: '杨幂',
        content: '发生开发者佛靠金装广发华福呵呵计算机合作精神副局长对方时光飞逝真空干燥',
        time: '1:30',
        unReadCount: 3
      },
      {
        name: '杨幂',
        content: '发生开发者佛靠金装',
        time: '1:30',
        unReadCount: 3
      },
      {
        name: '杨幂',
        content: '发生开发者佛靠金装',
        time: '1:30',
        unReadCount: 3
      },
    ],
  },
  handlerTabClick(e) {
    let tab = e.currentTarget.dataset.id
    this.setData({
      tab
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    template.tabbar("tabBar", 2, this, app.globalData.userType)//0表示第一个tabbar
    if(!app.globalData.userInfo){
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    }
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