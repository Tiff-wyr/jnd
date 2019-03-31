
require("/sdk/libs/strophe");
let WebIM = require("/utils/WebIM")["default"];
let msgStorage = require("/comps/chat/msgstorage");
let msgType = require("/comps/chat/msgtype");
let disp = require("/utils/broadcast");

function ack(receiveMsg) {
  // 处理未读消息回执
  var bodyId = receiveMsg.id;         // 需要发送已读回执的消息id
  var ackMsg = new WebIM.message("read", WebIM.conn.getUniqueId());
  ackMsg.set({
    id: bodyId,
    to: receiveMsg.from
  });
  WebIM.conn.send(ackMsg.body);
}

function onMessageError(err) {
  if (err.type === "error") {
    wx.showToast({
      title: err.errorText
    });
    return false;
  }
  return true;
}

function getCurrentRoute() {
  let pages = getCurrentPages();
  let currentPage = pages[pages.length - 1];
  return currentPage.route;
}

function calcUnReadSpot() {
  let myName = wx.getStorageSync("myUsername");
  let members = wx.getStorageSync("member") || [];
  let count = members.reduce(function (result, curMember, idx) {
    let chatMsgs = wx.getStorageSync(curMember.name + myName) || [];
    return result + chatMsgs.length;
  }, 0);
  getApp().globalData.unReadSpot = count > 0;
  disp.fire("em.xmpp.unreadspot", count);
}









//app.js
App({
  onLaunch: function () {
    var me = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // disp.on("em.main.ready", function () {
    //   calcUnReadSpot();
    // });
    // disp.on("em.chatroom.leave", function () {
    //   calcUnReadSpot();
    // });
    // disp.on("em.chat.session.remove", function () {
    //   calcUnReadSpot();
    // });

    WebIM.conn.listen({
      onOpened(message) {
        console.log("onOpened", message);
        WebIM.conn.setPresence();
        if (getCurrentRoute() == "pages/login/passLogin/passLogin") {
          me.onLoginSuccess(wx.getStorageSync("myUsername"));
        }
      },

      onClosed() {
        me.conn.closed = true;
      },

      onRoster(message) {
        console.log("onRoster", message);
        // let pages = getCurrentPages();
        // if(pages[0]){
        // 	pages[0].onShow();
        // }
      },

      onAudioMessage(message) {
        console.log("onAudioMessage", message);
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.AUDIO);
          }
          //calcUnReadSpot();
          ack(message);
        }
      },

      onCmdMessage(message) {
        console.log("onCmdMessage", message);
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.CMD);
          }
          calcUnReadSpot();
          ack(message);
        }
      },

      onTextMessage(message) {
        console.log("onTextMessage", message);
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.TEXT);
          }
          calcUnReadSpot();
          ack(message);
        }
      },

      onEmojiMessage(message) {
        console.log("onEmojiMessage", message);
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.EMOJI);
          }
          calcUnReadSpot();
          ack(message);
        }
      },

      onPictureMessage(message) {
        console.log("onPictureMessage", message);
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.IMAGE);
          }
          calcUnReadSpot();
          ack(message);
        }
      },

      // 各种异常
      onError(error) {
        // 16: server-side close the websocket connection
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {
          if (WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax) {
            return;
          }
          wx.showToast({
            title: "server-side close the websocket connection",
            duration: 1000
          });
          wx.redirectTo({
            url: "/pages/login/passLogin/passLogin"
          });
          return;
        }
        // 8: offline by multi login
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
          wx.showToast({
            title: "offline by multi login",
            duration: 1000
          });
          wx.redirectTo({
            url: "/pages/login/passLogin/passLogin"
          });
        }
        // if (error.type == WebIM.statusCode.WEBIM_CONNCTION_OPEN_ERROR) {
        //   wx.showModal({
        //     title: "用户名或密码错误",
        //     confirmText: "OK",
        //     showCancel: false
        //   });
        // }
      },

    });
  },


  globalData: {

    unReadSpot: false,
    // userType: 'organ',
    // userInfo: {
    //   name:'机构80',
    //   image:'http://img.softtrade.top/FkOVrpLuS8-9SKSESdKRsqyzTt4X',
    //   id:80,
    //   phone:18000000041
    // },
    userType: 'user',
    userInfo: {
      name: '',
      image: '',
      id: '',
      phone: '',
      roleId:'',
      vip:''
    },


  
    // userType: 'user',
    // userInfo: {
    //   name: '魏亚茹',
    //   image: 'http://img.softtrade.top/FkOVrpLuS8-9SKSESdKRsqyzTt4X',
    //   id: 72,
    //   phone:18438610510
    // }
  },

  conn: {
    closed: false,
    curOpenOpt: {},
    open(opt) {
      this.curOpenOpt = opt;
      WebIM.conn.open(opt);
      this.closed = false;
    },
    reopen() {
      if (this.closed) {
        this.open(this.curOpenOpt);
      }
    }
  },

  onShow() {
    this.conn.reopen();
  },

  onLoginSuccess: function (myName) {
    wx.showToast({
      title: "登录成功",
      icon: "success",
      duration: 1000
    });
    // setTimeout(function () {
    //   wx.redirectTo({
    //     url: "../main/main?myName=" + myName
    //     // url: "../chat/chat"
    //   });
    // }, 1000);
  },

  getUserInfo(cb) {
    var me = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo);
    }
    else {
      // 调用登录接口
      wx.login({
        success() {
          wx.getUserInfo({
            success(res) {
              me.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(me.globalData.userInfo);
            }
          });
        }
      });
    }
  },


})