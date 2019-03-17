// borrower/pages/agentDetail/agentDetail.js
const app = getApp()
import { fetch } from "../../../utils/axios.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    agent: {},

    victory: [],
    userId:'',
    optionId:'',
    isCollect:false
  },

  getDetail(id){
    fetch.get(`/userBroker/getUserBrokerById/${id}`).then(res=>{
      this.setData({
        agent :res.data
      })
      console.log('经纪人详情',res.data)
    })
  },

  getVictory(id){
    fetch.get(`/order/getTopSixOrderByBrokerId/${id}`).then(res => {
      this.setData({
        victory: res.data
      })
      console.log('经纪成功案例', res.data)
    })
  },
//收藏
  restoreClick(){
    let that=this
    wx.request({
      url: 'https://www.rjkf001.com/borrowerKeep/saveBorrowerKeep', 
      data: {
        borrowerId: this.data.userId,
        brokerId: this.data.optionId
      },
      method:'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        console.log('收藏',res.data)
        if (res.data.status === 200){
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            isCollect:true
          })
          that.collectPan(that.data.optionId)
        }
      }
    })
  },
  //取消收藏
  cancelColl(){
    let that=this
    fetch.get(`/borrowerKeep/removeBorrowerKeepById/${this.data.userId}/${this.data.optionId}`).then(res=>{
      console.log('cancel',res.data)
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
    })
  },
       //收藏判断
  collectPan(id){

    let that = this
    fetch.get(`/borrowerKeep/checkBorrowerKeepBroker/${this.data.userId}/${id}`).then(res=>{
        console.log('collect',res.data)
      if (res.data === 0){
        that.setData({
           isCollect:false
         })
        }else{
        that.setData({
          isCollect: true
        })
        }
    })
  },

  //借款人向此经纪人申请
  apply(){
     if(this.data.userId){
wx.navigateTo({
  url: `/pages/loanApply/loanApply?id=${this.data.optionId}&roleId=2`,
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
           } else if (res.cancel) {
          
           }
         }
       })
     }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     //经纪人详情页
     this.getDetail(options.id)
     //经纪人成功案例
     this.getVictory(options.id)
     this.setData({
       optionId:options.id
     })

 
    if (app.globalData.userInfo){
      this.setData({
        userId: app.globalData.userInfo.id,
      })

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