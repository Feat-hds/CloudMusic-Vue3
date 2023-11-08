<template>
    <div class="loading" v-if="!complete">
        <el-icon class="is-loading">
            <Loading />
        </el-icon>
        正在加载
    </div>
    <div v-if="complete && dataok">
        <div class="group">
            <div class="hotcat_container">
                <div v-for="(item, index) in catlistarea" :key="index" class='sort_container'>
                    <span @click="handleClick(item)" class="sort_child"
                        :class="{ 'is-active': item.id === currentmusicarea }">{{ item.name }}</span>
                </div>
            </div>
            <div class="button_group">
                <el-button @click="addallandplay" type="danger" round icon="CaretRight">播放全部</el-button>
                <el-button @click="addall" type="info" round icon="Plus">添加全部到播放列表</el-button>
            </div>
        </div>
        <el-table :show-header="false" :data="musiclist"
            style="width:100%;cursor:default;border-top-style:solid;border-top-color:#BBBBBB;border-top-width:1px;" stripe
            lazy class="list" @row-dblclick="addmusicandplay">
            <el-table-column width="50" type="index" class="index" />
            <el-table-column width="80">
                <template v-slot="{ row }">
                    <Myitem @click="addmusicandplay(row)" :shadow="false" :imgurl="`${row.album.picUrl}?param=60y60`"
                        class="cover"></Myitem>
                </template>
            </el-table-column>
            <el-table-column prop="name" show-overflow-tooltip min-width="120">
                <template v-slot="{ row }">
                    <span @click="addmusicandplay(row)" class="title_video">{{ row.name }}<span v-if="row.alias[0]"
                            class="sub_info">({{ row.alias[0] }})</span></span>
                    <tags class="row_tag" v-if="row.fee === 1">VIP</tags>
                    <tags class="row_tag" v-if="row.fee === 8 || row.fee === 1">SQ</tags>
                    <tags class="row_tag" v-if="row.mvid != 0" :routemode="true"
                        :router="{ name: 'videodetail', params: { id: row.mvid, type: 'mv' } }">MV</tags>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="60">
                <template v-slot="{ row }">
                    <mytitle size="small" color="light" :routemode="true"
                        :router="{ name: 'artistdetail', params: { id: item.id } }" v-for="(item, index) in row.artists" :key="index"
                        class="text">{{ item.name }}</mytitle>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="60">
                <template v-slot="{ row }">
                    <mytitle size="small" color="light" :routemode="true"
                        :router="{ name: 'albumsdetail', params: { id: row.album.id } }" class="album">{{ row.album.name }}</mytitle>
                </template>
            </el-table-column>
            <el-table-column prop="time" show-overflow-tooltip min-width="20">
                <template v-slot="{ row }">
                    <duration class="text_table" :time="row.duration" />
                </template>
            </el-table-column>
        </el-table>
    </div>
    <el-empty v-else-if="complete && !dataok" description="暂时没有数据"></el-empty>
</template>

<script>
import { ref } from '@vue/reactivity'
import { reqTopsong } from '@/api/music'
import { computed, onBeforeMount } from '@vue/runtime-core';
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex';
export default {
    name: 'Topsong',
    setup() {
        let dataok = ref(true);//数据是否获取成功
        let complete = ref(false);//网络请求是否已经发送完成
        const store = useStore();
        let musiclist = ref([]);
        let catlistarea = [{ name: '全部', id: '0' }, { name: '华语', id: '7' }, { name: '欧美', id: '96' }, { name: '日本', id: '8' }, { name: '韩国', id: '16' }]
        let currentmusicarea = ref('0')
        let nextlock = computed(() => store.state.nextlock)
        let lyriclock = computed(() => store.state.lyriclock)
        let commentlock = computed(() => store.state.commentlock)
        function addallandplay() {
            if (!nextlock.value && !lyriclock.value && !commentlock.value) {
                store.commit('LOCK')
                let arr = musiclist.value;
                for (let x in arr) {
                    arr[x].al = arr[x].album;
                    arr[x].ar = arr[x].artists;
                    arr[x].alia = arr[x].alias;
                    arr[x].dt = arr[x].duration;
                    arr[x].mv = arr[x].mvid;
                }
                store.dispatch('addallandplay', arr)
            }
        }
        function addall() {
            if (!nextlock.value && !lyriclock.value && !commentlock.value) {
                store.commit('LOCK')
                let arr = musiclist.value;
                for (let x in arr) {
                    arr[x].al = arr[x].album;
                    arr[x].ar = arr[x].artists;
                    arr[x].alia = arr[x].alias;
                    arr[x].dt = arr[x].duration;
                    arr[x].mv = arr[x].mvid;
                }
                store.dispatch('addall', arr)
            }
        }
        function addmusicandplay(row) {
            if (!nextlock.value && !lyriclock.value && !commentlock.value) {
                store.commit('LOCK')
                row.al = row.album;
                row.ar = row.artists;
                row.alia = row.alias;
                row.dt = row.duration;
                row.mv = row.mvid;
                store.dispatch('addmusicandplay', row)
            }
        }
        async function handleClick(cat) {
            try {
                if (currentmusicarea.value != cat.id) {
                    store.commit('LOAD')
                    await gettopsong(cat.id);
                    currentmusicarea.value = cat.id;
                }
            }
            catch (err) {
                console.log(err)
                ElMessage.error('网络请求错误')
                dataok.value = false;
            }
            finally {
                store.commit('LOADCOMPLETE')
            }
        }
        async function gettopsong(type = 0) {
            let result = await reqTopsong(type);
            if (result.code === 200) {
                musiclist.value = result.data;
                return true;
            }
            else return Promise.reject();
        }
        onBeforeMount(async () => {
            try {
                await gettopsong(currentmusicarea.value);
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
        return { catlistarea, addallandplay, addall, addmusicandplay, handleClick, currentmusicarea, complete, dataok, musiclist }
    }
}
</script>

<style lang='less' scroped>
.group {
    margin-top: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

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

    .button_group {
        margin-right: 20px;
    }
}

.list {
    .title_video {
        cursor: pointer;

        &:hover {
            color: #373737;
        }
    }

    .row_tag {
        margin-left: 5px;
        font-size: 10px;
    }

    .cover {
        width: 60px;
        height: 60px;
    }

    .sub_info {
        color: #BBBBBB;
        font-size: 12px;
    }

    .text_table {
        cursor: default;
        font-size: 12px;
        color: #616162;
    }
}</style>