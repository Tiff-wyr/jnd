// borrower/pages/loanApply/loanApply.js
const app = getApp()
var template = require('../../../../components/tabBar/index.js');
import { fetch } from "../../../../utils/axios.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pindex: '0',    // 省索引
    rindex: '0',    // 市索引

    


    textCode:'发送验证码',

    provinceData: [],
    cityData:
      [
        { cid: '', city: '' }
      ],

    sex: [
      {value: 0, name: '女'},
      { value: 1, name: '男', checked:true}
    ],
    //提交参数
    pid: 1,
    rcid:2,
    phone: '',
    code: '',
    money:'',
    name:'',
    sexValue:1
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
  handleMoney(e){
    this.setData({
      money: e.detail.value
    })
  },
  handleName(e){
    this.setData({
      name: e.detail.value
    })
  },
  // 性别按钮改变事件
  sexRadioChange(e) {
    let value = e.detail.value
    this.setData({
      sexValue:value
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
    if (this.data.phone) {
     
          //发送验证码
      fetch.get(`/base/getUpdatePhoneCode/${this.data.phone}`).then(res => {
           console.log('mmmm',res.data)
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
      
    } else {
      wx.showToast({
        title: '不能为空',
        icon: 'none'
      })
    }
  },
  //获取 省
  getProvince() {
    fetch.get(`/city/getAllProvincial`).then(res => {
      console.log('省', res.data)
      this.setData({
        provinceData: res.data
      })
    })
  },

  //获取 市
  getCity(id) {
    fetch.get(`/city/getAllCity/${id}`).then(res => {
      console.log('市', res.data)
      this.setData({
        cityData: res.data
      })
    })
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    template.tabbar("tabBar", 0, this, app.globalData.userType)//0表示第一个tabbar
    this.getProvince()
    this.getCity(this.data.pid)
   

  },

  submit(){
    fetch.post(`/orderPublic/createPublicOrder`,{
      borrowerName:this.data.name,
      borrowerSex:this.data.sexValue,
      loanAmount:this.data.money,
      address1:this.data.pid,
      address2:this.data.rcid,
      phone:this.data.phone,
      code:this.data.code
    }).then(res=>{
      console.log('aaa',res.data)
      if(res.data.status === 200){
        wx.showToast({
          title: '申请成功',
          icon: 'success',
          duration: 2000
        })
      }
      else{
        wx.showToast({
          title: '申请失败',
          icon: 'none',
          duration: 2000
        })
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