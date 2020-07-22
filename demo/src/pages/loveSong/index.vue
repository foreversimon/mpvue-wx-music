<template>
  <div>
    <img src="../../../static/images/x.jpg" alt="" class="bgpicture">
    <div class="afterBlock">
      <song v-for="(item, index) in love_song_sheet" :key="index" :item="item" :num="index" :love="true"></song>
    </div>
    <footer-nav></footer-nav>
  </div>
</template>

<script>
import FooterNav from '../../components/footerNav'
import Song from '../../components/song'
import Store from '../counter/store'

export default {
  components: {
    'footer-nav': FooterNav,
    'song': Song
  },
  computed: {
    love_song_sheet () {
      return Store.state.love_song_sheet
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
  .afterBlock::after {
    content: ' ';
    display: block;
    height: 65px;
    width: 100%;
    clear: both;
  }
</style>