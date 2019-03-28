const { ajax, API } = require('./api.js');
//c给b留言
const sendMessage = data => ajax({ url: API.sendMessage, data: data, method: "POST" })
const settingChatBC = data => ajax({ url: API.settingChatBC, data: data, method: "POST" })
const sendTmplate = data => ajax({ url: API.sendTmplate, data: data, method: "POST" })
module.exports = {
    sendMessage,
   settingChatBC,
    sendTmplate
};