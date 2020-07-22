<template>
  <div class="one" @click="onClick()">
    <img :src="src" alt="" class="img fl">
    <div class="nr fl">
      <p class="t">{{listen}}</p>
      <p class="l">累计听歌<span>{{num}}</span>次
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['listen', 'src', 'url', 'num'],
  methods: {
    onClick () {
      mpvue.navigateTo({
        url: this.url
      })
    }
  }
}
</script>

<style>
  .fl {
    float: left;
  }
  .one {
    height: 85px;
  }
  .one:active {
    background-color: rgba(60, 60, 60, 0.3)
  }
  .img {
    display: inline-block;
    height: 65px;
    width: 65px;
    margin: 10px 10px 10px 20px;
    border-radius: 10px;
    background-color: white;
  }
  .nr {
    position: relative;
    top: 10px;
  }
  .nr p {
    position: relative;
    margin-top: 10px;
  }
  .nr .t {
    font-weight: bold;
    color: white;
  }
  .nr .l {
    color: white;
    font-size: 15px;
  }
</style>