// borrower/pages/agentDetail/agentDetail.js
const app = getApp()
import { fetch } from "../../../utils/axios.js"

let WebIM = require("../../../utils/WebIM")["default"];
let disp = require("../../../utils/broadcast");
let systemReady = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    organ: {},
    myName: '',
    unReadSpot: false,
    member: [],
    victory: [
      {      
         borName: '',
         proAmount     :     '',
         proInterest  :    '',
         proName  :  '',
      },
    ],
    userId: '',
    optionId: '',
    isCollect: false,
    proData:[]

  },

  //借款人向此机构申请
  apply() {
    if (this.data.userId) {
      wx.navigateTo({
        url: `/pages/loanApply/loanApply?id=${this.data.optionId}&roleId=3`,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/passLogin/passLogin',
            })
          } else if (res.cancel) {

          }
        }
      })
    }
  },

  getDetail(id){
    fetch.get(`/userAgency/selectUserAgencyById/${id}`).then(res=>{
      this.setData({
        organ :res.data
      })

      console.log('机构详情',res.data)
    })
  },
  getVictory(id){
    fetch.get(`/orderAgency/getAgencySuccessOrder/${id}`).then(res=>{
      console.log('v',res)
      this.setData({
        victory : res.data
      })

      console.log('机构成功案例', res.data)
    })
  },

  //代理产品
  getPro(id){
    fetch.get(`/product/selectProductByAgency/${id}/1/4`).then(res=>{
      console.log('cc',res.data.list)
      this.setData({
        proData: res.data.list
      })
    })
  },
  proDetail(e){
    wx.navigateTo({
      url: `/pages/detail/proDetail/productDetail?id=${e.currentTarget.dataset.id}`,
    })
  },
  //立即沟通
  chat(event) {
    if (this.data.userId) {
      var nameList = {
        myName: this.data.myName,
        your: event.target.dataset.phone
      };
      wx.navigateTo({
        url: "/pages/chatroom/chatroom?username=" + JSON.stringify(nameList)
      });


    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/passLogin/passLogin',
            })
          } else if (res.cancel) {

          }
        }
      })
    }
  },


  //收藏
  restoreClick() {
    let that = this
    if(this.data.userId){
      wx.request({
        url: 'https://www.rjkf001.com/borAgency/addBorAgency',
        data: {
          borId: this.data.userId,
          agencyId: this.data.optionId
        },
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(res) {
          console.log('收藏', res.data)
          if (res.data.status === 200) {
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              isCollect: true
            })
            that.collectPan(that.data.optionId)
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/passLogin/passLogin',
            })
          } else if (res.cancel) {

          }
        }
      })
    }

  },
  //取消收藏
  cancelColl() {
    let that = this
    if(this.data.userId){
      wx.request({
        url: 'https://www.rjkf001.com/borAgency/deleteBorAgency',
        data: {
          borId: this.data.userId,
          agencyId: this.data.optionId
        },
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(res) {
          console.log('收藏', res.data)
          if (res.data.status === 200) {
            wx.showToast({
              title: '取消成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              isCollect: false
            })
            that.collectPan(that.data.optionId)
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/passLogin/passLogin',
            })
          } else if (res.cancel) {

          }
        }
      })
    }
 
  },
  //收藏判断
  collectPan() {
    let that = this
    if (this.data.userId){
      wx.request({
        url: 'https://www.rjkf001.com/borAgency/selectBorAgency',
        data: {
          borId: this.data.userId,
          agencyId: this.data.optionId
        },
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(res) {
          console.log('收藏', res.data)
          if (res.data === 0) {
            that.setData({
              isCollect: false
            })
          } else {
            that.setData({
              isCollect: true
            })
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/passLogin/passLogin',
            })
          } else if (res.cancel) {

          }
        }
      })
    }
 
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获得 机构详情信息
    this.getDetail(options.id)
    console.log(options.id)
    //获得 机构成功案例
    this.getVictory(options.id)
    this.getPro(options.id)
    this.setData({
      optionId: options.id
    })

    if (app.globalData.userInfo) {
      this.setData({
        userId: app.globalData.userInfo.id
      })
    //收藏判断
      this.collectPan(options.id)
    }

    if (app.globalData.userInfo) {
      this.setData({
        myName: app.globalData.userInfo.phone
      })
    }

    let that = this
    disp.on("em.xmpp.unreadspot", function (count) {
      that.setData({
        unReadSpot: count > 0
      });
    });


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      unReadSpot: getApp().globalData.unReadSpot
    });
    this.getRoster();
  },

  getRoster() {
    let me = this;
    let rosters = {
      success(roster) {
        var member = [];
        for (let i = 0; i < roster.length; i++) {
          if (roster[i].subscription == "both") {
            member.push(roster[i]);
          }
        }
        me.setData({
          member: member
        });
        wx.setStorage({
          key: "member",
          data: me.data.member
        });
        if (!systemReady) {
          disp.fire("em.main.ready");
          systemReady = true;
        }
      },
      error(err) {
        console.log("[main:getRoster]", err);
      }
    };
    // WebIM.conn.setPresence()
    WebIM.conn.getRoster(rosters);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})