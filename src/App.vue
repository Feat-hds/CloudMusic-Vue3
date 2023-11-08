<template>
  <div id="container">
    <Header></Header>
    <Leftnav></Leftnav>
    <Myrouter></Myrouter>
    <musiccontrollerbottom></musiccontrollerbottom>
    <transition name="player" appear>
      <musicplayer v-show="player&&playmode"></musicplayer>
    </transition>
  </div>
   <el-dialog v-model="centerDialogVisible" title="消息" width="30%" center>
    <div class="message_index">电台音频相关功能因api不全，无法获取暂时只有页面而无法使用和播放。</div>
    <div class="message_index">收藏功能可能会因为被认定为脚本而无法使用，推荐使用二维码或者短信登录可以减小被判定为脚本的可能性。</div>
    <template #footer>
        <el-button type="danger" @click="centerDialogVisible = false"
          >确认</el-button>
    </template>
  </el-dialog>
</template>

<script>
import Myrouter from '@/components/Myrouter.vue'
import Header from "@/components/Header.vue";
import Leftnav from "@/components/Leftnav.vue"
import Musiccontrollerbottom from './components/Musiccontrollerbottom.vue';
import Musicplayer from '@/components/Musicplayer.vue'
import {useStore} from 'vuex'
import {computed, onMounted, ref} from 'vue'




export default {
  name: 'App',
  components: {
    Header,
    Leftnav,
    Myrouter,
    Musiccontrollerbottom,
    Musicplayer
  },
  setup(){
    let store=useStore();
    let player=computed(()=>store.state.player);
    let playmode=computed(()=>store.state.playmode)
    let centerDialogVisible = ref(true);
    return {player,playmode,centerDialogVisible}
  }
}
</script>

<style lang="less">
#container{
  position: relative;
  box-shadow: 0 0 10px #888888;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-width: 1200px;
  align-content: flex-start;
}
.player-enter-active,
.player-leave-active {
  transition: 1s ease;
}
.player-enter-from,
.player-leave-to {
  transform: translateY(100%);
  }
.player-enter-to,
.player-leave-from {
  transform: translateY(0);
  }
.message_index{
  font-size: 14px;
  cursor: default;
  text-indent:2em;
}

</style>