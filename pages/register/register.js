// pages/login/passLogin/passLogin.js
import { fetch } from "../../utils/axios.js"
let WebIM = require("../../utils/WebIM")["default"];
Page({

  /**
   * 页面的初始数据
   */
  data: {
     //提交的参数

      phone: '',
      borrowerName: '',
      borrowerSex: 1,
      borrowerAddress: 1,
      borrower2: 2,
      password: '',
      money:'',

    isFa:true,
    text:60,
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
        borrowerSex: value
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
    
    })
  },
  bindPickerChange(e){
    let pindex = e.detail.value
    let pid = this.data.provinceData[pindex].pid
    this.setData({
      pindex,
        borrowerAddress:pid
    })
 
    this.getCity(pid)
  },
  bindPickerRight(e){
    let rindex = e.detail.value
    let rcid = this.data.cityData[rindex].cid
  
    this.setData({
       rindex, 
        borrower2:rcid, 
    })
   
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
        phone: e.detail.value,
    })

  

  },
  handleMoney(e) {
    this.setData({
      money: e.detail.value,
    })
  },
  handleCode(e) {
    this.setData({
        password: e.detail.value
    })
  
  },
  handleName(e){
    this.setData({
        borrowerName : e.detail.value
    })

  },
  //发送验证码
  sendCode() {
    let that =this
    if (that.data.phone) {
      fetch.get(`/user/selectPhone/${that.data.phone}`).then(res => {
     
        if (res.data.status === 200) {
          wx.showToast({
            title: '手机号已注册',
            icon: 'none'
          })


        } else {
          if (that.data.phone && (!(/^[1][345789]\d{9}$/).test(that.data.phone) || !(/^[1-9]\d*$/).test(that.data.phone) || that.data.phone.length !== 11)){
            wx.showToast({
              title: '手机号不规范',
              icon: 'none',
              duration: 2000
            })
         }else{


            //发送验证码
            fetch.get(`/base/getRegisterCode/${that.data.phone}`).then(res => {
           
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
                })
                that.setData({
                  isFa:true,
                  text:60,
                  textCode: '重新发送'
                })
              }
            })
         }

    
        }
      })
    } else {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
    }


  },

  // 注册
  register(){
    let that =this

    fetch.post(`/userBorrower/registerBorrower`,{
      borrowerName: this.data.borrowerName,
      password: this.data.password,
      phone: this.data.phone,
      borrowerSex: this.data.borrowerSex,
      borrowerAddress: this.data.borrowerAddress,
      borrower2: this.data.borrower2,
      loanAmount:this.data.money
    }).then(res=>{
      
   

       if (res.data.status === 200) {
         wx.showToast({
           title: '注册成功',
           icon: 'success',
           duration: 2000
         })
         wx.redirectTo({
           url: '/pages/login/passLogin/passLogin',
         })
       }
       else{
         wx.showToast({
           title: '注册失败',
           icon: 'none',
           duration: 2000,
         })
       }
    })

  },


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