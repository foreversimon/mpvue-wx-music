<template>
  <div>
    <!-- 背景图 -->
    <img src="../../../static/images/x.jpg" alt="" class="bgpicture">
    <!-- 轮播图 -->
    <swiper class='lunbo' indicator-dots='true' autoplay='true' interval='4000'>
      <swiper-item><img src="../../../static/images/img1.jpg" alt=""></swiper-item>
      <swiper-item><img src="../../../static/images/img2.jpg" alt=""></swiper-item>
      <swiper-item><img src="../../../static/images/img3.jpg" alt=""></swiper-item>
      <swiper-item><img src="../../../static/images/img4.png" alt=""></swiper-item>
    </swiper>
    <!-- 工具栏 -->
    <div class="undefine">
      <sm-block></sm-block>
      <sm-block></sm-block>
      <sm-block></sm-block>
      <sm-block></sm-block>
      <sm-block></sm-block>
    </div>
    <!-- 歌曲方块 -->
    <div class="blockSong">
      <block-song v-for="(item, index) in getSongList" :key="index" :item="item"></block-song>
    </div>
    <!-- 底部播放栏 -->
    <footer-nav></footer-nav>
  </div>
</template>

<script>
import FooterNav from '../../components/footerNav'
import BlockSong from '../../components/blockSong'
import SmBlock from '../../components/smBlock'
import Store from '../counter/store'

export default {
  components: {
    'footer-nav': FooterNav,
    'block-song': BlockSong,
    'sm-block': SmBlock
  },
  methods: {

  },
  computed: {
    getSongList () {
      console.log(Store.state.song)
      return Store.state.song
    },
    getSongInfoState () {
      return Store.state.songInfo
    },
    getPlayState () {
      return Store.state.isPlay
    }
  },
  beforeCreate () {
    Store.dispatch('getSong')
  },
  created () {
    this.audioCtx = mpvue.createInnerAudioContext()
    this.audioCtx.onPlay(() => {
      console.log('开始播放')
    })
    this.audioCtx.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    this.audioCtx.onEnded(() => {
      Store.state.isPlay = false
    })
  },
  destroyed () {
    this.audioCtx.destroy()
  },
  watch: {
    getSongInfoState: function (newVal, oldVal) {
      console.log('chufa')
      this.audioCtx.stop()
      this.audioCtx.src = newVal.url1
      if (Store.state.isPlay === true) {
        this.audioCtx.play()
      } else {
        this.audioCtx.pause()
      }
    },
    getPlayState: function (newVal, oldVal) {
      if (newVal === true) {
        this.audioCtx.play()
      } else {
        this.audioCtx.pause()
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
  .lunbo {
    position: relative;
    top: 10px;
    width: 94%;
    height: 180px;
    left: 3%;
    border-radius: 20px;
  }
  .lunbo image {
    width: 100%;
    height: 180px;
    border-radius: 10px;
    transition: 1s transform;
  }
  .lunbo image:active {
    filter: brightness(80%);
    transform: scale(0.9);
  }
  .undefine {
    position: relative;
    display: flex;
    top: 10px;
    width: 100%;
    height: 90px;
  }
  .blockSong {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    top: 10px;
    width: 100%;
    overflow: hidden;
  }
  .blockSong::after {
    content: ' ';
    display: block;
    height: 65px;
    width: 100%;
    clear: both;
  }
</style>