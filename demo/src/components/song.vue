<template>
  <div class="someone">
    <div class="num" @click="toPlay">{{num+1}}</div>
    <div class="ss" @click="toPlay">
      <p class="sn">{{item.name}}</p>
      <p class="sc">{{item.singer}}</p>
    </div>
    <div class="tool">
      <img src="../../static/tabs/open.png" alt="" @click="onSelector()">
      <ul v-if="on">
        <li class="down setbgc" @click.stop="download()">下载</li>
        <li class="del setbgc" @click.stop="del()">删除</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Store from '../pages/counter/store'

export default {
  props: ['key', 'item', 'num', 'love'],
  data () {
    return {
      on: false
    }
  },
  methods: {
    onSelector () {
      this.on = !this.on
    },
    toPlay () {
      Store.commit('putSong', this.item)
      setTimeout(() => {
        Store.dispatch('upSong')
      }, 1)
    },
    del () {
      if (this.love) {
        if (Store.state.songInfo.name === this.item.name) {
          Store.state.isLove = false
        }
        this.del1()
        this.on = false
      } else {
        this.del2()
        this.on = false
      }
    },
    del1 () {
      let that = this
      mpvue.request({
        url: 'http://localhost:8888/test/',
        data: {},
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'nToken': Store.state.token
        }, // 设置请求的 header
        success: function (res) {
          if (res.data.code === '1') {
            wx.request({
              url: 'http://localhost:8888/upSong/',
              data: {
                name: that.item.name,
                singer: that.item.singer,
                love: 'false'
              },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nToken': Store.state.token
              }, // 设置请求的 header
              success: function (a) {
                console.log(a)
                Store.commit('getSongSheet', a.data)// success
              }
            })
          }// success
        }
      })
    },
    del2 () {
      let that = this
      mpvue.request({
        url: 'http://localhost:8888/del/',
        data: {
          name: that.item.name
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'nToken': Store.state.token
        }, // 设置请求的 header
        success: function (res) {
          Store.commit('getSongSheet', res.data) // success
        }
      })
    },
    download () {
      let that = this
      wx.downloadFile({
        url: that.url1,
        success (res) {
          if (res.statusCode === 200) {
            console.log(res)
            that.on = false
          }
        }
      })
    }
  },
  computed: {
    isLove () {
      return Store.state.isLove
    },
    url1 () {
      return Store.state.song[this.num].url1
    }
  }
}
</script>

<style scoped>
  .someone {
    display: flex;
    align-items: center;
    height: 60px;
    width: 100%;
    border-top: 1px solid rgba(60, 60, 60, 0.5);
    border-bottom: 1px solid rgba(60, 60, 60, 0.5);
    transition: 0.5s background;
  }
  .someone:hover {
    background-color: rgba(60, 60, 60, 0.3);
  }
  .num {
    width: 15%;
    padding-left: 20px;
  }
  .ss {
    width: 70%;
  }
  .sn {
    font-size: 20px;
    font-weight: 650;
  }
  .sc {
    font-size: 15px;
  }
  .tool {
    width: 15%;
  }
  .tool img {
    height: 30px;
    width: 20px;
  }
  .tool ul {
    position: absolute;
    transform: translateX(-20px);
  }
  .tool ul li {
    padding-top: 5px;
    padding-right: 20px;
    padding-left: 10px;
    line-height: 30px;
    width: 50px;
    height: 30px;
    border-top: 1px solid rgba(60, 60, 60, 0.3);
    border-bottom: 1px solid rgba(60, 60, 60, 0.3);
  }
  .setbgc {
    background-color: rgba(60, 60, 60, 0.5)
  }
  .down:hover {
    background-color: rgba(60, 60, 60, 0.8)
  }
  .del:hover {
    background-color: rgba(60, 60, 60, 0.8)
  }
</style>
