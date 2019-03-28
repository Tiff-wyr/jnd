require("sdk/libs/strophe");
let WebIM = require("utils/WebIM")["default"];
let msgStorage = require("comps/chat/msgstorage");
let msgType = require("comps/chat/msgtype");
let disp = require("utils/broadcast");
let {
    produce
} = require("utils/immer");
var onfire = require('utils/event')
var socketOpen = false;
var reconnect;

var heartCheck
var teTIME = null;
var lockReconnect = false; //避免重复连接
var tt;

wx.clientReceiptt = function (data) {
    console.log("已读回执")
    onfire.fire('clientReceiptt');

};
wx.serverReceiptt = function (data) {
    //onfire.un('serverReceiptt');
    console.log("服务器已发送")
    onfire.fire('serverReceiptt');

};
let chatIm = {
    grant_type: "password",
    CHAT_STATUS_SEND: 0,
    CHAT_STATUS_RECEIVED: 1,
    CHAT_STATUS_DILEVERD: 2,
    CHAT_STATUS_READED: 3,
};

function getCurrentRoute() {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    return currentPage.route;
}
// 定义socket连接对象
chatIm.conn = {
    closed: false,
    curOpenOpt: {},

    loginOpen(user) {
        console.log(user)
        var uid = user.uid;
        var pwd = user.uid;
        // 保存自己的用户名key
        wx.setStorageSync("myUsername", uid);
        //存储到变量
        chatIm.uid = uid;
        let chatData = {}
        let token = wx.getStorageSync("IMtoken") || ""

        if (token) {
            chatData = {
                apiUrl: WebIM.config.apiURL,
                appKey: WebIM.config.appkey,
                accessToken: token
            };
        } else {
            chatData = {
                apiUrl: WebIM.config.apiURL,
                user: uid,
                pwd: pwd,
                grant_type: this.grant_type,
                appKey: WebIM.config.appkey,
                success: function (obj) {
                    token = obj.access_token;
                    wx.setStorageSync("IMtoken", token)
                }
            };
        }
        wx.setStorageSync("chatData", chatData)
        // chat登录
        chatIm.conn.open();
    },
    open() {
        const chatData = wx.getStorageSync("chatData");
        WebIM.conn.open(chatData);
        this.closed = false;
    },
    close() {
        this.closed = true;
        // 关闭环信连接
        WebIM.conn.close();
        // 关闭自己服务器的连接
        wx.closeSocket(null, null, function () {
            console("socket close ok");
        });      
        if (heartCheck) {
            heartCheck.clear();
        }
    },
    reopen() {
        console.log(this.closed)
        if (this.closed) {
            this.open(this.curOpenOpt);
        }
    }
};

// 错误处理
chatIm.onMessageError = function (err) {
    if (err.type === "error") {
        wx.showToast({
            title: err.errorText
        });
        return false;
    }
    return true;
};
// 消息回执
chatIm.ack = function (receiveMsg) {
    // 需要发送已读回执的消息id
    var bodyId = receiveMsg.id;
    var ackMsg = new WebIM.message("read", WebIM.conn.getUniqueId());
    ackMsg.set({
        id: bodyId,
        to: receiveMsg.from
    });
    WebIM.conn.send(ackMsg.body);
};
// 消息统计数据及提示的自动计算
chatIm.calcUnReadSpot = function () {
    let myName = wx.getStorageSync("myUsername");
    let members = wx.getStorageSync("member") || [];
    let count = members.reduce(function (result, curMember, idx) {
        let chatMsgs = wx.getStorageSync(curMember.name + "-" + myName) || [];
        return result + chatMsgs.length;
    }, 0);

    getApp().globalData.unReadSpot = count > 0;
    console.log("disp fire em.xmpp.unreadspot:" + count);
    disp.fire("em.xmpp.unreadspot", count);
}

