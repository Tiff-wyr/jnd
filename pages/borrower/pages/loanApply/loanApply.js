// borrower/pages/loanApply/loanApply.js
const app = getApp()
var template = require('../../../../components/tabBar/index.js');


let WebIM = require("../../../../utils/WebIM")["default"];

import {
  fetch
} from "../../../../utils/axios.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pindex: '0', // 省索引
    rindex: '0', // 市索引

    text: 60,
    isFa: true,
    textCode: '发送验证码',

    provinceData: [],
    cityData: [{
      cid: '',
      city: ''
    }],

    sex: [{
        value: 1,
        name: '男',
        checked: true
      },
      {
        value: 0,
        name: '女'
      }
    ],
    //提交参数
    pid: 1,
    rcid: 2,
    phone: '',
    code: '',
    money: '',
    name: '',
    sexValue: 1
  },
  // 省选择框 选择事件
  bindPickerChange(e) {
    let pindex = e.detail.value
    let pid = this.data.provinceData[pindex].pid
    this.setData({
      pindex,
      pid
    })

    this.getCity(pid)
  },
  // 市选择框 选择事件
  bindPickerRight(e) {
    let rindex = e.detail.value
    let rcid = this.data.cityData[rindex].cid
    this.setData({
      rindex,
      rcid
    })
  },
  handlePhone(e) {
    this.setData({
      phone: e.detail.value
    })

  },
  handleCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  handleMoney(e) {
    this.setData({
      money: e.detail.value
    })
  },
  handleName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 性别按钮改变事件
  sexRadioChange(e) {
    let value = e.detail.value
    this.setData({
      sexValue: value
    })
    let sex = this.data.sex.map((item) => {
      if (item.value == value) {
        item.checked = true
      } else {
        item.checked = false
      }
      return item
    })
    this.setData({
      sex
    })
  },


  //发送验证码
  sendCode() {
    let that = this
    if (that.data.phone) {

     fetch.get(`/orderAll/getOrderByBTP/${that.data.phone}`).then(res=>{
        if(res.data.status === 500){
         wx.showToast({
           title: res.data.msg,
           icon:'none'
         })
         that.qingKong()
        }else{
          that.sendPass()
        }
     })


    } else {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
    }
  },
 
  sendPass() {
    let that = this
    if (this.data.phone) {
      fetch.get(`/user/selectIsRegister/${this.data.phone}`).then(res => {
        if (res.data.status === 200) {
          //发送验证码
          fetch.get(`/base/getUpdatePhoneCode/${this.data.phone}`).then(res => {

            if (res.data.status === 200) {
              that.setData({
                isFa: false,
                text: '60'
              })
              let timer = setInterval(() => {
                that.setData({
                  text: that.data.text - 1
                })

                if (that.data.text < 0) {
                  clearInterval(timer)

                  that.setData({
                    isFa: true,
                    textCode: "发送验证码",
                    text: 60
                  })

                }
              }, 1000)
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
              that.setData({
                isFa: true,
                textCode: '重新发送',
                text: 60
              })
            }
          })
        } else {
          wx.showToast({
            title: '该号已被他人注册',
            icon: 'none'
          })
        }
      })


    } else {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
    }
  },


  //获取 省
  getProvince() {
    fetch.get(`/city/getAllProvincial`).then(res => {

      this.setData({
        provinceData: res.data
      })
    })
  },

  //获取 市
  getCity(id) {
    fetch.get(`/city/getAllCity/${id}`).then(res => {

      this.setData({
        cityData: res.data
      })
    })
  },
  radioChange(e) {

  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    template.tabbar("tabBar", 0, this, app.globalData.userType) //0表示第一个tabbar
    this.getProvince()
    this.getCity(this.data.pid)
  },
  submitN() {
    let that = this
    fetch.post(`/orderAll/saveNoLoginOrder`, {
      borrowerName: that.data.name,
      borrowerSex: that.data.sexValue,
      loanAmount: that.data.money,
      address1: that.data.pid,
      address2: that.data.rcid,
      phone: that.data.phone,
      code: that.data.code,
    }).then(res => {

      if (res.data.status === 200) {
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        })
        wx.redirectTo({
          url: `/pages/jump/jump?phone=${that.data.phone}`,
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
        that.qingKong()

      }
    })
  },

  qingKong() {
    let that = this
    that.setData({
      pindex: '0', // 省索引
      rindex: '0', // 市索引
      phone: '', //手机号
      code: '', //验证码
      name: '', //名字
      money: '', //贷款金额
      sex: [{
          value: 1,
          name: '男',
          checked: true
        },
        {
          value: 0,
          name: '女'
        }
      ],
      text: 60,
      isFa: true,
      textCode: '发送验证码',

    })
  },
  // 登录
  login() {
    let that = this
    if (that.data.phone && that.data.code) {
      fetch.get(`/user/loginByPhoneAndCode/${that.data.phone}/${that.data.code}`).then(res => {


        if (res.data.status === 200) {


          if (res.data.data.roleId === 1) {



            app.globalData.userInfo = res.data.data
            app.globalData.userType = 'user'


            wx.setStorage({
              key: 'myUsername',
              data: res.data.data.name
            });
            getApp().conn.open({
              apiUrl: WebIM.config.apiURL,
              user: this.data.phone,
              pwd: '123456',
              grant_type: this.data.grant_type,
              appKey: WebIM.config.appkey
            });
            wx.reLaunch({
              url: '/pages/borrower/pages/borrowerMine/borrowerMine'
            })

          }
          if (res.data.data.roleId === 2) {




            app.globalData.userInfo = res.data.data
            app.globalData.userType = 'agent'


            wx.setStorage({
              key: 'myUsername',
              data: res.data.data.name
            });
            getApp().conn.open({
              apiUrl: WebIM.config.apiURL,
              user: this.data.phone,
              pwd: '123456',
              grant_type: this.data.grant_type,
              appKey: WebIM.config.appkey
            });
            wx.reLaunch({
              url: '/pages/agent/pages/mine/mine'
            })
          }
          if (res.data.data.roleId === 3) {



            app.globalData.userInfo = res.data.data
            app.globalData.userType = 'organ'


            wx.setStorage({
              key: 'myUsername',
              data: res.data.data.name
            });
            getApp().conn.open({
              apiUrl: WebIM.config.apiURL,
              user: this.data.phone,
              pwd: '123456',
              grant_type: this.data.grant_type,
              appKey: WebIM.config.appkey
            });
            wx.reLaunch({
              url: '/pages/organ/pages/mine/mine'
            })
          }


        } else {
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          })
        }
      })

    } else {
      wx.showToast({
        title: '不能为空',
        icon: 'none'
      })
    }
  },

  submit() {
    let that = this
    if (app.globalData.userInfo.phone) {
      //登录的
      that.checkKong()
      fetch.post(`/orderAll/saveLoginOrder`, {
        borrowerName: that.data.name,
        borrowerSex: that.data.sexValue,
        loanAmount: that.data.money,
        address1: that.data.pid,
        address2: that.data.rcid,
        phone: that.data.phone,
        code: that.data.code,
        borrowerId: app.globalData.userInfo.id
      }).then(res => {

        if (res.data.status === 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
          wx.redirectTo({
            url: '/pages/borrower/pages/loans/loans',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          that.qingKong()
        }
      })
    } else {
      //未登录的
      fetch.post(`/orderAll/saveNoLoginOrder`, {
        borrowerName: that.data.name,
        borrowerSex: that.data.sexValue,
        loanAmount: that.data.money,
        address1: that.data.pid,
        address2: that.data.rcid,
        phone: that.data.phone,
        code: that.data.code,
      }).then(res => {

        if (res.data.status === 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
          //登录
          that.login()

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          that.qingKong()
        }
      })

    }



  },
  checkKong() {
    let that = this
    if (that.data.name == '') {
      wx.showModal({
        title: '提示',
        content: '姓名不能为空',
        success(res) {
          if (res.confirm) {

          }
        }
      })
    } else if (that.data.money == '') {
      wx.showModal({
        title: '提示',
        content: '贷款金额不能为空',
        success(res) {
          if (res.confirm) {

          }
        }
      })
    } else if (that.data.phone == '') {
      wx.showModal({
        title: '提示',
        content: '手机号不能为空',
        success(res) {
          if (res.confirm) {

          }
        }
      })
    } else if (that.data.code == '') {
      wx.showModal({
        title: '提示',
        content: '验证码不能为空',
        success(res) {
          if (res.confirm) {

          }
        }
      })
    } else {
      return
    }
  },
  checkPhoneRe() {
    let that = this
    that.checkKong()
    fetch.get(`/user/checkUserByPhone/${that.data.phone}`).then(res => {
      if (res.data.status === 500) {
        //已经注册过该平台
        that.submit()

      } else {
        //没有注册过该平台
        that.submitN()
      }

    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.request({
      url: 'https://www.rjkf001.com/session/getSessionId',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        wx.setStorageSync('sessionId', 'JSESSIONID=' + res.data)

      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  }
})