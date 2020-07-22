<template>
  <div style="height:100%;">
    <!-- 背景图片 -->
    <img src="../../../static/images/x.jpg" alt="" class="bgpicture">
    <div class="user clear">
      <!-- 个人背景 -->
      <img src="../../../static/images/bg.png" alt="图片不存在" class="bg">
      <!-- 个人头像 -->
      <img src="../../../static/images/user.jpg" alt="" class="profile" v-if="!getUser.avatarUrl" @click="getTokenState">
      <img :src="getUser.avatarUrl" alt="" class="profile" v-else @click="getTokenState">
      <p class="name" v-if="!getUser.nickName">请先授权</p>
      <p class="name" v-else>{{getUser.nickName}}</p>
      <div class="info clear">
        <div class="gz fl"><a href=""><span>关注</span><span>1</span></a></div>
        <div class="fs fl"><a href=""><span>粉丝</span><span>1</span></a></div>
      </div>
      <div class="login" v-show="!getUser.nickName"><button open-type="getUserInfo" @getuserinfo="getUserInfo">点击授权</button></div>
      <div class="navf">
        <ul class="nav clear">
          <li class="fl zy"><a href=""><span>主页</span></a></li>
          <li class="fl dt"><a href=""><span>动态</span><span></span></a></li>
        </ul>
      </div>
    </div>
    <div class="content clear">
      <song-list :listen = "'听过的歌'"
      :src = "'../../static/tabs/music1.png'"
      :url = "'../../pages/rank/main'"
      :num = "count1"></song-list>
      <song-list :listen = "'我喜欢的音乐'"
      :src = "'../../static/tabs/loveicon.png'"
      :url = "'../../pages/loveSong/main'"
      :num = "count2"></song-list>
    </div>
    <footer-nav></footer-nav>
  </div>
</template>

<script>
import SongList from '../../components/songList'
import FooterNav from '../../components/footerNav'
import Store from '../counter/store'

export default {
  components: {
    'song-list': SongList,
    'footer-nav': FooterNav
  },
  data () {
    return {
      count1: 0,
      count2: 0
    }
  },
  methods: {
    getUserInfo (e) {
      if (e.mp.detail.userInfo) {
        Store.commit('getUserInfo', e.mp.detail.userInfo)
        let { encryptedData, iv, signature, rawData } = e.mp.detail
        mpvue.request({
          url: 'http://localhost:8888/user/',
          data: {
            code: Store.state.code,
            encryptedData,
            iv,
            signature,
            rawData
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }, // header: {}, // 设置请求的 header
          success: function (res) {
            Store.commit('getToken', res.data.token) // success
          },
          fail: function () {
            console.log('获取信息失败')// fail
          }
        })
      } else {
        console.log('s')
      }
    },
    getTokenState () {
      return new Promise((resolve, reject) => {
        mpvue.request({
          url: 'http://localhost:8888/test/',
          data: {},
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'nToken': this.token
          }, // header: {}, // 设置请求的 header
          success: function (res) {
            console.log(res.data.code)
            resolve(res.data.code) // success
          }
        })
      })
    }
  },
  mounted () {
  },
  computed: {
    getUser () {
      return Store.state.userInfo
    },
    token () {
      return Store.state.token
    },
    Times () {
      return Store.state.song_sheet
    }
  },
  watch: {
    token: function () {
      this.getTokenState()
        .then((res) => {
          if (res === '1') {
            console.log('token未过期1')
            mpvue.request({
              url: 'http://localhost:8888/song/',
              data: {},
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nToken': this.token
              }, // 设置请求的 header
              success: function (res) {
                Store.commit('getSongSheet', res.data)// success
              }
            })
          } else {
            console.log('token已过期')
          }
        })
    },
    Times: function () {
      this.count1 = 0
      this.count2 = 0
      for (let i = 0; i < Store.state.song_sheet.length; i++) {
        this.count1 += Store.state.song_sheet[i].listenTimes
      }
      for (let i = 0; i < Store.state.love_song_sheet.length; i++) {
        this.count2 += Store.state.love_song_sheet[i].listenTimes
      }
    }
  }
}
</script>

<style>
  .bgpicture {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 641px;
    filter: blur(10px) brightness(70%);
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .user {
    position: relative;
  }
  .clear::after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .user .bg {
    display: block;
    height: 300px;
    width: 100%;
    z-index: 0;
  }
  .user .profile {
    position: absolute;
    display: block;
    z-index: 1;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    bottom: 130px;
    left: 20px;
  }
  .user .name {
    position: absolute;
    z-index: 1;
    bottom: 90px;
    left: 20px;
    font-size: 17px;
    font-weight: 600;
    color: #fff;
  }
  .info {
    position: absolute;
    bottom: 70px;
    left: 20px;
    color: #fff;
    font-size: 15px;
  }
  .info .gz {
    margin-right: 5px;
    padding-right: 5px;
    border-right: 1px solid white;
  }
  .info .fs {
    margin-left: 10px;
  }
  .info div a span {
    padding-right: 5px;
  }
  .navf {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 45px;
    background-color: rgba(140, 140, 140, 0.8);
    border-radius: 30px 30px 0 0;
  }
  .nav {
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    left: 50%;
    transform: translate(-50%);
    color: #fff;
    width: 100px;
    height: 35px;
  }
  .nav li {
    position: relative;
    width: 50px;
    font-size: 17px;
  }
  .nav li a {
    display: inline-block;
    padding-bottom: 10px;
  }
  .nav .zy:active a {
    border-bottom: 3px solid white;
  }
  .nav .dt:active a {
    border-bottom: 3px solid white;
  }
  .nav .zy {
    right: 70px;
  }
  .nav .dt {
    left: 70px;
  }
  .login {
    position: absolute;
    bottom: 60px;
    right: 20px;
    z-index: 2;
    width: 80px;
  }
  .login button {
    font-size: 12px;
    color: #fff;
    background-color: rgba(60, 60, 60, 0.7);
    transition: all 0.2s;
  }
  .login button:active {
    transform: scale(0.9);
  }
  .content::after {
    content: ' ';
    display: block;
    height: 65px;
    width: 100%;
    clear: both;
  }
</style>
