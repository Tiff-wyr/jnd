let RecordStatus = require("suit/audio/record_status").RecordStatus;
let msgType = require("../msgtype");
const app = getApp()

Component({
	properties: {
		username: {
			type: Object,
			value: {}
		},
		chatType: {
			type: String,
			value: msgType.chatType.SINGLE_CHAT,
		},
	},
	data: {
		isIpx: app.globalData.isIpx,
		recordStatus: RecordStatus.HIDE,
		RecordStatus,
    bottom: 0,
		__comps__: {
			main: null,
			emoji: null,
			image: null,
			location: null,
			// video: null,
		},
	},
	methods: {
		// 事件有长度限制：仅限 26 字符
		toggleRecordModal(){
			this.triggerEvent(
				"tapSendAudio",
				null,
				{
					bubbles: true,
					composed: true
				}
			);
		},

		openCamera(){
			this.data.__comps__.image.openCamera();
		},

		openEmoji(){
			this.data.__comps__.emoji.openEmoji();
		},

		cancelEmoji(val){
      this.setData({
        bottom: val.detail
      })
			this.data.__comps__.emoji.cancelEmoji();
		},
    inputBlured() {
      this.setData({
        bottom: 0
      })
    },
		sendImage(){
			this.data.__comps__.image.sendImage();
		},

		sendLocation(){
			// this.data.__comps__.location.sendLocation();
		},

		emojiAction(evt){
			this.data.__comps__.main.emojiAction(evt.detail.msg);
		},
	},

	// lifetimes
	created(){},
	attached(){},
	moved(){},
	detached(){},
	ready(){
		let comps = this.data.__comps__;
		comps.main = this.selectComponent("#chat-suit-main");
		comps.emoji = this.selectComponent("#chat-suit-emoji");
		comps.image = this.selectComponent("#chat-suit-image");
		// comps.location = this.selectComponent("#chat-suit-location");
		// comps.video = this.selectComponent("chat-suit-video");
	},
});
