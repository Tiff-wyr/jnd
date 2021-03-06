// pages/organ/productCenter/productCenter.js
const app = getApp()
import { fetch } from "../../../../utils/axios.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tableData:[],
    id: '',
    page:1,
    size:10,
    isMask:false
  },
  getData(){
    fetch.get(`/product/selectProductByAgency/${this.data.id}/${this.data.page}/${this.data.size}`).then(res=>{
      this.setData({
        tableData:res.data.list
      })
  
    })
  },
  look() {
    this.setData({
      isMask: true
    })
  },
  cancel() {
    this.setData({
      isMask: false
    })
    this.getData()
  },

  jumpPro(event){
    
    wx.navigateTo({
      url: `/pages/detail/productDetail/productDetail?id=${event.currentTarget.dataset.id}`,
    })

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