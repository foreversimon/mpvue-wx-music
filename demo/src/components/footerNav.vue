<template>
  <div class="footer clear">
    <div class="songImg" v-if="getSongInfo.url2"><img :src="getSongInfo.url2" alt=""></div>
    <div class="songImg" v-else><img src="../../static/tabs/music.png" alt=""></div>
    <div class="musicInfo">
      <p class="musicTitle" v-if="getSongInfo.name">{{getSongInfo.name}}</p>
      <p class="musicTitle" v-else>歌名</p>
      <p class="musicLyric" v-if="getSongInfo.singer">{{getSongInfo.singer}}</p>
      <p class="musicLyric" v-else>歌手</p>
    </div>
    <div class="love" @click="onLove">
      <img :src="getLoveIcon" alt="">
      <!-- <img src="../../static/tabs/love.png" alt="" v-else> -->
    </div>
    <div class="play" @click="onPlay">
      <img :src="getPlayIcon" alt="">
      <!-- <img src="../../static/tabs/play.png" alt="" v-else> -->
    </div>
  </div>
</template>

<script>
import Store from '../pages/counter/store'

export default {
  data () {
    return {
    }
  },
  methods: {
    onLove () {
      if (this.getToken) {
        if (this.getSongInfo.name !== '') {
          Store.commit('isLoveIcon')
          Store.dispatch('upSong')
        }
      }
    },
    onPlay () {
      Store.commit('isPlayIcon')
    }
  },
  computed: {
    getSongInfo () {
      return Store.state.songInfo
    },
    getPlayIcon () {
      if (Store.state.isPlay) {
        return '../../static/tabs/stop.png'
      } else {
        return '../../static/tabs/play.png'
      }
    },
    getLoveIcon () {
      if (JSON.parse(Store.state.isLove)) {
        return '../../static/tabs/love-active.png'
      } else {
        return '../../static/tabs/love.png'
      }
    },
    getToken () {
      return Store.state.token
    }
  }
}
</script>

<style scoped>
  .footer {
    position: fixed;
    height: 65px;
    width: 100%;
    bottom: 0px;
    background-color: rgba(60, 60, 60, 0.4);
    color: white;
  }
  .footer div {
    float: left;
  }
  .songImg img {
    position: relative;
    margin-top: 12.5px;
    margin-left: 10px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .musicInfo {
    position: relative;
    margin-top: 10px;
    margin-left: 10px;
  }
  .musicInfo .musicTitle {
    font-size: 17px;
    font-weight: 550;
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
  }
  .musicInfo .musicLyric {
    font-size: 15px;
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
  }
  .footer .play {
    float: right;
    margin-right: 20px;
    margin-top: 17.5px;
  }
  .play img {
    width: 30px;
    height: 30px;
  }
  .footer .love {
    float: right;
    margin-top: 17.5px;
    margin-right: 20px;
  }
  .love img {
    width: 30px;
    height: 30px;
  }
</style>
