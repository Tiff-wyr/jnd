// borrower/pages/loans/loans.js
const app = getApp()
var template = require('../../../../components/tabBar/index.js');
import { fetch } from "../../../../utils/axios.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: '1',
    index: '1',
    cityid: '1',
    indexZ: '0',
    idZ: '1',
    indexSearch:'0',// 搜索索引
    idSearch:'1',

    searchContent:'',

    pageAgent: 1,
    pageSizeAgent: 1000,
    pageOrgan: 1,
    pageSizeOrgan: 1000,
    pagePro: 1,
    pageSizePro: 1000,
    array: [{
      hid: '1',
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
      },
    ],
    searchCon:[
 
      {
        id: 1,
        name: '经纪人'
      },
      {
        id: 2,
        name: '机构'
      },
      {
        id: 3,
        name: '产品'
      },
    ],
    agentData: [],
    organData: [],
    proData: []
  },

  getCity() {
    fetch.get(`/city/getAHotCity`).then(res => {

      this.setData({
        array: res.data
      })
    
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    template.tabbar("tabBar", 1, this, app.globalData.userType) //0表示第一个tabbar
    this.getCity()
    this.getTable()
  

  },

  /**
   * 选择框change事件
   */

  //城市选择

  bindPickerChange(e) {
    let index = e.detail.value
    let cityid = this.data.array[index].hid
    this.setData({
      index,
      cityid
    })
    this.getTable()
  },
  //最新 最热
  bindPickerZui(e) {
    let indexZ = e.detail.value
    let idZ = this.data.arr[indexZ].id
    this.setData({
      indexZ,
      idZ
    })
    this.getTable()
  },

  hanCon(e){
   let con=e.detail.value
   this.setData({
     searchContent : con
   })
    this.getSorl(this.data.idSearch)

  },
  
//搜索内容
  bindPickerSearch(e){
    let indexSearch = e.detail.value
    let idSearch = this.data.searchCon[indexSearch].id
    console.log('dd',idSearch)
    this.setData({
      indexSearch,
      idSearch
    })
    this.getSorl(this.data.idSearch)
  },

  getSorl(id){
    if (this.data.searchContent){
      if (id === 1) {
        //经纪人
        fetch.get(`/solr/getPageUserBrokerNoHighLight?q=${this.data.searchContent}&page=1&size=10000`).then(res => {
          console.log('经纪人search', res.data.data)

          this.setData({
            tab: "1"
          })
          this.setData({
            agentData: res.data.data
          })
        })
      } else if (id === 2) {
        //机构
        fetch.get(`/solr/getPageUserAgencyNoHighLight?q=${this.data.searchContent}&page=1&size=10000`).then(res => {
          console.log('机构人search', res.data.data)
          this.setData({
            tab : "2"
          })
          this.setData({
            organData: res.data.data
          })
        })
      } else {
        //产品
        fetch.get(`/solr/getPageProductNoHighLight?q=${this.data.searchContent}&page=1&size=1000`).then(res => {
          console.log('产品search', res.data.data)

          this.setData({
            tab: "3"
          })
          this.setData({
            proData: res.data.data
          })
        })
      }
    }else{
      wx.showModal({
        title: '提示',
        content: '请输入搜索内容',
        success(res) {
          if (res.confirm) {
            console.log('确定')
          } else if (res.cancel) {
            console.log('取消')
          }
        }
      })
    }

  },

  //获取列表
  getTable(){
    if (this.data.tab === '1') {
      if (this.data.idZ === '1') {
        fetch.get(`/userBroker/getPageUserBrokerByNew/${this.data.cityid}/${this.data.pageAgent}/${this.data.pageSizeAgent}
`).then(res => {
  console.log('经纪人最新',res.data)
            this.setData({
              agentData: res.data.rows
            })
          })
      } else {
        fetch.get(`/userBroker/getPageUserBrokerByHot/${this.data.cityid}/${this.data.pageAgent}/${this.data.pageSizeAgent}
`).then(res => {
  console.log('经纪人最热', res.data)
            this.setData({
              agentData: res.data.rows
            })
          })
      }
    } else if (this.data.tab === '2') {
      fetch.get(`/userAgency/wxGetAgency/${this.data.cityid}/${this.data.idZ}/${this.data.pageOrgan}/${this.data.pageSizeOrgan}
`).then(res=>{
  console.log('organ',res.data.list)
  this.setData({
    organData: res.data.list
  })
})
    }else{
      fetch.get(`/product/wxGetPro/${this.data.cityid}/${this.data.idZ}/${this.data.pagePro}/${this.data.pageSizePro}
`).then(res=>{
  console.log('pro',res.data.list)
  this.setData({
    proData: res.data.list
  })
})
    }

  },
  /**
   * tab 选项卡点击事件
   */
  handlerTabClick(e) {
    let tab = e.currentTarget.dataset.id
    this.setData({
      tab
    })
    this.getTable()
    console.log('tab', this.data.tab)
  },
  handleAgent(e) {
    wx.navigateTo({
      url: `/pages/detail/agentDetail/agentDetail?id=${e.currentTarget.dataset.id}`,
    })
  },
  handleOrgan(e) {
    wx.navigateTo({
      url: `/pages/detail/organDetail/organDetail?id=${e.currentTarget.dataset.id}`,
    })
  },
  handlePro(e) {
    console.log('id', e.currentTarget.dataset.id)
    wx.navigateTo({
      url: `/pages/detail/proDetail/productDetail?id=${e.currentTarget.dataset.id}`,
    })
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
  onShareAppMessage: function(options) {
     return {
       imageUrl:'/static/icon/tu.png',
       title:'为您的贷款之路保驾护航'
     }
  }
})