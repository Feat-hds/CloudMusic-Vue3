<template>
    <div class="loading" v-if="!complete">
        <el-icon class="is-loading">
            <Loading />
        </el-icon>
        正在加载
    </div>
    <div v-if="complete && dataok" class="router_container">
        <part>
            <div v-if="videolist" class="music_list">
                <div class="item_container" v-for="(item, index) in videolist" :key="index">
                    <Myitem :duration="item.durationms" :routemode="true"
                        :router="{ name: 'videodetail', params: { id: item.vid, type: item.type ? 'video' : 'mv' } }"
                        :imgurl="`${item.coverUrl}?param=240y150`" class="item" :number="item.playTime"></Myitem>
                    <Mytitle :routemode="true"
                        :router="{ name: 'videodetail', params: { id: item.vid, type: item.type ? 'video' : 'mv' } }"
                        class="title">
                        <tags class="mv" v-if="!item.type" color="red">MV</tags>{{ item.title }}
                    </Mytitle>
                    <Mytitle size="small" color="light" :routemode="true"
                        :router="item.type ? { name: 'userprofile', params: { id: user.userId } } : { name: 'artistdetail', params: { id: user.userId } }"
                        v-for="(user, i) in item.creator" :key="i" class="atist">
                        {{ item.type ? 'by' : '' }}{{ i > 0 ? '/' : '' }}{{ user.userName }}</Mytitle>
                </div>
            </div>
            <el-empty v-else description="没有找到数据"></el-empty>
            <el-pagination :page-size="20" layout="prev, pager, next" :pager-count="7" :total="total"
                :hide-on-single-page="true" v-model:current-page="currentpage" @current-change="currentchange"
                class="pagination" />
        </part>
    </div>
    <el-empty v-else-if="complete && !dataok" description="暂时没有数据"></el-empty>
</template>

<script>
import { ref } from '@vue/reactivity';
import { useRoute } from 'vue-router';
import { reqSearch } from '@/api/music';
import { onActivated } from '@vue/runtime-core';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex'


export default {
    name: 'Video',
    setup() {
        const route = useRoute();
        const store = useStore();
        let complete = ref(false);
        let dataok = ref(true);
        let videolist = ref([])
        let keyword = ref('')
        let total = ref(0);
        let currentpage = ref(1);
        async function currentchange() {
            try {
                store.commit('LOAD')
                let result = await reqSearch(1014, keyword.value, 30, (currentpage.value - 1) * 30);
                if (result.code === 200) {
                    videolist.value = result.result.videos;
                    return true;
                }
                else return Promise.reject();
            }
            catch (err) {
                console.log(err)
                ElMessage.error('网络异常，获取数据失败');
            }
            finally {
                store.commit('LOADCOMPLETE')
            }
        }
        async function getsearchvideo(keyword, limit, offset) {
            let result = await reqSearch(1014, keyword, limit, offset);
            if (result.code === 200) {
                videolist.value = result.result.videos;
                total.value = result.result.videoCount;
                currentpage.value = 1;
                return true;
            }
            else return Promise.reject();
        }
        onActivated(async () => {
            try {
                if (route.query.keyword) {
                    if (route.query.keyword != keyword.value) {
                        complete.value = false;
                        dataok.value = true;
                        await getsearchvideo(route.query.keyword, 30, 0);
                        keyword.value = route.query.keyword;
                    }
                }
                else throw Error('没有关键字')
            }
            catch (err) {
                ElMessage.error('获取数据失败');
                console.log(err.message);
                dataok.value = false;
            }
            finally {
                complete.value = true;
            }
        })
        return { videolist, complete, dataok, total, currentpage, currentchange }
    }
}
</script>

<style lang="less" scoped>
.router_container {
    width: 100%;

    .pagination {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .music_list {
        .item_container {
            .mv {
                font-size: 10px;
            }

            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            margin: 5px 0;
            flex-shrink: 0;

            .item {
                width: 240px;
                height: 150px;
            }

            .title {
                width: 240px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                height: 22px;
            }
        }

        display: grid;
        grid-template-columns:repeat(3, 1fr);
    }

    height: calc(100vh - 204px);
}
</style>