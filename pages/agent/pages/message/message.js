// // pages/agent/message/message.js
const app = getApp()
var template = require('../../../../components/tabBar/index.js');
let disp = require("../../../../utils/broadcast");
let { getNowFormatDate } = require("../../../../utils/common.js")
let WebIM = require("../../../../utils/WebIM.js")["default"];
Page({
  data: {
    yourname: "",
    unReadSpot: false,
    arr: []
  },

  onLoad() {
    template.tabbar("tabBar", 2, this, app.globalData.userType)
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
      your: event.currentTarget.dataset.username
    };
    wx.navigateTo({
      url: "/pages/chatroom/chatroom?username=" + JSON.stringify(nameList)
    });
  },
});
