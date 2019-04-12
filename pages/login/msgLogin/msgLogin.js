// pages/login/passLogin/passLogin.js
import { fetch } from "../../../utils/axios.js"
let WebIM = require("../../../utils/WebIM")["default"];
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: '',
    textCode:'发送验证码',
    grant_type: "jnd",
    isFa:true,
    text:'60'
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
    let that =this
    if (that.data.phone){
      if ((!(/^[1][3456789]\d{9}$/).test(that.data.phone) || !(/^[1-9]\d*$/).test(that.data.phone) || that.data.phone.length !== 11)){
        wx.showToast({
          title: '手机号不符合规范',
          icon: 'none'
        })
      }else{
        fetch.get(`/user/selectPhone/${that.data.phone}`).then(res => {
        
          if (res.data.status === 500) {
            wx.showToast({
              title: '手机号未注册',
              icon: 'none'
            })

            that.setData({
              isFa:true,
              textCode: '重新发送'
            })

          } else {
            //发送验证码
            fetch.get(`/base/getLoginCode/${that.data.phone}`).then(res => {

              if (res.data.status === 200) {
                that.setData({
                  isFa:false,
                  text: '60'
                })
                let timer = setInterval(() => {
                 that.setData({
                   text:that.data.text-1
                 })
      
                  if (that.data.text < 0) {
                    clearInterval(timer)

                    that.setData({
                    isFa: true,
                    textCode:"发送验证码",
                    text:60
                    })
              
                  }
                }, 1000)

              } else {
                wx.showToast({
                  title: res.data.msg,
                })
                that.setData({
                  isFa:true,
                  textCode: '重新发送'
                })
              }
            })
          }
        })
      }


    }else{
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
    }


  },
// 登录
  login() {
    
    if (this.data.phone && this.data.code) {
      fetch.get(`/user/loginByPhoneAndCode/${this.data.phone}/${this.data.code}`).then(res=>{
   

        if(res.data.status === 200){
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          })

          if (res.data.data.roleId === 1) {



            app.globalData.userInfo = res.data.data
            app.globalData.userType = 'user'
         

            wx.setStorage({
              key: 'myUsername',
              data: res.data.data.name
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
          if (res.data.data.roleId === 2) {




            app.globalData.userInfo = res.data.data
            app.globalData.userType = 'agent'
         

            wx.setStorage({
              key: 'myUsername',
              data: res.data.data.name
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
         

            wx.setStorage({
              key: 'myUsername',
              data: res.data.data.name
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