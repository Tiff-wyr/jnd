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
    page:1,
    size:10
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


  

  getData() {
    fetch.get(`/orderAll/getOrderByAgency/${this.data.id}/1/10`).then(res=>{
      
      this.setData({
        tableData:res.data.data.list
      })
  
    })
  },


  userDetai(event){

    wx.navigateTo({
      url: `/pages/detail/borrowerDetail/borrowerDetail?id=${event.currentTarget.dataset.id}&accord=1`,
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
    wx.showNavigationBarLoading();

    fetch.get(`/orderAll/getOrderByAgency/${this.data.id}/1/10`).then(res => {
      this.setData({
        tableData: res.data.data.list
      })

      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '玩命加载中',
    })
    this.setData({
      page: this.data.page + 1
    })



    fetch.get(`/orderAll/getOrderByAgency/${this.data.id}/${this.data.page}/${this.data.size}`).then(res => {
      let newArr = [...this.data.tableData, ...res.data.data.list]

      this.setData({
        tableData: newArr
      })
      
      wx.hideLoading();
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})