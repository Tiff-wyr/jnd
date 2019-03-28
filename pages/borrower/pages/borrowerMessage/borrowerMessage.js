// pages/agent/message/message.js
const app = getApp()
var template = require('../../../../components/tabBar/index.js');
let disp = require("../../../../utils/broadcast");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: '1',

    yourname: "",
    unReadSpot: false,
    arr: []
  },
  handlerTabClick(e) {
    let tab = e.currentTarget.dataset.id
    this.setData({
      tab
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    template.tabbar("tabBar", 2, this, app.globalData.userType)//0表示第一个tabbar
    let me = this;
    disp.on("em.xmpp.unreadspot", function (count) {
      me.setData({
        arr: me.getChatList(),
        unReadSpot: count > 0
      });
    });
  },


  getChatList() {
    var array = [];
    var member = wx.getStorageSync("member");
    var myName = wx.getStorageSync("myUsername");
    for (let i = 0; i < member.length; i++) {
      let newChatMsgs = wx.getStorageSync(member[i].name + myName) || [];
      let historyChatMsgs = wx.getStorageSync("rendered_" + member[i].name + myName) || [];
      let curChatMsgs = historyChatMsgs.concat(newChatMsgs);
      if (curChatMsgs.length) {
        let lastChatMsg = curChatMsgs[curChatMsgs.length - 1];
        lastChatMsg.unReadCount = newChatMsgs.length;
        if (lastChatMsg.unReadCount > 99) {
          lastChatMsg.unReadCount = "...";
        }
        array.push(lastChatMsg);
      }
    }
    console.log(array)
    return array;
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
    this.setData({
      arr: this.getChatList(),
      unReadSpot: getApp().globalData.unReadSpot,
    });
  },










  into_chatRoom: function (event) {
    console.log(event)
    var my = wx.getStorageSync("myUsername");
    var nameList = {
      myName: my,
      your: event.currentTarget.dataset.phone
    };
    wx.navigateTo({
      url: "/pages/chatroom/chatroom?username=" + JSON.stringify(nameList)
    });
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