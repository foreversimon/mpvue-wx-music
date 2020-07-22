<script>
import Store from './pages/counter/store'
export default {
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */
    let logs
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({key: 'logs'}).data || []
      logs.unshift(Date.now())
      mpvue.setStorageSync({
        key: 'logs',
        data: logs
      })
    } else {
      logs = mpvue.getStorageSync('logs') || []
      logs.unshift(Date.now())
      mpvue.setStorageSync('logs', logs)
    }
    // 开机登陆
    mpvue.login({
      success: (res) => {
        if (res.code) {
          Store.state.code = res.code
          this.wxGetUserInfo(res.code)
        }
      },
      fail: function () {
        console.log('login fail')// fail
      }
    })
    mpvue.getSetting({
      success (res) {
        if (res.authSetting['scope.userInfo']) {
          mpvue.getUserInfo({
            success: (res) => {
              Store.commit('getUserInfo', res.userInfo)
            }
          })
        }
      }
    })
  },
  methods: {
    wxGetUserInfo (code) {
      mpvue.getUserInfo({
        withCredentials: true,
        success: function (res) {
          let { encryptedData, iv, signature, rawData } = res
          mpvue.request({
            url: 'http://localhost:8888/user/',
            data: {
              encryptedData,
              code,
              iv,
              signature,
              rawData
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res.data)
              Store.commit('getToken', res.data.token)// success
            }
          })// success
        },
        fail: function () {
          console.log('获取用户数据失败,需授权')// fail
        }
      })
    }
  },
  log () {
    console.log(`log at:${Date.now()}`)
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
</style>
