// borrower/pages/applyAccord/applyAccord.js
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

  },
  getData(){
    fetch.get(`/orderAll/getOrderByBorrowerId/${this.data.id}/${this.data.page}/${this.data.size}`).then(res=>{
      this.setData({
        tableData:res.data.data.list
      })
      console.log('借款人申请记录id', this.data.id)
      console.log('借款人申请记录',res.data.data.list)
    })

  },

  jumpDetail(event){
    console.log(event)
    console.log('agent', event.currentTarget.dataset.id)
    console.log('agent', event.currentTarget.dataset.roleid)
    if (event.currentTarget.dataset.roleid === 2){
      // 经纪人详情
      wx.navigateTo({
        url: `/pages/detail/agentDetail/agentDetail?id=${event.currentTarget.dataset.id}`,
      })
    }
    if (event.currentTarget.dataset.roleid === 3) {
      // 机构详情
      wx.navigateTo({
        url: `/pages/detail/organDetail/organDetail?id=${event.currentTarget.dataset.id}`,
      })
    }
    if (event.currentTarget.dataset.roleid === 4) {
      // 产品详情
      wx.navigateTo({
        url: `/pages/detail/proDetail/productDetail?id=${event.currentTarget.dataset.id}`,
      })
    }
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