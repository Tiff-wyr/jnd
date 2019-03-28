let WebIM = require("../../utils/WebIM")["default"];
let msgType = require("msgtype");
function timeDiff(faultDate, completeTime) {
    var stime = Date.parse(new Date(faultDate));
    var etime = Date.parse(new Date(completeTime));
    var usedTime = etime - stime;  //两个时间戳相差的毫秒数
    var time = usedTime/1000
    return time;
}
module.exports = function(sendableMsg, type, myName){
    //计算最后一条消息时间

   
    var historyChatMsgs = wx.getStorageSync(wx.getStorageSync("currentChat")) || [];
    var lastMsm
    var showTime = false
    if (historyChatMsgs.length==0){
        lastMsm = WebIM.time()
        showTime = true
    }
    else
    {
        lastMsm = historyChatMsgs[historyChatMsgs.length - 1].time
    }
   
   
	var time = WebIM.time();
   
    //超过半个小时不重新显示时间
    if (timeDiff(lastMsm, time)>30*60){
        showTime=true
    }
	var renderableMsg = {
		info: {
			from: sendableMsg.body.from,
			to: sendableMsg.body.to
		},
		username: sendableMsg.body.from == myName ? sendableMsg.body.to : sendableMsg.body.from,
		yourname: sendableMsg.body.from,
		msg: {
			type: type,
			url: sendableMsg.body.body.url,
			data: getMsgData(sendableMsg, type),
		},
		style: sendableMsg.body.from == myName ? "self" : "",
		time: time,
		mid: sendableMsg.type + sendableMsg.id,
        msgState:0,
        notice:0,
        showTime: showTime
	};
	if(type == msgType.IMAGE){
		renderableMsg.msg.size = {
			width: sendableMsg.body.body.size.width,
			height: sendableMsg.body.body.size.height,
		};
	}
	return renderableMsg;

	function getMsgData(sendableMsg, type){
		if(type == msgType.TEXT){
			return WebIM.parseEmoji(sendableMsg.value.replace(/\n/mg, ""));
		}
		else if(type == msgType.EMOJI){
			return sendableMsg.value;
		}
		else if(type == msgType.IMAGE || type == msgType.VIDEO || type == msgType.AUDIO){
			return sendableMsg.body.body.url;
		}
		return "";
	}
};
