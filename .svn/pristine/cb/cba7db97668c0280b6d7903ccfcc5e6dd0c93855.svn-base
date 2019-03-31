// pages/login/passLogin/passLogin.js
import { fetch } from "../../../utils/axios.js"

let WebIM = require("../../../utils/WebIM")["default"];
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     phone:'',
     password:'',
    grant_type: "jnd"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  msgLogin(){
     wx.navigateTo({
       url: '/pages/login/msgLogin/msgLogin',
     })
  },
  freeRe(){
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },
  handlePhone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  handlePassword(e){
    this.setData({
      password: e.detail.value
    })
    console.log(this.data.password)
  },
  login(){
    if(this.data.phone && this.data.password){
      fetch.get(`/user/loginByPhoneAndPassword/${this.data.phone}/${this.data.password}/0`).then(res=>{

        console.log('login',res.data.data)
        if(res.data.status === 200){
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          })
          if(res.data.data.roleId === 1){
      
            app.globalData.userInfo = res.data.data
            app.globalData.userType='user'
            console.log(app.globalData.userInfo)

            wx.setStorage({
              key: 'myUsername',
              data: res.data.data.phone
            });
            getApp().conn.open({
              apiUrl: WebIM.config.apiURL,
              user: this.data.phone,
              pwd: '123456',
              grant_type: this.data.grant_type,
              appKey: WebIM.config.appkey
            });
            wx.reLaunch({
              url: '/pages/borrower/pages/borrowerMine/borrowerMine'
            })
         
          }
          if (res.data.data.roleId === 2){
           

            app.globalData.userInfo = res.data.data
            app.globalData.userType = 'agent'
            console.log('aaa', res.data.data)

            wx.setStorage({
              key: 'myUsername',
              data: res.data.data.phone
            });
            getApp().conn.open({
              apiUrl: WebIM.config.apiURL,
              user: this.data.phone,
              pwd: '123456',
              grant_type: this.data.grant_type,
              appKey: WebIM.config.appkey
            });
            wx.reLaunch({
              url: '/pages/agent/pages/mine/mine'
            })
          }

          if (res.data.data.roleId === 3) {

         
            app.globalData.userInfo = res.data.data
            app.globalData.userType = 'organ'
            console.log(res.data.data)

            wx.setStorage({
              key: 'myUsername',
              data: res.data.data.phone
            });
            getApp().conn.open({
              apiUrl: WebIM.config.apiURL,
              user: this.data.phone,
              pwd: '123456',
              grant_type: this.data.grant_type,
              appKey: WebIM.config.appkey
            });
            wx.reLaunch({
              url: '/pages/organ/pages/mine/mine'
            })
          }
        }else{
          wx.showToast({
            title: "账号或密码错误",
            icon: 'none'
          })
        }
      })


    }else{
      wx.showToast({
        title: '不能为空',
        icon:'none'
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