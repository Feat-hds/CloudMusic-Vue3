<template>
    <div class="router_container">
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
        <el-menu-item  index="/collection/album">专辑</el-menu-item>
        <el-menu-item  index="/collection/artist">歌手</el-menu-item>
        <el-menu-item  index="/collection/video">视频</el-menu-item>
        </el-menu>
        <router-view v-slot="{Component}">
            <keep-alive>
                <component :is="Component"></component>
            </keep-alive>
        </router-view>
    </div>
</template>

<script>
import { useRoute } from 'vue-router'

export default {
    name:'Collection',
    setup(){
        const route=useRoute();
        return {route}
    }
}
</script>

<style lang="less" scoped>

</style>