// 加载时进行相关初始化
chatIm.onLaunch = function () {
    // 调用 API 从本地缓存中获取数据
    var me = this;
    disp.on("em.main.ready", function () {
        me.calcUnReadSpot();
    });
    disp.on("em.chatroom.leave", function () {
        me.calcUnReadSpot();
    });
    disp.on("em.chat.session.remove", function () {
        me.calcUnReadSpot();
    });


    // 定义im事件
    WebIM.conn.listen({
        onOpened(message) {
            console.log("onOpened", message);
            //let token = message.accessToken
            clearInterval(teTIME)
            WebIM.conn.setPresence();
            if (getCurrentRoute() == "pages/login/login") {
                me.onLoginSuccess(wx.getStorageSync("myUsername"));
            }
            //进行自己服务器的socket连接
            chatIm.webSocket(wx.getStorageSync("myUsername"));
            heartCheck = {
                timeout: 5000,
                timeoutObj: null,
                reset: function () {
                    clearInterval(heartCheck.timeoutObj);
                    this.start();
                },
                clear: function () {
                    clearInterval(heartCheck.timeoutObj);
                },
                start: function () {
                    if (getApp().background) {
                        return;
                    }
                    heartCheck.timeoutObj = setInterval(function () {
                        chatIm.SocketTask.send({
                            data: "ping",
                            success: function () {
                                // console.log("ping suc")
                            },
                            fail: function (res) {
                                console.log("ping fail")
                            }
                        })
                    }, this.timeout)
                }
            }
            heartCheck.start();
        },

        onClosed() {
            me.conn.closed = true;
            console.log("onclose in");
            // 如果是切换到后台，不重连
            if (getApp().background) {
                return;
            }
            WebIM.conn.open()
        },

        onPresence(message) {
            console.log("onPresence", message);
            switch (message.type) {
                case "unsubscribe":
                    // pages[0].moveFriend(message);
                    break;
                case "subscribed":
                    wx.showToast({
                        title: "添加成功",
                        duration: 1000
                    });
                    break;
                default:
                    break;
            }
        },
        onAudioMessage(message) {
            console.log("onAudioMessage", message);
            if (message) {
                if (me.onMessageError(message)) {
                    msgStorage.saveReceiveMsg(message, msgType.AUDIO);
                }
                me.calcUnReadSpot();
                ack(message);
            }
        },
        onTextMessage(message) {
            console.log("onTextMessage", message);

            if (message && message.from != "admin") {
                if (me.onMessageError(message)) {
                    msgStorage.saveReceiveMsg(message, msgType.TEXT);
                }
                me.calcUnReadSpot();
                me.ack(message);

            }
        },
        onEmojiMessage(message) {
            console.log("onEmojiMessage", message);
            if (message) {
                if (me.onMessageError(message)) {
                    msgStorage.saveReceiveMsg(message, msgType.EMOJI);
                }
                me.calcUnReadSpot();
                me.ack(message);
            }
        },
        onPictureMessage(message) {
            console.log("onPictureMessage", message);
            if (message) {
                if (me.onMessageError(message)) {
                    msgStorage.saveReceiveMsg(message, msgType.IMAGE);
                }
                me.calcUnReadSpot();
                me.ack(message);
            }
        },
        //收到消息送达服务器回执
        onReceivedMessage: function (message) {
            wx.serverReceiptt(message)
        },
        //收到消息送达客户端回执
        onDeliveredMessage: function (message) {
            //console.log("客户端回执" + message)
            //wx.setChat(message)
        },
        //收到消息已读回执
        onReadMessage: function (message) {
            //console.log("已读回执" + message)
            wx.clientReceiptt(message)
        },
        // 各种异常
        onError(error) {
            // 如果处于后台，则不处理
            if (getApp().background) {
                return;
            }
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
                    url: "../login/login"
                });
                return;
            }
            console.log(error.type, WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR)
            if (WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR == 8 && error.type == 3) {
                console.log("重新连接")
                teTIME = setInterval(function () {
                    wx.closeSocket()
                    chatIm.conn.loginOpen({
                        uid: wx.getStorageSync("ued").toString()
                    })
                }, 5000)
            }
            // 8: offline by multi login
            // if (error.type ==27 && WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR==8) {
            //     clearInterval(teTIME)
            //     wx.redirectTo({
            //         url: "../login/login"
            //     });
            // }
            if (error.type == WebIM.statusCode.WEBIM_CONNCTION_OPEN_ERROR) {
                wx.showModal({
                    title: "用户名或密码错误",
                    confirmText: "OK",
                    showCancel: false
                });
            }
        },
    });
},
    chatIm.onLoginSuccess = function (myName) {
        // clearInterval(teTIME)
    },


 // 取得所有未读消息数量
