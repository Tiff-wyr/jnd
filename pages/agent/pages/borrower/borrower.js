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
    tableData: [],
    index: 0,
    id: 0,
    indexZ: 1,
    idZ: 2,
    indexM: 0,
    idM: 0,
    page: 1,
    size: 10,

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
  handlerClickDetail(event) {
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
      fetch.get(`/userBorrower/wxGetBor/${this.data.id}/1/${this.data.idM}/1/10
`).then(res => {
        this.setData({
          tableData: res.data.list
        })

      })
    } else {
      //最热
      fetch.get(`/userBorrower/wxGetBor/${this.data.id}/2/${this.data.idM}/1/10
`).then(res => {
        this.setData({
          tableData: res.data.list
        })

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
    wx.showNavigationBarLoading();

    if (this.data.idZ === '1') {
      //最新
      fetch.get(`/userBorrower/wxGetBor/${this.data.id}/1/${this.data.idM}/1/10
`).then(res => {
        this.setData({
          tableData: res.data.list
        })
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();

      })
    } else {
      //最热
      fetch.get(`/userBorrower/wxGetBor/${this.data.id}/2/${this.data.idM}/1/10
`).then(res => {
        this.setData({
          tableData: res.data.list
        })
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();

      })

    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showLoading({
      title: '玩命加载中',
    })
    this.setData({
      page: this.data.page + 1
    })

    if (this.data.idZ === '1') {
      //最新
      fetch.get(`/userBorrower/wxGetBor/${this.data.id}/1/${this.data.idM}/${this.data.page}/${this.data.size}
`).then(res => {
        let newArr = [...this.data.tableData, ...res.data.list]
        this.setData({
          tableData: newArr
        })
        wx.hideLoading();


      })
    } else {
      //最热
      fetch.get(`/userBorrower/wxGetBor/${this.data.id}/2/${this.data.idM}/${this.data.page}/${this.data.size}
`).then(res => {
        let newArr = [...this.data.tableData, ...res.data.list]
        this.setData({
          tableData: newArr
        })
        wx.hideLoading();

      })

    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})