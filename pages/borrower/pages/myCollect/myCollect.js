// borrower/pages/myCollect/myCollect.js
const app = getApp()
import { fetch } from "../../../../utils/axios.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    tab:'1',
    agentpage:1,
    agentsize:10,
    organpage: 1,
   organsize: 10,
    propage: 1,
    prosize: 10,
    agentData:[],
    organData: [],
    proData: [],
  },
  getAgentData(){
    fetch.get(`/borrowerKeep/showPage/${this.data.id}?pn=${this.data.agentpage}&page=${this.data.agentsize}`).then(res=>{
      console.log('aaa',res.data.rows)
      this.setData({
        agentData : res.data.rows
      })
   
    })
  },
  getOrganData(){
    fetch.get(`/borAgency/selectByBorId/${this.data.id}/${this.data.organpage}/${this.data.organsize}`).then(res=>{
      console.log('JI', res)
      this.setData({
        organData: res.data.list
      })
    })
  },

  getProData(){
    fetch.post(`/borpro/selectByBorId/${this.data.id}/${this.data.propage}/${this.data.prosize}`).then(res=>{
      console.log('cp', res)
      this.setData({
        proData: res.data.list
      })

    })
  },
  agentDetail(event){
    console.log('agent', event.currentTarget.dataset.id)
   wx.navigateTo({
     url: `/pages/detail/agentDetail/agentDetail?id=${event.currentTarget.dataset.id}`,
   })
  },
  organDetail(event){
    console.log('sss', event.currentTarget.dataset.id)
    wx.navigateTo({
      url: `/pages/detail/organDetail/organDetail?id=${event.currentTarget.dataset.id}`,
    })
  },
  proDetail(event) {
    console.log('sss', event.currentTarget.dataset.id)
    wx.navigateTo({
      url: `/pages/detail/proDetail/productDetail?id=${event.currentTarget.dataset.id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: app.globalData.userInfo.id
    })
    this.getAgentData()
    this.getOrganData()
    this.getProData()


  },
  handlerTabClick(e) {
    let tab = e.currentTarget.dataset.id
    this.setData({
      tab
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
    this.getAgentData()
    this.getOrganData()
    this.getProData()

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