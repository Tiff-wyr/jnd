// pages/agent/borrower/borrower.js
const app = getApp()
var template = require('../../../../components/tabBar/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tableData:[
      {
      
        name:'魏亚如',
        address:'北京',
        amount:'20万',
      },
      {

        name: '魏亚如',
        address: '北京',
        amount: '20万',
      },
      {

        name: '魏亚如',
        address: '北京',
        amount: '20万',
      },

    ],
    index: 0,
    array: ['北京', '天津', '上海', '深圳', '广州']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    template.tabbar("tabBar", 0, this, app.globalData.userType)//0表示第一个tabbar
  },
  /**
  * 选择框change事件
  */
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
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