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
    agent: {},
    member: [],
    victory: [],
    userId:'',
    optionId:'',
    isCollect:false,
    myName: '',
    unReadSpot: false,
  },

  getDetailAgent(id){
    fetch.get(`/userBroker/getUserBrokerById/${id}`).then(res=>{
      this.setData({
        agent :res.data
      })

      console.log('详情页')
      //经纪人成功案例
      this.getVictory(this.data.optionId)

    })
  },

  getVictory(id){
    fetch.get(`/orderAll/getTopSixOrderByBrokerId/${id}`).then(res => {
      this.setData({
        victory: res.data
      })

      console.log('成功案例')
  
    })
  },
//收藏
  restoreClick(){
    let that=this
    if (this.data.userId){
      wx.request({
        url: 'https://www.rjkf001.com/borrowerKeep/saveBorrowerKeep',
        data: {
          borrowerId: this.data.userId,
          brokerId: this.data.optionId
        },
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(res) {
        
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
  cancelColl(){
    let that=this
    if (this.data.userId){
      fetch.get(`/borrowerKeep/removeBorrowerKeepById/${this.data.userId}/${this.data.optionId}`).then(res => {
       
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
  collectPan(id){
    let that = this
    if (this.data.userId){
      fetch.get(`/borrowerKeep/checkBorrowerKeepBroker/${this.data.userId}/${id}`).then(res => {
    
        if (res.data === 0) {
          that.setData({
            isCollect: false
          })
        } else {
          that.setData({
            isCollect: true
          })
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

  //立即沟通
  chat(event) {
    if (this.data.userId) {
      let my = this.data.myName
      let your = event.target.dataset.phone
      let yourName = event.target.dataset.name
      // var nameList = {
      //   myName: this.data.myName,
      //   my:app.globalData.userInfo.name,
      //   your: event.target.dataset.phone,
      //   yourName: event.target.dataset.name
      // };
      wx.navigateTo({
        url: `/pages/chatroom/chatroom?myName=${my}&your=${your}&yourName=${yourName}`
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

  //借款人向此经纪人申请
  apply(){
     if(this.data.userId){
wx.navigateTo({
  url: `/pages/loanApply/loanApply?id=${this.data.optionId}&roleId=2`,
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

     this.setData({
       optionId:options.id
     })
    //经纪人详情页
    this.getDetailAgent(this.data.optionId)


    if (app.globalData.userInfo){
      this.setData({
        userId: app.globalData.userInfo.id,
      })
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
        if (!systemReady) {
          disp.fire("em.main.ready");
          systemReady = true;
        }
      },
      error(err) {
    
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