<template>
    <div class="router_container">
        <el-scrollbar class="scroll">
            <div class="content">
                <div class="switch_button">
                    <div class="switch" :class="{ 'isactive': route.name === 'topsong' }">新歌速递</div>
                    <div class="switch" :class="{ 'isactive': route.name === 'topalbum' }">新碟上架</div>
                </div>
                <router-view v-slot="{ Component }">
                    <keep-alive>
                        <component :is="Component"></component>
                    </keep-alive>
                </router-view>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'

export default {
    name: 'Newestmusic',
    setup() {
        const route = useRoute();
        const router = useRouter();
        function handleclick(name) {
            if (route.name != name) {
                if (name === 'topsong' && route.name === 'topalbum') {
                    router.push({ name: 'topsong' })
                }
                else if (name === 'topalbum' && route.name === 'topsong') {
                    router.push({ name: 'topalbum' })
                }
            }
        }
        return { route, handleclick }
    }
}
</script>
<style lang="less" scoped>
.router_container {
    height: calc(100vh - 204px);

    .switch_button {
        flex-grow: 0;
        margin-top: 20px;
        align-self: center;
        display: flex;
        justify-content: center;
        border-color: #676767;
        border-radius: 20px;
        border-width: 1px;
        border-style: solid;

        .switch {
            padding: 4px 0;
            width: 100px;
            font-size: 12px;
            color: #676767;
            text-align: center;
            border-radius: 20px;
            cursor: default;

            &:hover {
                background-color: #F4F4F4;
            }
        }

        .isactive {
            color: white;
            background-color: #BBBBBB;

            &:hover {
                background-color: #BBBBBB;
            }
        }
    }

    .content {
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
    }
}</style>