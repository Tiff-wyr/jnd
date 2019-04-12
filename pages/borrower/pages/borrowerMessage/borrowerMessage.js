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
    arr: [],
    isLogin:false
  },
  login() {
    wx.navigateTo({
      url: '/pages/login/passLogin/passLogin',
    })
  },

  onLoad() {
    template.tabbar("tabBar", 2, this, app.globalData.userType)
    if (app.globalData.userInfo.name) {
      let me = this;
      disp.on("em.xmpp.unreadspot", function (count) {
        me.setData({
          arr: me.getChatList(),
          unReadSpot: count > 0
        });

      });
    }else{
      this.setData({
        isLogin:false
      })
    }
   
  },


  getChatList() {

    var array = [];
    var time = WebIM.time();
    var member = wx.getStorageSync("member");
    var myName = wx.getStorageSync("myUsername");
    function timeDiff(faultDate, completeTime) {
      var faultDate = faultDate.replace(/-/g, '/');
      var completeTime = completeTime.replace(/-/g, '/');
      var stime = Date.parse(new Date(faultDate));
      var etime = Date.parse(new Date(completeTime));
      var usedTime = parseInt(etime - stime);  //两个时间戳相差的毫秒数
      var time = usedTime / 1000
      return time;
    }
    for (let i = 0; i < member.length; i++) {
      console.log()
      let newChatMsgs = wx.getStorageSync(member[i].name + myName) || [];
      let historyChatMsgs = wx.getStorageSync("rendered_" + member[i].name + myName) || [];
      let curChatMsgs = historyChatMsgs.concat(newChatMsgs);
      if (curChatMsgs.length) {
        let lastChatMsg = curChatMsgs[curChatMsgs.length - 1];
        lastChatMsg.unReadCount = newChatMsgs.length;
        if (lastChatMsg.unReadCount > 10) {
          lastChatMsg.unReadCount = "...";
        }
        let lastMsm = lastChatMsg.time
        lastChatMsg.nickname = member[i].nickname;
        if (parseInt(timeDiff(lastMsm, time)) <= 3600) {
          lastChatMsg.showTime = "刚刚"
        }
        if (timeDiff(lastMsm, time) > 3600 && timeDiff(lastMsm, time) <= 7200) {
          lastChatMsg.showTime = "1小时前"
        }
        if (timeDiff(lastMsm, time) > 7200) {
          lastChatMsg.showTime = parseInt(timeDiff(lastMsm, time) / (3600)) + "小时前"
        }
        if (timeDiff(lastMsm, time) > 24 * 3600) {
          lastChatMsg.showTime = "1天前"
        }
        if (timeDiff(lastMsm, time) > 24 * 3600 * 7) {
          lastChatMsg.showTime = getNowFormatDate(lastMsm)
        }


        array.push(lastChatMsg);

      }

    }
    var objectArraySort = function (keyName) {
      return function (objectN, objectM) {
        var valueN = objectN[keyName]
        var valueM = objectM[keyName]
        if (valueN < valueM) return 1
        else if (valueN > valueM) return -1
        else return 0
      }
    }

    console.log('arr', array)
    return array.sort(objectArraySort('time'));
  },
  onShow: function () {
    if (app.globalData.userInfo.name) {
      this.setData({
        isLogin: true,
        arr: this.getChatList(),
        unReadSpot: getApp().globalData.unReadSpot,
      });
    } else {
      this.setData({
        isLogin: false
      })
    }



  },
  into_chatRoom: function (event) {
    console.log(event)
    let my = wx.getStorageSync("myUsername");
    let your = event.target.dataset.phone
    let yourName = event.target.dataset.name
    let nameList = {
      myName: my,
      your: event.currentTarget.dataset.phone,
      yourName: event.target.dataset.name
    };
    wx.navigateTo({
      url: "/pages/chatroom/chatroom?myName=" + nameList.myName + "&your=" + nameList.your + "&yourName=" + nameList.yourName + "&usertype=B"
    });
  },
});
