let disp = require("../../utils/broadcast.js");

Page({
  data: {
    username: {
      your: "",
    },
  },

  // options = 系统传入的 url 参数
  onLoad(options) {
    console.log('aaaa', options)
    let username = {
      myName: options.myName,
      your: options.your
    }

    // let username = JSON.parse(options.username);
   
    let userType = options.usertype
    wx.setStorageSync("userType", userType);
    wx.setStorageSync("toUserID", options.yourName);
    this.setData({ username: username });
    wx.setNavigationBarTitle({
      title: "消息"
    });
  },

  onUnload() {
    disp.fire("em.chatroom.leave");
  },

});