chatIm.getTotalUnreadCnt = function () {
        var member = wx.getStorageSync("member");
        var myName = wx.getStorageSync("myUsername");
        let cnt = 0;
        for (let i = 0; i < member.length; i++) {
            let newChatMsgs = wx.getStorageSync(member[i].name + myName) || [];
            if (!newChatMsgs) {
                continue;
            }
            cnt = cnt + newChatMsgs.length;
        }
        return cnt;
 }
//当前人未读消息
chatIm.currentUnreadCnt = function () {
    var member = wx.getStorageSync("member");
    var myName = wx.getStorageSync("myUsername");
    let cnt = 0; 
    let current = wx.getStorageSync("currentChatId");
    let newChatMsgs = wx.getStorageSync(current + myName) || [];
    if (!newChatMsgs) {
        newChatMsgs=[]
    }
    cnt = cnt + newChatMsgs.length;
    return cnt;
}
// 今天收到的所有消息
chatIm.getTotalMessage = function () {
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }
    var member = wx.getStorageSync("member");
    var myName = wx.getStorageSync("myUsername");
    let cnt = 0;
    var newArrow = []
    let newChatMsgs=[]
    for (let i = 0; i < member.length; i++) {
        newChatMsgs = wx.getStorageSync("rendered_"+member[i].name + myName) || [];
        if (!newChatMsgs) {
            continue;
        }
        for (let z = 0; z < newChatMsgs.length; z++) {
            if (newChatMsgs[z].style==""){
                if (newChatMsgs[z].time.replace(/\s+\w.+/, "") == getNowFormatDate()){
                    newArrow.push(newChatMsgs[z])
                }

            }
        }
    }
  
    cnt = cnt + newArrow.length + chatIm.getTotalUnreadCnt();
    return cnt;
}
chatIm.webSocket = function (uid) {
    // 创建Socket
    var that = this;
    this.SocketTask = wx.connectSocket({
        // 正式环境
        url: "wss://txbb.qulaowu.com/b/im/" + uid,
        // url: "ws://47.92.25.130:8582/im/" + uid,
        success: function (res) {
            console.log('WebSocket连接创建', res)
        },
        fail: function (err) {
            wx.showToast({
                title: '网络异常！',
            })
            console.log(err)
        },
    })
    this.SocketTask.onOpen(res => {
        socketOpen = true;
        console.log('监听 WebSocket 连接打开事件。', res)
    })
    this.SocketTask.onClose(onClose => {
        socketOpen = false;
        console.log('监听 WebSocket 连接关闭事件。', onClose)
    })
    this.SocketTask.onError(onError => {
        //chatIm.myReconnect()
        console.log('监听 WebSocket 错误。错误信息', onError)
        socketOpen = false
    })
    this.SocketTask.onMessage(onMessage => {
        // console.log('SocketTask.onMessage:' + onMessage)
    })
},

    chatIm.myReconnect = function (url) {
        if (socketOpen) {
            return;
        };
        //没连接上会一直重连，设置延迟避免请求过多
        tt && clearTimeout(tt);
        tt = setTimeout(function () {
            if (!socketOpen) {
                chatIm.webSocket(wx.getStorageSync("ued"))
            }
        }, 4000);
    }


module.exports = chatIm;
