// borrower/pages/loanApply/loanApply.js
const app = getApp()

import {
  fetch
} from "../../utils/axios.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pindex: '0', // 省索引
    rindex: '0', // 市索引
    ageIndex: '0', // 年龄索引
    jobIndex: '0', //职业索引
    incomeIndex: '0', //月收入索引
    roleId: '', //向经纪人或机构申请

    isFa: true,
    text: 60,
    textCode: '发送验证码',

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
    provinceData: [],
    cityData: [{
      cid: '',
      city: ''
    }],
    types: [{
        name: '个人贷',
        value: 0,
        checked: true,
        icon: 'iconfont icon-geren'
      },
      {
        name: '企业贷',
        value: 1,
        icon: 'iconfont icon-qiyecopy'
      }
    ],
    hasPawn: false, // 有无抵押状态
    pawns: [{
        name: '无抵押',
        value: 0,
        checked: true,
        icon: 'iconfont icon-wudiya'
      },
      {
        name: '有抵押',
        value: 1,
        icon: 'iconfont icon-diyadaikuan'
      }
    ],
    checkboxs: [{
        value: 2,
        name: '车子'
      },
      {
        value: 3,
        name: '有价证券'
      },
      {
        value: 4,
        name: '古董珠宝'
      },
      {
        value: 5,
        name: '房子'
      },
      {
        value: 6,
        name: '其他'
      }
    ],
    //年龄
    ages: [{
      id: '',
      ageArea: '',
    }],
    incomes: [{
      id: '',
      incomeName: ''
    }],
    jobs: [{
      jobId: '',
      jobName: '',
    }],

    //提交的参数
    pid: 1, //省的id
    rcid: 1, //市 id
    ageid: 1, //年龄id
    jobId: 0, //职业id
    incomeId: 1, //月收入 id
    phone: '', //手机号
    code: '', //验证码
    value: 1, //性别
    name: '', //名字
    money: '', //贷款金额
    pawn: 0, //是否抵押
    loanType: 1, //贷款类型
    pawnKey: '', //抵押物

    userId: '', //借款人id
    agentId: '', //经纪人id
    organId: '', //机构id



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
  //年龄
  bindAgeChange(e) {
    let ageIndex = e.detail.value
    let ageid = this.data.ages[ageIndex].id

    this.setData({
      ageIndex,
      ageid
    })
  },
  //职业
  bindJobChange(e) {
    let jobIndex = e.detail.value
    let jobId = this.data.jobs[jobIndex].jobId

    this.setData({
      jobIndex,
      jobId
    })
  },

  //月收入
  bindIncomeChange(e) {
    let incomeIndex = e.detail.value
    let incomeId = this.data.incomes[incomeIndex].id

    this.setData({
      incomeIndex,
      incomeId
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
  handleName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  handleMoney(e) {
    this.setData({
      money: e.detail.value
    })
  },

  // 性别按钮改变事件
  sexRadioChange(e) {
    let value = e.detail.value

    let sex = this.data.sex.map((item) => {
      if (item.value == value) {
        item.checked = true
      } else {
        item.checked = false
      }
      return item
    })
    this.setData({
      sex,
      value
    })
  },
  //  贷款方式types改变事件
  typesChange(e) {
    let value = e.detail.value
    let types = this.data.types.map((item) => {
      if (item.value == value) {
        item.checked = true
      } else {
        item.checked = false
      }
      return item
    })
    this.setData({
      types,
      loanType: value
    })
  },
  //抵押改变事件
  pawnsChange(e) {
    let value = e.detail.value
    let hasPawn = value == 0 ? false : true
    if (hasPawn) {
      this.setData({
        ageid: '', //年龄id
        jobId: '', //职业id
        incomeId: ''
      })
    } else {
      this.setData({
        pawnKey: '',
        checkboxs: [{
            value: 2,
            name: '车子'
          },
          {
            value: 3,
            name: '有价证券'
          },
          {
            value: 4,
            name: '古董珠宝'
          },
          {
            value: 5,
            name: '房子'
          },
          {
            value: 6,
            name: '其他'
          }
        ]
      })
    }

    let pawns = this.data.pawns.map((item) => {
      if (item.value == value) {
        item.checked = true
      } else {
        item.checked = false
      }
      return item
    })
    this.setData({
      pawns,
      hasPawn,
      pawn: value
    })
  },
  // checkbox 改变事件
  checkboxChange(e) {
    let value = e.detail.value
    value = value.map(item => {
      return parseInt(item)
    })


    let checkboxs = this.data.checkboxs.map((item) => {
      let val = item.value
      if (value.indexOf(val) > -1) {
        item.checked = true
      } else {
        item.checked = false
      }
      return item
    })

    this.setData({
      checkboxs,
      pawnKey: value
    })
  },

  sendPass() {
    let that = this
    fetch.get(`/user/selectIsRegister/${that.data.phone}`).then(res => {

      if (res.data.status === 200) {
        //发送验证码
        fetch.get(`/base/getUpdatePhoneCode/${that.data.phone}`).then(res => {

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
              textCode: '重新发送'
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
  },

  //发送验证码
  sendCode() {
    let that = this
    if (that.data.phone) {
      if (that.data.roleId === 2) {
        fetch.get(`/orderAll/getOrderByBTBid/${that.data.phone}/${that.data.agentId}`).then(res => {
          console.log('agent', res)
          if (res.data.status === 200) {
            that.sendPass()
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            that.qingKong()
          }
        })
      } else {
        fetch.get(`/orderAll/getOrderByBTAid/${that.data.phone}/${that.data.organId}`).then(res => {

          if (res.data.status === 200) {
            that.sendPass()
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            that.qingKong()
          }
        })
      }



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


  getAge() {
    fetch.get(`/age/getAllAgeArea`).then(res => {
      this.setData({
        ages: res.data
      })

    })
  },
  getJob() {
    fetch.get(`/get/getJob`).then(res => {
      this.setData({
        jobs: res.data
      })

    })
  },

  getMonthMoney() {
    fetch.get(`/get/getIncome`).then(res => {
      this.setData({
        incomes: res.data
      })

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if (app.globalData.userInfo) {
      this.setData({
        userId: app.globalData.userInfo.id,
      })
    }



    if (options.roleId == 2) {
      //借款人向经纪人申请
      this.setData({
        roleId: 2,
        agentId: options.id
      })
    } else {
      //借款人向机构申请
      this.setData({
        roleId: 3,
        organId: options.id
      })
    }

    this.getProvince()
    this.getCity(this.data.pid)
    this.getAge()
    //职业
    this.getJob()
    //月收入
    this.getMonthMoney()

  },

  qingKong() {
    this.setData({
      pindex: '0', // 省索引
      rindex: '0', // 市索引
      ageIndex: '0', // 年龄索引
      jobIndex: '0', //职业索引
      incomeIndex: '0', //月收入索引
      phone: '', //手机号
      code: '', //验证码
      name: '', //名字
      money: '', //贷款金额
      text: 60,
      isFa: true,
      textCode: '发送验证码',
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
      types: [{
          name: '个人贷',
          value: 0,
          checked: true,
          icon: 'iconfont icon-geren'
        },
        {
          name: '企业贷',
          value: 1,
          icon: 'iconfont icon-qiyecopy'
        }
      ],
      pawns: [{
          name: '无抵押',
          value: 0,
          checked: true,
          icon: 'iconfont icon-wudiya'
        },
        {
          name: '有抵押',
          value: 1,
          icon: 'iconfont icon-diyadaikuan'
        }
      ],
      checkboxs: [{
          value: 2,
          name: '车子'
        },
        {
          value: 3,
          name: '有价证券'
        },
        {
          value: 4,
          name: '古董珠宝'
        },
        {
          value: 5,
          name: '房子'
        },
        {
          value: 6,
          name: '其他'
        }
      ],
    })
  },

  agentApply() {
    let that = this

    fetch.post(`/orderAll/saveLoginOrder`, {

      brokerId: this.data.agentId,
      borrowerName: this.data.name,
      sex: this.data.value,
      loanAmount: this.data.money,
      address1: this.data.pid,
      address2: this.data.rcid,
      loanType: this.data.loanType,
      isPawn: this.data.pawn,
      pawnKey: this.data.pawnKey.toString(),
      age: this.data.ageid,
      borrowerJob: this.data.jobId,
      borrowerMonthlyIncome: this.data.incomeId,
      borrowerId: this.data.userId,
      phone: this.data.phone,
      code: this.data.code

    }).then(res => {

      if (res.data.status === 200) {
        wx.showToast({
          title: "恭喜您申请成功",
          icon: 'success',
          duration: 2000,
        })
        that.qingKong()

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

  organApply() {
    let that = this
    fetch.post(`/orderAll/saveLoginOrder`, {

      agencyId: this.data.organId,
      borrowerName: this.data.name,
      borrowerSex: this.data.value,
      loanAmount: this.data.money,
      borrowerAddress: this.data.pid,
      borrower2: this.data.rcid,
      loanType: this.data.loanType,
      mortgage: this.data.pawn,
      collateral: this.data.pawnKey.toString(),
      age: this.data.ageid,
      job: this.data.jobId,
      income: this.data.incomeId,
      borrowerId: this.data.userId,
      phone: this.data.phone,
      password: this.data.code

    }).then(res => {


      if (res.data.status === 200) {
        wx.showToast({
          title: "恭喜您申请成功",
          icon: 'success',
          duration: 2000
        })
        that.qingKong()
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

  applySubmit() {
    if (this.data.name) {
      if (this.data.money) {
        if (this.data.phone) {
          if (this.data.code) {


            if (this.data.roleId == 2) {
              this.agentApply()
            } else {
              this.organApply()
            }


          } else {
            wx.showModal({
              title: '提示',
              content: '请输入验证码',
              success(res) {
                if (res.confirm) {

                } else if (res.cancel) {

                }
              }
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '请输入手机号',
            success(res) {
              if (res.confirm) {

              } else if (res.cancel) {

              }
            }
          })
        }
      } else {
        wx.showModal({
          title: '提示',
          content: '请输入金额',
          success(res) {
            if (res.confirm) {

            } else if (res.cancel) {

            }
          }
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
        success(res) {
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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