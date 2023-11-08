<template>
    <el-scrollbar>
        <div class="loading" v-if="!complete">
            <el-icon class="is-loading">
                <Loading />
            </el-icon>
            正在加载
        </div>
        <div v-if="complete && dataok" class="router_container">
            <part class="header">
                <div class="hotcat_container">
                    <div v-for="(item, index) in catlist" :key="index" class='sort_container'>
                        <span @click="handleClick(item)" class="sort_child"
                            :class="{ 'is-active': item === currentsort }">{{ item }}</span>
                    </div>
                </div>
            </part>
            <part title="最新MV" :routemode="true" :router="{ name: 'allmv', params: { type: '全部', order: '最新', area: currentsort } }">
                <div class="music_list">
                    <div class="item_container" v-for="(item, index) in newestmvlist" :key="index">
                        <Myitem :routemode="true" :router="{ name: 'videodetail', params: { id: item.id, type: 'mv' } }"
                            :imgurl="`${item.cover}?param=240y150`" class="item" :number="item.playCount"></Myitem>
                        <Mytitle :routemode="true" :router="{ name: 'videodetail', params: { id: item.id, type: 'mv' } }"
                            class="title">{{ item.name }}</Mytitle>
                        <div class="artist_container">
                            <Mytitle size="small" color="light" :routemode="true"
                                :router="{ name: 'artistdetail', params: { id: item.id } }" class="artist"
                                v-for="(artist, i) in item.artists" :key="i">{{ i > 1 ? '/' : '' }}{{ artist.name }}</Mytitle>
                        </div>
                    </div>
                </div>
            </part>
            <part title="热播MV" :routemode="true" :router="{ name: 'allmv', params: { type: '全部', order: '最热', area: '全部' } }">
                <div class="music_list">
                    <div class="item_container" v-for="(item, index) in hotmvlist" :key="index">
                        <Myitem :routemode="true" :router="{ name: 'videodetail', params: { id: item.id, type: 'mv' } }"
                            :imgurl="`${item.cover}?param=240y150`" class="item" :number="item.playCount"></Myitem>
                        <Mytitle :routemode="true" :router="{ name: 'videodetail', params: { id: item.id, type: 'mv' } }"
                            class="title">{{ item.name }}</Mytitle>
                        <div class="artist_container">
                            <Mytitle size="small" color="light" :routemode="true"
                                :router="{ name: 'artistdetail', params: { id: item.id } }" class="artist"
                                v-for="(artist, i) in item.artists" :key="i">{{ i > 1 ? '/' : '' }}{{ artist.name }}</Mytitle>
                        </div>
                    </div>
                </div>
            </part>
            <part title="网易出品" :routemode="true" :router="{ name: 'allmv', params: { type: '网易出品', order: '最新', area: '全部' } }">
                <div class="music_list">
                    <div class="item_container" v-for="(item, index) in exclusivemvlist" :key="index">
                        <Myitem :routemode="true" :router="{ name: 'videodetail', params: { id: item.id, type: 'mv' } }"
                            :imgurl="`${item.cover}?param=240y150`" class="item" :number="item.playCount"></Myitem>
                        <Mytitle :routemode="true" :router="{ name: 'videodetail', params: { id: item.id, type: 'mv' } }"
                            class="title">{{ item.name }}</Mytitle>
                        <div class="artist_container">
                            <Mytitle size="small" color="light" :routemode="true"
                                :router="{ name: 'artistdetail', params: { id: item.id } }" class="atist"
                                v-for="(artist, i) in item.artists" :key="i">{{ i > 1 ? '/' : '' }}{{ artist.name }}</Mytitle>
                        </div>
                    </div>
                </div>
            </part>
        </div>
        <el-empty v-else-if="complete && !dataok" description="暂时没有数据"></el-empty>
    </el-scrollbar>
</template>

<script>
import Sortselet from '@/components/Sortselet.vue';
import { onBeforeMount, ref } from '@vue/runtime-core';
import { reqExclusivemv, reqMv } from '@/api/music';
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex';
export default {
    name: 'Mv',
    components: {
        Sortselet,
    },
    setup() {
        const store = useStore();
        let newestmvlist = ref([])
        let hotmvlist = ref([])
        let exclusivemvlist = ref([])
        let dataok = ref(true);//数据是否获取成功
        let complete = ref(false);//网络请求是否已经发送完成
        let catlist = ['内地', '港台', '欧美', '日本', '韩国']
        let currentsort = ref('内地')
        async function handleClick(cat) {
            try {
                if (cat != currentsort.value) {
                    store.commit('LOAD')
                    await getnewestmv(cat, 6, 0);
                    await gethotmv(cat, 6, 0);
                    currentsort.value = cat;
                }
            }
            catch (err) {
                console.log(err.message)
                ElMessage.error('网络异常，获取数据失败')
                dataok.value = false;
            }
            finally {
                store.commit('LOADCOMPLETE')
            }



        }
        async function getnewestmv(area, limit, offset) {
            let result = await reqMv(area, limit, '最新', offset);
            if (result.code === 200) {
                newestmvlist.value = result.data;
                return true;
            }
            else return Promise.reject();
        }
        async function gethotmv(area, limit, offset) {
            let result = await reqMv(area, limit, '最热', offset);
            if (result.code === 200) {
                hotmvlist.value = result.data;
                return true;
            }
            else return Promise.reject();
        }
        async function getexclusivemv(limit, offset) {
            let result = await reqExclusivemv(limit, offset)
            if (result.code === 200) {
                exclusivemvlist.value = result.data;
                return true;
            }
            else return Promise.reject();
        }
        onBeforeMount(async () => {
            try {
                await getnewestmv('内地', 6, 0);
                await gethotmv('内地', 6, 0);
                await getexclusivemv(6, 0)
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
        return { handleClick, catlist, currentsort, exclusivemvlist, hotmvlist, newestmvlist, dataok, complete }
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

        .hotcat_container {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;

            .sort_container {
                display: flex;
                justify-content: center;
                align-items: center;

                .sort_child {
                    display: inline-block;
                    text-align: center;
                    font-size: 12px;
                    color: #676767;
                    cursor: pointer;
                    padding: 2px 10px;

                    &:hover {
                        color: #373737;
                    }
                }

                .is-active {
                    color: #EC4141;
                    background-color: #FDF5F5;
                    border-radius: 10px;

                    &:hover {
                        color: #EC4141;
                        background: #FDEDED;
                    }
                }
            }
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
                width: 240px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden
            }

            .artist_container {
                display: flex;
                width: 240px;
                justify-content: flex-start;
                align-items: center;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        display: grid;
        grid-template-columns:repeat(3, 1fr);
    }

    height: calc(100vh - 204px);
}</style>