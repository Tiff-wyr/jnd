function tabbarinit(type) {
  if (type === 'agent') {
    return [
      {
        "current": 0,
        "pagePath": "/pages/agent/pages/borrower/borrower",
        "text": "贷款人",
        "iconPath": "/static/icon/pic/11.png",
        "selectedIconPath": "/static/icon/pic/1.png"
      },
      {
        "current": 0,
        "pagePath": "/pages/agent/pages/member/member",
        "text": "会员中心",
        "iconPath": "/static/icon/pic/22.png",
        "selectedIconPath": "/static/icon/pic/2.png"
      },
      {
        "current": 0,
        "pagePath": "/pages/agent/pages/message/message",
        "text": "消息",
        "iconPath": "/static/icon/pic/33.png",
        "selectedIconPath": "/static/icon/pic/3.png"
      },
      {
        "current": 0,
        "pagePath": "/pages/agent/pages/mine/mine",
        "text": "我的",
        "iconPath": "/static/icon/pic/99.png",
        "selectedIconPath": "/static/icon/pic/9.png"
      }
    ]
  }
  else if (type === 'organ') {
    return [
      {
        "current": 0,
        "pagePath": "/pages/organ/pages/borrower/borrower",
        "text": "贷款人",
        "iconPath": "/static/icon/pic/11.png",
        "selectedIconPath": "/static/icon/pic/1.png"
      },
      {
        "current": 0,
        "pagePath": "/pages/organ/pages/member/member",
        "text": "会员中心",
        "iconPath": "/static/icon/pic/22.png",
        "selectedIconPath": "/static/icon/pic/2.png"
      },
      {
        "current": 0,
        "pagePath": "/pages/organ/pages/message/message",
        "text": "消息",
        "iconPath": "/static/icon/pic/33.png",
        "selectedIconPath": "/static/icon/pic/3.png"
      },
      {
        "current": 0,
        "pagePath": "/pages/organ/pages/mine/mine",
        "text": "我的",
        "iconPath": "/static/icon/pic/99.png",
        "selectedIconPath": "/static/icon/pic/9.png"
      }
    ]
  }
  else if (type === 'user'){
    return [
      {

        "current": 0,
        "pagePath":"/pages/borrower/pages/loanApply/loanApply",
        "text": "贷款申请",
        "iconPath": "/static/icon/pic/55.png",
        "selectedIconPath": "/static/icon/pic/5.png"
      },
      {
        "current": 0,
        "pagePath": "/pages/borrower/pages/loans/loans",
        "text": "找贷款",
        "iconPath": "/static/icon/pic/66.png",
        "selectedIconPath": "/static/icon/pic/6.png"
      },
      {
        "current": 0,
        "pagePath": "/pages/borrower/pages/borrowerMessage/borrowerMessage",
        "text": "消息",
        "iconPath": "/static/icon/pic/33.png",
        "selectedIconPath": "/static/icon/pic/3.png"
      },
      {
        "current": 0,
        "pagePath": "/pages/borrower/pages/borrowerMine/borrowerMine",
        "text": "我的",
        "iconPath": "/static/icon/pic/99.png",
        "selectedIconPath": "/static/icon/pic/9.png"
      }
    ]
  }
}
//tabbar 主入口
function tabbarmain(bindName = "tabdata", id, target, type) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit(type);
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar
  that.setData({ bindData });
}

module.exports = {
  tabbar: tabbarmain
}