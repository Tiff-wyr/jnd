// pages/organ/productDetail/productDetail.js
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
    product:{},

     id:'',
    productBelong:'',
    organMess:{},
    userId:'',
    isCollect: false,
    myName: '',
    unReadSpot: false,
    member: [],
  },
  //立即沟通
  chat(event) {
    if (this.data.userId) {
      let my = this.data.myName
      let your = event.target.dataset.phone
      let yourName = event.target.dataset.name

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

  //借款人向此产品申请
  apply() {
    if (this.data.userId) {
      wx.navigateTo({
        url: `/pages/loanApply/loanApply?id=${this.data.organMess.agencyId}&roleId=3`,
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
  //进入机构详情
  organDetail(e){
    wx.navigateTo({
      url: `/pages/detail/organDetail/organDetail?id=${e.currentTarget.dataset.id}`,
    })
  },
  getDetail(id){
    fetch.get(`/product/selectProductById/${id}`).then(res=>{
       this.setData({
         product :res.data,
         productBelong: res.data.productBelong
       })
      this.getOrganDetail()
    })
  },
  getOrganDetail(){
    fetch.get(`/userAgency/selectUserAgencyById/${this.data.productBelong}`).then(res=>{
      console.log('aaa',res.data)
      this.setData({
        organMess:res.data
      })
     
    })
  },


  //收藏
  restoreClick() {
    let that = this
    if (this.data.userId) {
      wx.request({
        url: 'https://www.rjkf001.com/borpro/addBorPro',
        data: {
          borId: this.data.userId,
          productId: this.data.id
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
  //取消收藏
  cancelColl() {
    let that = this
    if (that.data.userId) {
      wx.request({
        url: 'https://www.rjkf001.com/borpro/deleteBorPro',
        data: {
          borId: that.data.userId,
          productId: that.data.id
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
  //收藏判断
  collectPan() {
    let that = this
    if (that.data.userId) {
      wx.request({
        url: 'https://www.rjkf001.com/borpro/selectBorPro',
        data: {
          borId: that.data.userId,
          productId: that.data.id
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })

    this.getDetail(this.data.id)
    
    if (app.globalData.userInfo.name) {
      this.setData({
        userId: app.globalData.userInfo.id,
        myName: app.globalData.userInfo.phone
      })
    }

    this.collectPan()
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

  }
})