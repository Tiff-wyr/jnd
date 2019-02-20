// borrower/pages/agentDetail/agentDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      agent:{
        name: '魏亚如',
        phone: 18438610510,
        src: '图片',
        address: '北京',
        job:'资深顾问'
      },
    scopes:[
      {
        id:1,
        scope:'车贷'
      },
      {
        id: 2,
        scope: '车贷'
      },
      {
        id: 3,
        scope: '车贷'
      },
    ],
    victory:[
      {
        name:'刘女士房贷',
        rate:'月利率：0.56%',
        money:'金额：10万'
      },
      {
        name: '刘女士房贷',
        rate: '月利率：0.56%',
        money: '金额：10万'
      },
      {
        name: '刘女士房贷',
        rate: '月利率：0.56%',
        money: '金额：10万'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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