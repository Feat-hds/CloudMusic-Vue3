<template>
  <div class="discover_container">
    <el-menu
      :default-active="route.path"
      class="el-menu"
      mode="horizontal"
      background-color="#ffffff"
      text-color="#000000"
      active-text-color="#EC4141"
      router
      :ellipsis='false'
      >
      <el-menu-item  index="/video/videolist">视频</el-menu-item>
      <el-menu-item  index="/video/mv">MV</el-menu-item>
    </el-menu>
    <router-view v-slot="{Component}">
        <keep-alive>
            <component :is="Component"></component>
        </keep-alive>
    </router-view>
  </div>
</template>

<script>
//测试接口api
import {useRoute} from 'vue-router'

export default {
    name:'Video',
    setup(){
      let route=useRoute();
      return {route}
    }


}
</script>

<style lang="less" scoped>


</style>