let msgStorage = require("../msgstorage");
let WebIM = require("../../../utils/WebIM")["default"];
let chatIm = require("../../../chatIm");
var onfire = require('../../../utils/event')
var invoke = require('../../../utils/invoke')

let { produce } = require("../../../utils/immer");
let timer = null
let failTimer=null



let LIST_STATUS = {
    SHORT: "scroll_view_change",
    NORMAL: "scroll_view"
};



var app = getApp();
Component({
    properties: {
        username: {
            type: Object,
            value: {},
        }
    },
    data: {
        view: LIST_STATUS.NORMAL,
        chatClass:"",
        scrollTop: 0,
        toView: "",
        chatMsg: [],
        userRole: "", //0:c端 1:b端
        __visibility__: false,
        otherNickName:"",
        otherAvatar:"",
        followJobId:"",
        followJobName:"",
        sparePushCount:"",
        


    },
    methods: {
        normalScroll() {
            this.setData({
                view: LIST_STATUS.NORMAL
            });
        },
        sendMessage: function () {
            var len = wx.getStorageSync(wx.getStorageSync("currentChat")).length //遍历的数组的长度
            this.setData({
                scrollTop: 1000 * len  // 这里我们的单对话区域最高1000，取了最大值，应该有方法取到精确的
            });
        },
        //获取用户信息
        getChatBC() {
            let _this=this
            invoke.settingChatBC({ chatUrserId: wx.getStorageSync("toUserID") , chatType: wx.getStorageSync("userType") })
                .then((res) => {
                    _this.setData(
                       {
                           otherNickName: res.data.otherNickName.length > 10 ? res.data.otherNickName.substring(0,10) + '...' : res.data.otherNickName,
                           otherAvatar: res.data.otherAvatar,
                           followJobId: res.data.followJobId,
                           followJobName: res.data.followJobName,
                            sparePushCount: res.data.sparePushCount,
                            userRole: wx.getStorageSync("myUsername") == res.data.bUser?1:0,
                            chatClass: wx.getStorageSync("myUsername") == res.data.bUser?"":" .nomoll"
                       }
                   )
                    wx.setStorageSync("nickName", res.data.otherNickName)
                })

        },
        //立即推送
        pushImmediately(e) {
            let _this=this
            wx.showModal({
                title: '确认推送给客户',
                content: '含本次还可以向客户推送' + _this.data.sparePushCount+'次',
                confirmText: "立即推送",
                confirmColor: "#1f90e6",
                success(res) {
                    if (res.confirm) {
                        if (_this.data.sparePushCount > 0){
                            let index = e.currentTarget.id;
                            let localMsg = wx.getStorageSync(wx.getStorageSync("currentChat"))
                            let sendData={
                                recerveUser: wx.getStorageSync("toUserID"),
                                messageId: localMsg[index].mid,
                                message: localMsg[index].msg.data[0].data
                            }
                            
                            //console.log(sendData)
                            invoke.sendTmplate(sendData)
                                .then((res) => {
                                    //请求成功
                                    if (res.flag == 0 && res.data.pushStatus){
                                        wx.showToast({
                                            title: '推送成功',
                                            icon: 'success',
                                            duration: 2000,
                                            success: function () {
                                                _this.setData({
                                                    sparePushCount: res.data.sparePushCount || 0
                                                })
                                                wx.setStorageSync("noticeIndex", index);
                                                onfire.fire('clientPush');
                                            }
                                        })
                                    }
                                    else
                                    {
                                        wx.showToast({
                                            title: res.msg,
                                            icon: 'none',
                                            duration: 2000
                                        })
                                    }
                                    
                                })
                        }
                        else
                        {
                            wx.showToast({
                                title: '没有推送次数',
                                icon: 'none',
                                duration: 2000
                            })
                        }
                        
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        },
        shortScroll() {
            this.setData({
                view: LIST_STATUS.SHORT
            });
        },

        onTap() {
            this.triggerEvent("msglistTap", null, { bubbles: true });
        },

        previewImage(event) {
            var url = event.target.dataset.url;
            wx.previewImage({
                urls: [url]		// 需要预览的图片 http 链接列表
            });
        },
        enter: function (event) {
            // wx.navigateTo({
            //     url: "/pages/chat/chat"
            // });
            wx.redirectTo({
                url: '/pages/clientDetail/clientDetail?id=' + wx.getStorageSync("toUserID")
            })
        },

        readMsg() {

        },
        renderMsg(renderableMsg, type, curChatMsg, sessionKey) {
            let _this = this
            //自动滚到底部
            setTimeout(function(){
               _this.sendMessage()
            },300)
            var historyChatMsgs = wx.getStorageSync("rendered_" + sessionKey) || [];
            historyChatMsgs = historyChatMsgs.concat(curChatMsg);
            //if(!historyChatMsgs.length) return;
            wx.setStorageSync("rendered_" + sessionKey, historyChatMsgs);

            wx.setStorage({
                key: "rendered_" + sessionKey,
                data: historyChatMsgs,
                success:function(){
                    _this.setData({
                        chatMsg: historyChatMsgs
                    });
                }
            })
            //超过服务器回执时间
            clearTimeout(failTimer)
            failTimer=setTimeout(function(){
                console.log("发送失败")
                var historyChatMsgs = wx.getStorageSync(wx.getStorageSync("currentChat")) || [];
                let index = parseInt(historyChatMsgs.length) - 1
                if (historyChatMsgs.length == 0) {
                   
                }
                else {
                    if (historyChatMsgs[parseInt(historyChatMsgs.length) - 1].msgState == 0) {
                       historyChatMsgs[parseInt(historyChatMsgs.length) - 1].msgState = 4
                       //发消息失败退出登录
                        // wx.redirectTo({
                        //     url: "../login/login"
                        // });
                    }
                }
                _this.setData({
                    chatMsg: historyChatMsgs
                });
                wx.setStorageSync(wx.getStorageSync("currentChat"), historyChatMsgs);
            },5000)
            //服务器回执
            onfire.one('serverReceiptt', function () {
                console.log("serverReceiptt")
                //清除发送失败
                clearTimeout(failTimer)
                //当b不在线c给b留言
                let msg = wx.getStorageSync(wx.getStorageSync("currentChat"))
                let sendData={
                    recerveUser: wx.getStorageSync("toUserID"),
                    message: wx.getStorageSync("chatSend")
                }
                let sendlock=true
                if (_this.data.userRole == 0 && sendlock) {
                    timer = setTimeout(() => {
                        sendlock=false
                        invoke.sendMessage(sendData)
                            .then((res) => {
                                setTimeout(function(){
                                    sendlock = true
                                },1000)
                            })
                        console.log("主动推送消息")
                    }, 5000)
                }
                //onfire.un('serverReceiptt');
                setTimeout(function () {
                    //onfire.un('serverReceiptt');
                    var historyChatMsgs = wx.getStorageSync(wx.getStorageSync("currentChat")) || [];
                    if (historyChatMsgs.length == 1) {
                        historyChatMsgs[0].msgState = 1
                    }
                    else {
                        historyChatMsgs[parseInt(historyChatMsgs.length) - 1].msgState = 1
                    }
                    _this.setData({
                        chatMsg: historyChatMsgs
                    });
                    wx.setStorageSync(wx.getStorageSync("currentChat"), historyChatMsgs);
                }, 500)

            });
            //客户端回执
            onfire.one('clientReceiptt', function () {
                console.log("clientReceiptt")
                clearTimeout(timer)
                //清除发送失败
                clearTimeout(failTimer)
                setTimeout(function () {
                    var historyChatMsgs = wx.getStorageSync(wx.getStorageSync("currentChat")) || [];
                    var history = produce(historyChatMsgs, draft => {
                        historyChatMsgs.forEach((item, index) => {
                            if(draft[index].msgState==1){
                                draft[index].msgState = 2
                            }
                        })
                    })
                    _this.setData({
                        chatMsg: history
                    });
                    wx.setStorageSync(wx.getStorageSync("currentChat"), history);
                }, 600)
            });
            //推送状态回执
            onfire.one('clientPush', function () {
                console.log("clientPush")
                setTimeout(function () {
                    var historyChatMsgs = wx.getStorageSync(wx.getStorageSync("currentChat")) || [];
                    let index = wx.getStorageSync("noticeIndex")
                    if (index == 0) {
                        historyChatMsgs[0].notice = 1
                    }
                    else {
                        historyChatMsgs[wx.getStorageSync("noticeIndex")].notice = 1
                    }
                    _this.setData({
                        chatMsg: historyChatMsgs
                    });
                    wx.setStorageSync(wx.getStorageSync("currentChat"), historyChatMsgs);
                }, 700)
            });

            wx.setStorageSync(sessionKey, null);
        },
    },

    // lifetimes
    created() { },
    attached() {
        this.__visibility__ = true;
    },
    moved() { },
    detached() {
        this.__visibility__ = false;
    },
    ready() {
        app.globalData.chat = this
        let me = this;
        let username = this.data.username;
        let myUsername = wx.getStorageSync("myUsername");
        let sessionKey = username.your + myUsername;
        let chatMsg = wx.getStorageSync(sessionKey) || [];
        let currentChat = "rendered_" + sessionKey
        this.renderMsg(null, null, chatMsg, sessionKey);
        this.getChatBC()
        wx.setStorageSync("currentChat", currentChat);
        msgStorage.on("newChatMsg", function (renderableMsg, type, curChatMsg) {
            if (!me.__visibility__) return;
            // 判断是否属于当前会话
            if (username.groupId) {
                // 群消息的 to 是 id，from 是 name
                if (renderableMsg.info.from == username.groupId || renderableMsg.info.to == username.groupId) {
                    me.renderMsg(renderableMsg, type, curChatMsg, sessionKey);
                }
            }
            else if (renderableMsg.info.from == username.your || renderableMsg.info.to == username.your) {
                me.renderMsg(renderableMsg, type, curChatMsg, sessionKey);
            }
        });
    },
   


});
