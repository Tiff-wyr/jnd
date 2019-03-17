// pages/agent/borrower/borrower.js
const app = getApp()
var template = require('../../../../components/tabBar/index.js');
import {
  fetch
} from "../../../../utils/axios.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tableData: [{
      address  :"北京市东城区",
amount: '',
borrowerId :  '',
borrowerName  : "贷款人30",
logo  : "http://img.softtrade.top/FlnH6nzdJsTG-Ztt-vj2vWKv1Fmz"
      },
    ],
    index: 0,
    id: 0,
    indexZ: 1,
    idZ: 2,
    indexM: 0,
    idM: 0,
    page: 1,
    size: 100,

    arrM: [{
        id: 0,
      amountName: ''
      },

    ],
    array: [{
        hid: 1,
        cname: ''
      }

    ],
    arr: [{
        id: 1,
        name: '最新'
      },
      {
        id: 2,
        name: '最热'
      }
    ]
  },

  getCity() {
    fetch.get(`/city/getAHotCity`).then(res => {

      this.setData({
        array: res.data
      })
      console.log('city', res.data)
    })
  },
  getMoney() {
    fetch.get(`/get/getAmount`).then(res => {

      this.setData({
        arrM: res.data
      })

      console.log('money', res.data)
    })
  },

  //进入贷款人详情页
  handlerClickDetail(event){
    console.log('贷款人详情页id', event.currentTarget.dataset.id)
    wx.navigateTo({
      url: `/pages/detail/borrowerDetail/borrowerDetail?id=${event.currentTarget.dataset.id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    template.tabbar("tabBar", 0, this, app.globalData.userType) //0表示第一个tabbar

    this.getCity()
    this.getMoney()
    this.getTable()
  },
  /**
   * 选择框change事件
   */
  // 城市 选择
  bindPickerChange(e) {
    let index = e.detail.value
    let id = this.data.array[index].hid
    this.setData({
      index,
      id
    })


    this.getTable()


  },
  // 金钱 选择
  bindPickerMon(e) {
    let indexM = e.detail.value
    let idM = this.data.arrM[indexM].id
    this.setData({
      indexM,
      idM
    })

    this.getTable()
  
  },
  // 最新 最热 选择
  bindPickerZui(e) {
    let indexZ = e.detail.value
    let idZ = this.data.arr[indexZ].id
    this.setData({
      indexZ,
      idZ
    })
    this.getTable()
  },

  getTable() {
    if (this.data.idZ === '1') {
      //最新
      fetch.get(`/userBorrower/wxGetBor/${this.data.id}/1/${this.data.idM}/${this.data.page}/${this.data.size}
`).then(res => {
        this.setData({
          tableData: res.data.list
        })
        console.log('最新借款人',this.data.tableData)
      })
    }
     else {
      //最热
      fetch.get(`/userBorrower/wxGetBor/${this.data.id}/2/${this.data.idM}/${this.data.page}/${this.data.size}
`).then(res => {
        this.setData({
          tableData: res.data.list
        })
  console.log('最热借款人', this.data.tableData)
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