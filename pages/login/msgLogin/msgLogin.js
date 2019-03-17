// pages/login/passLogin/passLogin.js
import { fetch } from "../../../utils/axios.js"
const app = getApp()
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
    console.log('phoe',this.data.phone)
  },
  handleCode(e) {
    this.setData({
      code: e.detail.value
    })
    console.log('code', this.data.code)
  },
  //发送验证码
  sendCode(){
    if (this.data.phone){
      fetch.get(`/user/selectPhone/${this.data.phone}`).then(res=>{
        console.log('checkphone',res)
        if(res.data.status === 500){
          wx.showToast({
            title: '手机号未注册',
            icon: 'none'
          })

          this.setData({
            textCode: '重新发送'
          })
    
        }else{
          //发送验证码
          fetch.get(`/base/getLoginCode/${this.data.phone}`).then(res=>{
            console.log('fs',res.data)
            if(res.data.status === 200){
              this.setData({
                textCode: '已发送'
              })
            }else{
              this.setData({
                textCode: '重新发送'
              })
            }
          })
        }
      })
    }else{
      wx.showToast({
        title: '不能为空',
        icon: 'none'
      })
    }


  },
// 登录
  login() {
    
    if (this.data.phone && this.data.code) {
      fetch.get(`/user/loginByPhoneAndCode/${this.data.phone}/${this.data.code}`).then(res=>{
        console.log('短信登录', res.data)

        if(res.data.status === 200){
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          })

          if (res.data.data.roleId === 1) {

            app.globalData.userInfo = res.data.data
            app.globalData.userType = 'user'
            console.log(app.globalData.userInfo)
            wx.reLaunch({
              url: '/pages/borrower/pages/borrowerMine/borrowerMine'
            })

          }
          if (res.data.data.roleId === 2) {
            app.globalData.userInfo = res.data.data
            app.globalData.userType = 'agent'
            console.log('aaa', res.data.data)
            wx.reLaunch({
              url: '/pages/agent/pages/mine/mine'
            })
          }
          if (res.data.data.roleId === 3) {
            app.globalData.userInfo = res.data.data
            app.globalData.userType = 'organ'
            console.log(res.data.data)
            wx.reLaunch({
              url: '/pages/organ/pages/mine/mine'
            })
          }
       

        }else{
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          })
        }
      })

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
    wx.request({
      url: 'https://www.rjkf001.com/session/getSessionId',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.setStorageSync('sessionId', 'JSESSIONID=' + res.data)

      }
    })
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