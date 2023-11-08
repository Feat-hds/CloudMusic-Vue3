<template>
    <el-scrollbar>
        <div class="loading" v-if="!complete">
            <el-icon class="is-loading">
                <Loading />
            </el-icon>
            正在加载
        </div>
        <div v-if="complete && dataok" class="router_container">
            <part title="收藏的视频" :issub="true" :subtitle="`(${total})`">
                <div v-if="submvlist.length" class="music_list">
                    <div class="item_container" v-for="(item, index) in submvlist" :key="index">
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
            </part>
        </div>
        <el-empty v-else-if="complete && !dataok" description="暂时没有数据"></el-empty>
    </el-scrollbar>
</template>

<script>
import { ElMessage } from 'element-plus'
import { ref } from '@vue/reactivity';
import { computed, onActivated } from '@vue/runtime-core';
import { reqSubmvlist } from '@/api/music'
import { useStore } from 'vuex';
export default {
    name: 'Video',
    setup() {
        const store = useStore();
        let dataok = ref(true);//数据是否获取成功
        let complete = ref(false);//网络请求是否已经发送完成
        let submvlist = ref([])
        let total = ref()
        let isvideolist = computed(() => store.state.isvideolist)
        async function getsubmvlist(limit, offset) {
            if (isvideolist.value) {
                let result = await reqSubmvlist(limit, offset)
                if (result.code === 200) {
                    submvlist.value = result.data;
                    total.value = result.count;
                    store.commit('LOADVIDEOLIST');
                    return true;
                }
                else return Promise.reject();
            }
        }
        onActivated(async () => {
            try {
                if (isvideolist.value) {
                    await getsubmvlist(20, 0);
                }

            }
            catch (err) {
                console.log(err.message)
                ElMessage.error('网络异常，获取数据失败')
                dataok.value = false;
            }
            finally {
                complete.value = true;
            }

        })
        return { total, complete, dataok, submvlist }
    }
}
</script>

<style lang="less" scoped>
.router_container {
    width: 100%;

    .header {
        display: flex;
        width: 95%;
        justify-content: flex-start;
        align-items: center;

        .catlist {
            flex-grow: 1;
            justify-content: flex-end;
        }
    }

    .music_list {
        .item_container {
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
                height: 24px;
                width: 240px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden
            }

            .mv {
                font-size: 10px;
            }
        }

        display: grid;
        grid-template-columns:repeat(3, 1fr);
    }

    height: calc(100vh - 204px);
}
</style>