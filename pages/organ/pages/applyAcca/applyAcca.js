// borrower/pages/applyAccord/applyAccord.js
const app = getApp()
import {fetch} from '../../../../utils/axios.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tableData: [],
    id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: app.globalData.userInfo.id
    })
    this.getData()
  },

  //申请记录
  getData() {
    fetch.get(`/orderAgency/getOrderByAgency/${this.data.id}/1/100`).then(res=>{
      this.setData({
        tableData:res.data.data.list
      })
  
    })
  },


  userDetai(event){
    console.log('sss', event.currentTarget.dataset.id)
    wx.navigateTo({
      url: `/pages/detail/borrowerDetail/borrowerDetail?id=${event.currentTarget.dataset.id}`,
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