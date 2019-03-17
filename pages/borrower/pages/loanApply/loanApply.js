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
    ageIndex: '0', // 年龄索引
    jobIndex:'0',  //职业索引
    incomeIndex:'0',//月收入索引
    
    pid: '1',
    phone:'',
    code:'',
    textCode:'发送验证码',
    sex: [
      { name: '男', value: '1', checked: 'true' },
      { name: '女', value: '0' },
    ],
    provinceData: [],
    cityData:
      [
        { cid: '', city: '' }
      ],
    types: [
      { name: '个人贷', value: 0, icon:'iconfont icon-geren'},
      { name: '企业贷', value: 1, icon:'iconfont icon-qiyecopy'}
    ],
    hasPawn:false ,       // 有无抵押状态
    pawns:[
      { name: '无抵押', value: 0, checked: true, icon: 'iconfont icon-wudiya'},
      { name: '有抵押', value: 1, icon:'iconfont icon-diyadaikuan'}
    ],
    checkboxs: [
      {value: 2, name: '车子'},
      { value: 3, name: '有价证券'},
      { value: 4, name: '古董珠宝'},
      {value: 5, name: '房子'},
      {value: 6, name: '其他'}
    ],
    //年龄
    ages:[
      {
        id: '',
        ageArea: '',
      }
    ],
    incomes: [
      {
        id: '',
        incomeName: ''
      }
    ],
    jobs:[
      {
        jobId: '',
        jobName: '',
      }
    ],

    sex: [
      {value: 0, name: '女'},
      {value: 1, name: '男'}
    ]
  },
// 省选择框 选择事件
  bindPickerChange(e) {
    let pindex = e.detail.value
    let pid = this.data.provinceData[pindex].pid
    this.setData({
      pindex,
      pid
    })
    console.log(this.data.pindex)
    this.getCity(pid)
  },
  // 市选择框 选择事件
  bindPickerRight(e) {
    let rindex = e.detail.value
    let rcid = this.data.cityData[rindex].cid
    this.setData({
      rindex,
    })
  },
  //年龄
  bindAgeChange(e){
    let ageIndex = e.detail.value
    let ageid = this.data.ages[ageIndex].id

    this.setData({
      ageIndex,
      ageid
    })
  },
  //职业
  bindJobChange(e){
    let jobIndex = e.detail.value
    let jobId = this.data.jobs[jobIndex].jobId

    this.setData({
      jobIndex,
      jobId
    })
  },

  //月收入
  bindIncomeChange(e){
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
    console.log('phoe', this.data.phone)
  },
  handleCode(e) {
    this.setData({
      code: e.detail.value
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
      sex
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
      types
    })
  },
  //抵押改变事件
  pawnsChange(e){
    let value = e.detail.value
    let hasPawn = value == 0 ? false : true 
    console.log(hasPawn)
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
      hasPawn
    })
  },
  // checkbox 改变事件
  checkboxChange(e) {
    let value = e.detail.value
    console.log(value)
    let checkboxs = this.data.checkboxs.map((item) => {
      let val = item.value + ""
      if (value.indexOf(val) > -1) {
        item.checked = true
      } else {
        item.checked = false
      }
      return item
    })
    this.setData({
      checkboxs
    })
  },
  //发送验证码
  sendCode() {
    if (this.data.phone) {
      fetch.get(`/user/selectPhone/${this.data.phone}`).then(res => {
        console.log('checkphone', res)
        if (res.data.status === 500) {
          wx.showToast({
            title: '手机号未注册',
            icon: 'none'
          })


        } else {
          //发送验证码
          fetch.get(`/base/getLoginCode/${this.data.phone}`).then(res => {
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

  getAge(){
    fetch.get(`/age/getAllAgeArea`).then(res=>{
      this.setData({
        ages:res.data
      })
      console.log(this.data.ages)
    })
  },
  getJob(){
    fetch.get(`/get/getJob`).then(res => {
      this.setData({
        jobs: res.data
      })
      console.log(this.data.jobs)
    })
  },

  getMonthMoney(){
    fetch.get(`/get/getIncome`).then(res => {
      this.setData({
        incomes: res.data
      })
      console.log(this.data.incomes)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    template.tabbar("tabBar", 0, this, app.globalData.userType)//0表示第一个tabbar
    this.getProvince()
    this.getCity(this.data.pid)
    this.getAge()
    //职业
    this.getJob()
    //月收入
    this.getMonthMoney()

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