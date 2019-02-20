// borrower/pages/loans/loans.js
const app = getApp()
var template = require('../../../../components/tabBar/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: '1',
    index: 0,
    array: ['北京', '天津', '上海', '深圳', '广州'],
    agentData:[
      {

      }
    ],
    organData:[
      {
      }
    ],
    productData:[{
      
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    template.tabbar("tabBar", 1, this, app.globalData.userType)//0表示第一个tabbar
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
 * tab 选项卡点击事件
 */
  handlerTabClick(e) {
    let tab = e.currentTarget.dataset.id
    this.setData({
      tab
    })
  },
  handleAgent(){
    wx.navigateTo({
      url: '/pages/borrower/pages/agentDetail/agentDetail',
    })
  },
  handleOrgan() {
    wx.navigateTo({
      url: '/pages/borrower/pages/organDetail/organDetail',
    })
  },
  handlePro() {
    wx.navigateTo({
      url: '/pages/borrower/pages/productDetail/productDetail',
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