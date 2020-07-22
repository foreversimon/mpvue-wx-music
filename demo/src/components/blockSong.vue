<template>
  <div class="bs">
    <p class="img"><img :src="item.url2" alt="无图片" @click.stop="onClickImg()"></p>
    <p class="titlename" :class="{animation1: !flag1, animation2: flag1}"><span>{{item.name}}</span></p>
    <p class="singer" :class="{animation1: !flag2, animation2: flag2}"><span>{{item.singer}}</span></p>
  </div>
</template>

<script>
import Store from '../pages/counter/store'

export default {
  props: ['item'],
  data () {
    return {
      count: 0,
      flag1: true,
      flag2: true
    }
  },
  methods: {
    isSlide (val) {
      if (val.length > 12) {
        return false
      } else {
        return true
      }
    },
    selectClass1 () {
      if (this.isSlide(this.item.name)) {
        this.flag1 = true
      } else {
        this.flag1 = false
      }
    },
    selectClass2 () {
      if (this.isSlide(this.item.singer)) {
        this.flag2 = true
      } else {
        this.flag2 = false
      }
    },
    onClickImg () {
      Store.commit('putSong', this.item)
      Store.dispatch('upSong')
    }
  },
  created () {
    this.selectClass1()
    this.selectClass2()
  },
  computed: {
  }
}
</script>

<style scoped>
  .bs {
    box-sizing: border-box;
    width: 33.33%;
    height: 140px;
  }
  .bs p {
    text-align: center;
  }
  .img {
    padding-top: 5px;
  }
  .img img {
    width: 70%;
    height: 85px;
    border-radius: 10px;
    transition: 1s transform;
  }
  .img img:active {
    filter: brightness(70%);
    transform: scale(0.9);
  }
  .titlename {
    font-size: 17px;
    width: 120px;
    white-space: nowrap;
    overflow: hidden;
  }
  .animation1 {
    animation: slide 10s linear 0s infinite normal;
  }
  .animation2 {
    animation: none;
  }
  @keyframes slide {
    0% {text-indent: 1em;}
    50% {text-indent: -5em;}
    100% {text-indent: 1em;}
  }
  .singer {
    font-size: 12px;
    width: 120px;
    white-space: nowrap;
    overflow: hidden;
  }
</style>