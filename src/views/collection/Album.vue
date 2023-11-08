<template>
    <div class="loading" v-if="!complete">
        <el-icon class="is-loading">
            <Loading />
        </el-icon>
        正在加载
    </div>
    <div v-if="complete && dataok" class="router_container">
        <el-scrollbar>
            <part title="收藏的专辑" :issub="true" :subtitle="`(${total})`">
                <div class="album_list">
                    <el-table v-if="subalbumlist.length" :show-header="false" :data="subalbumlist"
                        style="width:100%;cursor:default;border-top-style:solid;border-top-color:#BBBBBB;border-top-width:1px;"
                        stripe lazy class="list">
                        <el-table-column width="80">
                            <template v-slot="{ row }">
                                <Myitem :shadow="false" :routemode="true" :router="{ name: 'albumsdetail', params: { id: row.id } }"
                                    :imgurl="`${row.picUrl}?param=60y60`" class="cover"></Myitem>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip min-width="120">
                            <template v-slot="{ row }">
                                <mytitle :routemode="true" :router="{ name: 'albumsdetail', params: { id: row.id } }">
                                    {{ row.name }}<span v-if="row.alias[0]" class="sub_info">({{ row.alias[0] }})</span>
                                </mytitle>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip min-width="80">
                            <template v-slot="{ row }">
                                <mytitle color="light" size="small" :routemode="true"
                                    :router="{ name: 'artistdetail', params: { id: artist.id } }" v-for="(artist, i) in row.artists"
                                    :key="i">{{ i > 0 ? '/' : '' }}{{ artist.name }}</mytitle>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip min-width="60">
                            <template v-slot="{ row }">
                                <span class="text">{{ row.size }}首</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-empty v-else description="没有找到数据"></el-empty>
                </div>
            </part>
        </el-scrollbar>
    </div>
    <el-empty v-else-if="complete && !dataok" description="暂时没有数据"></el-empty>
</template>

<script>
import { ref } from '@vue/reactivity';
import { computed, onBeforeMount } from '@vue/runtime-core';
import { reqSubalbumlist } from '@/api/music'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex';
export default {
    name: 'Album',
    setup() {
        const store = useStore();
        let dataok = ref(true);//数据是否获取成功
        let complete = ref(false);//网络请求是否已经发送完成
        let subalbumlist = computed(() => store.state.albumlist)
        let total = computed(() => store.state.subalbumtotal);
        let isalbumlist = computed(() => store.state.isalbumlist);
        async function getsubalbumlist(limit, offset) {
            if (!isalbumlist.value) {
                let result = await reqSubalbumlist(limit, offset);
                if (result.code === 200) {
                    store.commit('SUBALBUMLIST', result)
                    return true;
                }
                else return Promise.reject();
            }
            else return true;
        }
        onBeforeMount(async () => {
            try {
                await getsubalbumlist(1000, 0);
            }
            catch (err) {
                console.log(err)
                ElMessage.error('网络异常，获取数据失败')
                dataok.value = false;
            }
            finally {
                complete.value = true;
            }

        })
        return { isalbumlist, total, subalbumlist, complete, dataok }
    }
}
</script>

<style lang="less" scoped>
.router_container {
    width: 100%;
    height: calc(100vh - 204px);

    .album_list {
        height: 100%;
        width: 100%;

        .sub_info {
            color: #BBBBBB;
            font-size: 12px;
        }

        .cover {
            width: 60px;
            height: 60px;
        }

        .text {
            cursor: default;
            font-size: 12px;
            color: #616162;
        }
    }
}</style>