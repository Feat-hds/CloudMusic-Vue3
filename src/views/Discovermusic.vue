<template>
  <div class="discover_container">
    <el-menu
      :default-active="route.name"
      class="el-menu"
      mode="horizontal"
      background-color="#ffffff"
      text-color="#000000"
      active-text-color="#EC4141"
      router
      :ellipsis='false'
      >
      <el-menu-item  index="priviterecommend" :route="{name:'priviterecommend'}">个性推荐</el-menu-item>
      <el-menu-item  index="priviteorder" :route="{name:'priviteorder'}">专属订制</el-menu-item>
      <el-menu-item  index="musiclist" :route="{name:'musiclist'}">歌单</el-menu-item>
      <el-menu-item  index="rank" :route="{name:'rank'}">排行榜</el-menu-item>
      <el-menu-item  index="artist" :route="{name:'artist'}">歌手</el-menu-item>
      <el-menu-item  index="topsong" :route="{name:'topsong'}">最新音乐</el-menu-item>
    </el-menu>
      <router-view v-slot="{Component}">
          <keep-alive>
              <component :is="Component"></component>
          </keep-alive>
      </router-view>
  </div>
</template>

<script>

import {useRoute} from 'vue-router'

export default {
    name:'Discovermusic',
    components:{
    },
    setup(){
      let route=useRoute();
      return {route}
    }


}
</script>

<style lang="less" scoped>


</style>