let Disp = require("../../utils/Dispatcher");
let msgPackager = require("msgpackager");
let msgType = require("msgtype");
let msgStorage = new Disp();
let broadcast = require("../../utils/broadcast");
msgStorage.saveReceiveMsg = function(receiveMsg, type){
	let sendableMsg;
	if(type == msgType.IMAGE){
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			body: {
				id: receiveMsg.id,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: type,
				ext: receiveMsg.ext,
				chatType: receiveMsg.chatType,
				toJid: "",
				body: {
					type: type,
					url: receiveMsg.url,
					filename: receiveMsg.filename,
					filetype: receiveMsg.filetype,
					size: {
						width: receiveMsg.width,
						height: receiveMsg.height
					},
				},
			},
		};
	}
	else if(type == msgType.TEXT || type == msgType.EMOJI){
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			body: {
				id: receiveMsg.id,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: type,
				ext: receiveMsg.ext,
				chatType: receiveMsg.chatType,
				toJid: "",
				body: {
					type: type,
					msg: receiveMsg.data,
				},
			},
			value: receiveMsg.data
		};
	}
	else if(type == msgType.AUDIO){
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			body: {
				id: receiveMsg.id,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: type,
				ext: receiveMsg.ext,
				chatType: receiveMsg.chatType,
				toJid: "",
				body: {
					type: type,
					url: receiveMsg.url,
					filename: receiveMsg.filename,
					filetype: receiveMsg.filetype,
				},
			},
		};
	}
	else{
		return;
	}
	this.saveMsg(sendableMsg, type, receiveMsg);
};
msgStorage.saveMsg = function(sendableMsg, type, receiveMsg){
    console.log(sendableMsg)
    //console.log(receiveMsg)
	let me = this;
	let myName = wx.getStorageSync("myUsername");
	let sessionKey;
    let targetName;
    let nickName;
    //保存最后一条消息
    if (sendableMsg){
        wx.setStorageSync("chatSend", sendableMsg.value)
    }
	// 仅用作群聊收消息，发消息没有 receiveMsg
	if(receiveMsg && receiveMsg.type == "groupchat"){
		sessionKey = receiveMsg.to + myName;
	}
	// 群聊发 & 单发 & 单收
	else{
		sessionKey = sendableMsg.body.from == myName
			? sendableMsg.body.to + myName
			: sendableMsg.body.from + myName;
        if (myName != sendableMsg.body.to){
            targetName = sendableMsg.body.to
        }
        else
        {
            targetName = sendableMsg.body.from
        }
        console.log('receive',receiveMsg)
        if (receiveMsg){
            if (receiveMsg.nickname !="undefined"){
                nickName = receiveMsg.nickname
            }
            else
            {
                if (receiveMsg.ext.nickName){
                    nickName = receiveMsg.ext.nickName
                }
            }
        }
        else
        {
            nickName = wx.getStorageSync("nickName") || ""
        }
	}
	let curChatMsg = wx.getStorageSync(sessionKey) || [];
	let renderableMsg = msgPackager(sendableMsg, type, myName);
	curChatMsg.push(renderableMsg);
	if(type == msgType.AUDIO){
		// 如果是音频则请求服务器转码
		wx.downloadFile({
			url: sendableMsg.body.body.url,
			header: {
				"X-Requested-With": "XMLHttpRequest",
				Accept: "audio/mp3",
				Authorization: "Bearer " + sendableMsg.accessToken
			},
			success(res){
				// wx.playVoice({
				// 	filePath: res.tempFilePath
				// });
				renderableMsg.msg.url = res.tempFilePath;
				save();
			},
			fail(e){
				console.log("downloadFile failed", e);
			}
		});
	}
	else{
		save();
	}
	function save(){
        wx.setStorage({
            key: sessionKey,
            data: curChatMsg,
            success() {
                me.fire("newChatMsg", renderableMsg, type, curChatMsg);
            }
        });
        // 如果之前没有聊过，自动加为联系人
        let member = wx.getStorageSync("member");
        // 一个都没有，需要初始化联系人列表
        if (!member) {
            member = [];
        }
        let hasMatch = false;
        for (let i = 0; i < member.length; i++) {
            if (member[i].name == targetName) {
                hasMatch = true;
                break;
            }
        }
        if (!hasMatch) {
            member.push({
                name: targetName,
                nickname: nickName,
                subscription: "both"
            });
            // 保存到联系人记录
            wx.setStorageSync("member", member);
            // 发送新增联系人事件
            //broadcast.fire("em.newContact", targetName);
        }
       
	}
};

module.exports = msgStorage;
