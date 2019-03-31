let disp = require("../../utils/broadcast.js");

Page({
  data: {
    username: {
      your: "",
    },
  },

  // options = 系统传入的 url 参数
  onLoad(options) {
    let username = JSON.parse(options.username);
    this.setData({ username: username });
    wx.setNavigationBarTitle({
      title: '消息'
    });
  },

  onUnload() {
    disp.fire("em.chatroom.leave");
  },

});
