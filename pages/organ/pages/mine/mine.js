// pages/agent/mine/mine.js
const app = getApp()
var template = require('../../../../components/tabBar/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personData: {}
  },
  logout() {
    let that=this
    wx.showModal({
      title: '提示',
      content: '确认退出登录',
      success(res) {
        if (res.confirm) {
          wx.setStorage({
            key: 'loginPhone',
            data: '',
          })
          wx.setStorage({
            key: 'loginPassword',
            data: '',
          })
          app.globalData.userInfo = {}
          that.setData({
            personData: app.globalData.userInfo
          })
          app.globalData.userType = 'user'
          wx.redirectTo({
            url: '/pages/borrower/pages/loanApply/loanApply',
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  /**跳转个人信息 */
  handlerClickPer() {

    if (app.globalData.userInfo.name) {
      wx.navigateTo({
        url: '/pages/organ/pages/personMessageOrgan/personMessageOrgan',
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
          }
        }
      })
    }

  },
  handlerClickApply(){

    if (app.globalData.userInfo.name) {
      wx.navigateTo({
        url: '/pages/organ/pages/applyAcca/applyAcca',
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
          }
        }
      })
    }
  },
  handlerClickProduct(){
    if (app.globalData.userInfo.name) {
      wx.navigateTo({
        url: '/pages/organ/pages/productCenter/productCenter',
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
          }
        }
      })
    }
  },

  handleLogin() {
    wx.navigateTo({
      url: '/pages/login/passLogin/passLogin',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    template.tabbar("tabBar", 3, this, app.globalData.userType)//0表示第一个tabbar
    this.setData({
      personData: app.globalData.userInfo
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