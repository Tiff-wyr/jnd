const baseUrl = "http://www.9nengdai.com"

/**封装fetch 异步数据请求对象 */
const fetch = {
  http(url, method, data) {
     let token = wx.getStorageSync('token')
    let header = {
      'content-type': 'application/json',
       'token': token
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: baseUrl + url,
        method,
        data,
        header,
        success(res) {
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },
  get(url, data) {
    return this.http(url, 'GET', data)
  },
  post(url, data) {
    return this.http(url, 'POST', data)
  },
  delete(url, data) {
    return this.http(url, 'DELETE', data)
  }
}
/**登录 */
const login = () => {
  wx.login({
    success: function (res) {
      fetch.post('/login', {
        code: res.code,
        appid: 'wx65205bc93e69afb1',
        secret: 'd526afb815ab4d00a6542a991f9c6a4c'
      }).then(res => {
        if (res.header.Token || res.header.token) {
          wx.setStorageSync('token', res.header.Token || res.header.token)
        }
      })
    },
    fail: function (res) { },
    complete: function (res) { },
  })
}
const utils = {
  /**修改时间 为  刚刚 -- 几天前   等等 */
  updateTime(t) {
    let nowTime = +new Date()
    let time = +new Date(t)
    let timeLag = Math.floor((nowTime - time) / 60000)
    let timeStr = ''
    if (timeLag < 1) {
      timeStr = '刚刚'
    } else if (timeLag >= 1 && timeLag < 60) {
      timeStr = timeLag + '分钟前'
    } else if (Math.floor(timeLag / 60) >= 1 && Math.floor(timeLag / 60) < 24) {
      timeStr = Math.floor(timeLag / 60) + '小时前'
    } else if (Math.floor(timeLag / 1440) >= 1 && Math.floor(timeLag / 1440) < 60) {
      timeStr = Math.floor(timeLag / 1440) + '天前'
    } else if (Math.floor(timeLag / 86400) >= 1 && Math.floor(timeLag / 86400) < 12) {
      timeStr = Math.floor(timeLag / 86400) + '月前'
    } else {
      timeStr = '很久很久以前'
    }
    return timeStr
  }
}

exports.utils = utils
exports.login = login
exports.fetch = fetch