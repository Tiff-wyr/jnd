// borrower/pages/agentDetail/agentDetail.js
const app = getApp()
import {
  fetch
} from "../../../utils/axios.js"

let WebIM = require("../../../utils/WebIM")["default"];
let disp = require("../../../utils/broadcast");
let systemReady = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    loanData: {},
    member: [],
    isShow: false,
    isMask: false,
    id: '',

    myName: "",
    unReadSpot: false,
    phone: '******'
  },


  getDetail(id) {
    fetch.get(`/userBorrower/selectUserBorrowerById/${id}`).then(res => {
      this.setData({
        user: res.data,
        phone:res.data.phone
      }, () => {
        this.check()
      })
    })
  },

  lookPhone() {
    if (this.data.isShow) {
      this.setData({
        isMask: true
      })
    } else {
        console.log('usr',app.globalData.userInfo.roleId)
        if(app.globalData.userInfo.roleId === 2){
      //经纪人
          fetch.get(`/userBroker/checkIsVipOrCount/${app.globalData.userInfo.phone}`).then(res=>{
        console.log(res)
        if(res.data === 1){
          console.log("查看手机号")
          this.setData({
            phone: this.data.user.phone
          })
          //经纪人  减少次数
          fetch.get(`/vipClick/deleteVipClickCount/${app.globalData.userInfo.phone}`).then(res => {
            console.log('减少次数', res)
          })
        }else{
          wx.showToast({
            title: '您不是会员',
            duration: 2000
          })
          wx.navigateTo({
            url: '/pages/agent/pages/member/member',
          })

        }
          })
        }else{
        //机构
          fetch.get(`vipClick/getClickByAgencyPhone/${app.globalData.userInfo.phone}`).then(res=>{
            if(res.data.status === 200){
              this.setData({
                phone: this.data.user.phone
              })
              fetch.get(`vipClick/reduceCount/${app.globalData.userInfo.phone}`).then(res=>{
                console.log('减少次数', res)
              })
            }else{
              wx.showToast({
                title: '您不是会员',
                duration: 2000
              })
              wx.navigateTo({
                url: '/pages/organ/pages/member/member',
              })
            }
          })

        }
    }
  },

  cancel() {
    this.setData({
      isMask: false
    })

  },

  //立即沟通
  chat(event) {
    if (app.globalData.userInfo.name) {
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
  getLoan() {
    fetch.get(`/orderPublic/getByBorId/${this.data.id}`).then(res => {
      console.log('ssss', res.data)
      this.setData({
        loanData: res.data.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if (app.globalData.userInfo.name) {
      this.setData({
        myName: app.globalData.userInfo.phone
      })
    }
    this.setData({
      id: options.id
    })
    this.getLoan()

    let that = this
    disp.on("em.xmpp.unreadspot", function(count) {
      that.setData({
        unReadSpot: count > 0
      });
    });

    wx.getSystemInfo({
      success(res) {
        console.log('手机类型', res.platform)
        if (res.platform === 'android') {
          that.setData({
            isShow: false
          })
        } else {
          that.setData({
            isShow: true
          })
        }
      }
    })
    // this.getDetail(options.id)
    // this.check()


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  check(){
    if (app.globalData.userInfo.name) {
      const that = this
      if (app.globalData.userInfo.roleId === 2) {
        //经纪人
        fetch.get(`/brokerResource/getBrokerResource/${app.globalData.userInfo.id}/${that.data.id}`).then(res => {
            console.log('ddddddddddddd',res)
          if (res.data === 1) {
            //看过，该手机号展现
            console.log('kan', res)
            that.setData({
              phone: that.data.user.phone
            })
          } else {
            //没看过  手机号隐藏
            that.setData({
              phone: '******'
            })
          }
        })
      } else {
        //机构
        fetch.post(`/agencyResource/seleteStateById`, {
          agencyId: app.globalData.userInfo.id,
          borId: that.data.id
        }).then(res => {
          console.log('ss', res)
          if (res.data.status === 200) {
            console.log('kan', res)
            //看过，该手机号展现
            that.setData({
              phone: that.data.user.phone
            })
          } else {
            //没看过  手机号隐藏
            that.setData({
              phone: '******'
            })
          }
        })

      }
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      unReadSpot: getApp().globalData.unReadSpot
    });
    //  this.getRoster();
    this.getDetail(this.data.id)
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
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})