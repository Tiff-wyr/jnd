require("/sdk/libs/strophe");
let WebIM = require("/utils/WebIM")["default"];
let chatIm = require("chatIm");
let msgStorage = require("/comps/chat/msgstorage");
let msgType = require("/comps/chat/msgtype");
let disp = require("/utils/broadcast")

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
    // 初始化chat
    chatIm.onLaunch()
  },


  onHide: function () {
    console.log("onhide app")
    this.background = true;
    chatIm.conn.close()
  },
  onShow() {
    this.background = false;
    chatIm.conn.reopen();
    // this.userLogin()
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