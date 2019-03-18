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
    user: {
      borLogo:'',
      borrowerName: '',
      phone: '',
      address: '',
      borrowerAge:'',
      borrowerJob:'',
      income:'',
    },
    loanData:{},
    member: [],
    isShow:false,
    isMask:false,
    id:'',

    myName: "",
    unReadSpot: false,
  },


  getDetail(id){
    fetch.get(`/userBorrower/selectUserBorrowerById/${id}`).then(res=>{
      this.setData({
        user : res.data
      })
      console.log('借款人详情',res.data)
    })
  },

  lookPhone(){
    if(this.data.isShow){
        this.setData({
          isMask : true
        })
    }else{
      //判断是否为会员
      fetch.get(`/userBroker/checkIsVipOrCount/${app.globalData.userInfo.phone}`).then(res=>{
        console.log(res)
        if(res.data === 1){
           console.log("查看手机号")
        }else{
          console.log("不是会员，跳转到会员中心")
          wx.showToast({
            title: '您不是会员',
            // icon: 'success',
            duration: 2000
          })
          // if (app.globalData.userType === 'organ'){
          //   wx.switchTab({
          //     url: '/pages/organ/pages/member/member'
          //   })
          // }else{
          //   wx.switchTab({
          //     url: '/pages/agent/pages/member/member'
          //   })
          // }     
        }

      })
    }
  },

  cancel(){
    this.setData({
      isMask : false
    })
    this.getDetail(this.data.id)
  },

//立即沟通
  chat(event){
    if (app.globalData.userInfo){
      var nameList = {
        myName: this.data.myName,
        your: event.target.dataset.phone
      };
      wx.navigateTo({
        url: "/pages/chatroom/chatroom?username=" + JSON.stringify(nameList)
      });


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
  getLoan(){
    fetch.get(`/orderPublic/getByBorId/${this.data.id}`).then(res=>{
      console.log('ssss',res.data)
      this.setData({
        loanData:res.data.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  if(app.globalData.userInfo){
this.setData({
  myName:app.globalData.userInfo.phone
})
  }


    this.setData({
      id : options.id
    })
    this.getLoan()
     this.getDetail(options.id)

     let that = this

    disp.on("em.xmpp.unreadspot", function (count) {
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