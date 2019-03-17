// borrower/pages/agentDetail/agentDetail.js
const app = getApp()
import { fetch } from "../../../utils/axios.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    organ: {},

    victory: [
      {      
         borName   : '',
         proAmount     :     '',
         proInterest  :    '',
         proName  :  '',
      },
    ],
    userId: '',
    optionId: '',
    isCollect: false

  },

  getDetail(id){
    fetch.get(`/userAgency/selectUserAgencyById/${id}`).then(res=>{
      this.setData({
        organ :res.data
      })

      console.log('机构详情',res.data)
    })
  },
  getVictory(id){
    fetch.get(`/orderAgency/getAgencySuccessOrder/${id}`).then(res=>{
      this.setData({
        victory : res.data
      })

      console.log('机构成功案例', res.data)
    })
  },


  //收藏
  restoreClick() {
    let that = this
    wx.request({
      url: 'https://www.rjkf001.com/borAgency/addBorAgency',
      data: {
        borId: this.data.userId,
        agencyId: this.data.optionId
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        console.log('收藏', res.data)
        if (res.data.status === 200) {
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            isCollect: true
          })
          that.collectPan(that.data.optionId)
        }
      }
    })
  },
  //取消收藏
  cancelColl() {
    let that = this
    wx.request({
      url: 'https://www.rjkf001.com/borAgency/deleteBorAgency',
      data: {
        borId: this.data.userId,
        agencyId: this.data.optionId
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        console.log('收藏', res.data)
        if (res.data.status === 200) {
          wx.showToast({
            title: '取消成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            isCollect: false
          })
          that.collectPan(that.data.optionId)
        }
      }
    })
  },
  //收藏判断
  collectPan() {
    let that = this
    wx.request({
      url: 'https://www.rjkf001.com/borAgency/selectBorAgency',
      data: {
        borId: this.data.userId,
        agencyId: this.data.optionId
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        console.log('收藏', res.data)
        if (res.data === 0) {
          that.setData({
            isCollect: false
          })
        }else{
          that.setData({
            isCollect: true
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获得 机构详情信息
    this.getDetail(options.id)
    console.log(options.id)
    //获得 机构成功案例
    this.getVictory(options.id)
    this.setData({
      optionId: options.id
    })

    if (app.globalData.userInfo) {
      this.setData({
        userId: app.globalData.userInfo.id
      })
    //收藏判断
      this.collectPan(options.id)
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
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})