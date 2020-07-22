// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    song: [],
    song_sheet: [],
    love_song_sheet: [],
    songInfo: {
      id: Number,
      url1: '', // 音乐地址
      url2: '', // 图片地址
      name: '', // 歌名
      singer: String, // 歌手
      isLove: false, // 是否喜爱
      num: Number // 听歌次数
    },
    isPlay: false,
    isLove: false,
    code: Number,
    userInfo: {
      avatarUrl: String,
      nickName: String
    },
    token: ''
  },
  mutations: {
    increment: (state) => {
      const obj = state
      obj.count += 1
    },
    decrement: (state) => {
      const obj = state
      obj.count -= 1
    },
    putSong (state, val) {
      let isLove
      for (let i = 0; i < state.song_sheet.length; i++) {
        if (state.song_sheet[i].name === val.name) {
          isLove = state.song_sheet[i].love
          state.isLove = JSON.parse(isLove)
          break
        }
      }
      state.songInfo = val
      for (let i = 0; i < state.song.length; i++) {
        if (state.song[i].name === val.name) {
          state.songInfo.url1 = state.song[i].url1
          state.songInfo.url2 = state.song[i].url2
          break
        }
      }
      state.isPlay = false
      state.isPlay = true
    },
    isLoveIcon (state) {
      state.isLove = !state.isLove
    },
    isPlayIcon (state) {
      state.isPlay = !state.isPlay
    },
    getToken (state, token) {
      state.token = token
    },
    getUserInfo (state, val) {
      state.userInfo.avatarUrl = val.avatarUrl
      state.userInfo.nickName = val.nickName
    },
    getSongSheet (state, sheet) {
      let newSheet = []
      state.song_sheet = sheet
      for (let i = 0; i < sheet.length; i++) {
        if (sheet[i].love === 'true') {
          newSheet.push(sheet[i])
        }
      }
      state.love_song_sheet = newSheet
      console.log(state.song_sheet)
    }
  },
  actions: {
    getSong: (context) => {
      mpvue.request({
        url: 'http://localhost:8888/',
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          for (let i = 0; i < res.data.length; i++) {
            let songInfo = {
              id: Number,
              url1: '', // 音乐地址
              url2: '', // 图片地址
              name: String, // 歌名
              singer: String, // 歌手
              num: Number // 听歌次数
            }
            songInfo.id = res.data[i].id
            songInfo.url1 = res.data[i].url1
            songInfo.url2 = res.data[i].url2
            songInfo.name = res.data[i].name
            songInfo.singer = res.data[i].singer
            songInfo.num = res.data[i].num
            context.state.song.push(songInfo)// success
          }
        },
        fail: function () {
          console.log('err')// fail
        }
      })
    },
    upSong (context) {
      mpvue.request({
        url: 'http://localhost:8888/test/',
        data: {},
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'nToken': context.state.token
        }, // 设置请求的 header
        success: function (res) {
          if (res.data.code === '1') {
            mpvue.request({
              url: 'http://localhost:8888/upSong/',
              data: {
                name: context.state.songInfo.name,
                singer: context.state.songInfo.singer,
                love: context.state.isLove
              },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nToken': context.state.token
              }, // 设置请求的 header
              success: function (res) {
                console.log('upSong=' + res.data)
                context.commit('getSongSheet', res.data)// success
              }
            })
          }// success
        }
      })
    }
  }
})

export default store
