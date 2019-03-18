// pages/organ/productDetail/productDetail.js
const app = getApp()
import { fetch } from "../../../utils/axios.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:{},
    isMask:false,
     id:'',
    productBelong:'',
    organMess:{},
    userId:'',
  },

  //借款人向此产品申请
  apply() {
    if (this.data.userId) {
      wx.navigateTo({
        url: `/pages/loanApply/loanApply?id=${this.data.organMess.agencyId}&roleId=3`,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/passLogin/passLogin',
            })
          } else if (res.cancel) {

          }
        }
      })
    }
  },
  getDetail(id){
    fetch.get(`/product/selectProductById/${id}`).then(res=>{
       this.setData({
         product :res.data,
         productBelong: res.data.productBelong
       })
      this.getOrganDetail()
    })
  },
  getOrganDetail(){
    fetch.get(`/userAgency/selectUserAgencyById/${this.data.productBelong}`).then(res=>{
      console.log('aaa',res.data)
      this.setData({
        organMess:res.data
      })
     
    })
  },
  look(){
    this.setData({
      isMask : true
    })
  },
  cancel() {
    this.setData({
      isMask: false
    })
    this.getDetail(this.data.id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    
    this.getDetail(options.id)
    if (app.globalData.userInfo) {
      this.setData({
        userId: app.globalData.userInfo.id,
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