// pages/login/passLogin/passLogin.js
import { fetch } from "../../../utils/axios.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: '',
    textCode:'发送验证码'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  msgLogin() {
    wx.navigateTo({
      url: '/pages/login/passLogin/passLogin',
    })
  },
  freeRe() {
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },

  handlePhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  handleCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //发送验证码
  sendCode(){
    if (this.phone){
       fetch.get()
    }else{
      wx.showToast({
        title: '不能为空',
        icon: 'none'
      })
    }
     //先判断 手机号是否存在
     this.setData({
       textCode:'已发送'
     })

  },
// 登录
  login() {
    if (this.data.phone && this.data.code) {
          

    } else {
      wx.showToast({
        title: '不能为空',
        icon: 'none'
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