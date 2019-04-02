// pages/borrower/pages/borrowerMine/borrowerMine.js
const app = getApp()
var template = require('../../../../components/tabBar/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personData:{}
  },
  logout(){
    let that =this
    wx.showModal({
      title: '提示',
      content: '确认退出登录',
      success(res) {
        if (res.confirm) {
          app.globalData.userInfo = {}
          that.setData({
            personData: app.globalData.userInfo
          })

          wx.redirectTo({
            url: '/pages/login/passLogin/passLogin',
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  handlerClickPer(){

    if (app.globalData.userInfo.name) {
      wx.navigateTo({
        url: '/pages/borrower/pages/borrowerPerson/borrowerPerson',
      })
    }else{
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
        url: '/pages/borrower/pages/applyAccord/applyAccord',
      })
    }else{
 
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
  handlerClickCollect(){
    if (app.globalData.userInfo.name) {
      wx.navigateTo({
        url: '/pages/borrower/pages/myCollect/myCollect',
      })
    }else{
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
  handleLogin(){
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
      personData : app.globalData.userInfo
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