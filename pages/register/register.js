// pages/login/passLogin/passLogin.js
import { fetch } from "../../utils/axios.js"
let WebIM = require("../../utils/WebIM")["default"];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      phone: '',
      borrowerName: '',
      borrowerSex: 1,
      borrowerAddress: '',
      borrower2: '',
      password: '',
    },


    textCode: '发送验证码',
    sex:[
      { name: '男', value: '1', checked: 'true' },
      { name: '女', value: '0'},
    ],
    pindex: '0',
    pid: '1',
    rindex:'0',
    rcid:'',

    provinceData:[
      { pid: '', provincial:''}
    ],
    cityData:
    [
        { cid:'',city:''}
    ]
  },

  radioChange(e){
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  //获取 省
  getProvince(){
    fetch.get(`/city/getAllProvincial`).then(res=>{
      this.setData({
        provinceData:res.data
      })
    })
  },
  // 性别按钮改变事件
  sexRadioChange(e) {
    let value = e.detail.value
    this.setData({
      form: {
        borrower2: this.data.form.borrower2,
        borrowerAddress: this.data.form.borrowerAddress,
        phone: this.data.form.phone,
        borrowerName: this.data.form.borrowerName,
        borrowerSex: value,
        password: this.data.form.password,
      }
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

  //获取 市
  getCity(id){
    fetch.get(`/city/getAllCity/${id}`).then(res=>{
      this.setData({
        cityData: res.data
      })
      console.log(res.data)
    })
  },
  bindPickerChange(e){
    let pindex = e.detail.value
    let pid = this.data.provinceData[pindex].pid
    this.setData({
      pindex,
      form: {
        borrowerAddress:pid,
        phone: this.data.form.phone,
        borrowerName: this.data.form.borrowerName,
        borrowerSex: this.data.form.borrowerSex,
       
        borrower2: this.data.form.borrower2,
        password: this.data.form.password,

      }
    })
    console.log(this.data.form)
    this.getCity(pid)
  },
  bindPickerRight(e){
    let rindex = e.detail.value
    let rcid = this.data.cityData[rindex].cid
    console.log('cid',rcid)
    this.setData({
      rindex,
      form:{
        borrower2:rcid,
        borrowerAddress: this.data.form.borrowerAddress ,
        phone: this.data.form.phone,
        borrowerName: this.data.form.borrowerName,
        borrowerSex: this.data.form.borrowerSex,
        password: this.data.form.password,
      }
   
    })
    console.log(this.data.form)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getProvince()
     this.getCity(this.data.pid)
  },
  msgLogin() {
    wx.navigateTo({
      url: '/pages/login/passLogin/passLogin',
    })
  },


  handlePhone(e) {
    this.setData({
      form: {
        phone: e.detail.value,
        borrowerName: this.data.form.borrowerName,
        borrowerSex: this.data.form.borrowerSex,
        borrowerAddress: this.data.form.borrowerAddress,
        borrower2: this.data.form.borrower2 ,
        password: this.data.form.password,
      }
    })

    console.log(this.data.form)

  },
  handleCode(e) {
    this.setData({
      form: {
        password: e.detail.value,
        phone: this.data.form.phone,
        borrowerName: this.data.form.borrowerName,
        borrowerSex: this.data.form.borrowerSex,
        borrowerAddress: this.data.form.borrowerAddress,
        borrower2: this.data.form.borrower2,
     
      }
    })
    console.log(this.data.form)
  },
  handleName(e){
    this.setData({
      form: {
        borrowerName : e.detail.value,
        password: this.data.form.password,
        phone: this.data.form.phone,
      
        borrowerSex: this.data.form.borrowerSex,
        borrowerAddress: this.data.form.borrowerAddress,
        borrower2: this.data.form.borrower2,

      }
    })
    console.log(this.data.form)
  },
  //发送验证码
  sendCode() {
    if (this.data.form.phone) {
      fetch.get(`/user/selectPhone/${this.data.form.phone}`).then(res => {
        console.log('checkphone', res)
        if (res.data.status === 200) {
          wx.showToast({
            title: '手机号已注册',
            icon: 'none'
          })


        } else {
          if (this.data.form.phone && (!(/^[1][345789]\d{9}$/).test(this.data.form.phone) || !(/^[1-9]\d*$/).test(this.data.form.phone) || this.data.form.phone.length !== 11)){
            wx.showToast({
              title: '手机号不规范',
              icon: 'none',
              duration: 2000
            })
         }else{


            //发送验证码
            fetch.get(`/base/getRegisterCode/${this.data.form.phone}`).then(res => {
              console.log('fs', res.data)
              if (res.data.status === 200) {
                this.setData({
                  textCode: '已发送'
                })
              } else {
                this.setData({
                  textCode: '重新发送'
                })
              }
            })
         }

    
        }
      })
    } else {
      wx.showToast({
        title: '不能为空',
        icon: 'none'
      })
    }


  },

  // 注册
  register(){
    // let data = new FormData()
    // for (let item in this.form) {
    //   data.append(item, this.form[item])
    // }
    // fetch.post(`/userBorrower/registerBorrower`,data).then(res=>{
    //   console.log('sss',res)
    // })

    wx.request({
      url: 'https://www.rjkf001.com/userBorrower/registerBorrower', // 仅为示例，并非真实的接口地址
      data: {
        borrowerName: this.data.form.borrowerName,
        password: this.data.form.password,
        phone: this.data.form.phone,
        borrowerSex: this.data.form.borrowerSex,
        borrowerAddress: this.data.form.borrowerAddress,
        borrower2: this.data.form.borrower2,
      },
      method:'post',

      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      success(res) {
        console.log(res.data)
      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.request({
      url: 'https://www.rjkf001.com/session/getSessionId',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.setStorageSync('sessionId', 'JSESSIONID=' + res.data)

      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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