<template>
    <el-scrollbar>
        <div class="loading" v-if="!complete">
            <el-icon class="is-loading">
                <Loading />
            </el-icon>
            正在加载
        </div>
        <div v-if="complete && dataok" class="router_container">
            <div class="group">
                <div class="hotcat_container">
                    <div v-for="(item, index) in catlistarea" :key="index" class='sort_container'>
                        <span @click="handleClick(item)" class="sort_child"
                            :class="{ 'is-active': item.id === currentarea }">{{ item.name }}</span>
                    </div>
                </div>
                <div class="hotcat_container">
                    <div v-for="(item, index) in catlisttype" :key="index" class='sort_container'>
                        <span @click="handleClick(item)" class="sort_child"
                            :class="{ 'is-active': item.id === currenttype }">{{ item.name }}</span>
                    </div>
                </div>
            </div>
            <part title="本周新碟">
                <div p v-if="weekalbumlist.length" class="recommend_list">
                    <div class="music_item" v-for="(item, index) in weekalbumlist" :key="index">
                        <Myitem :shadow="false" :imgurl="`${item.picUrl}?param=150y150`" :routemode="true"
                            :router="{ name: 'albumsdetail', params: { id: item.id } }" class="item"></Myitem>
                        <Mytitle :routemode="true" :router="{ name: 'albumsdetail', params: { id: item.id } }"
                            class="title">
                            {{ item.name }}</Mytitle>
                        <timetransform :time="item.publishTime" class="create_time" />
                    </div>
                </div>
                <el-empty v-else description="没有找到数据"></el-empty>
            </part>
            <part :title="`${month}月新碟`">
                <div p v-if="monthalbumlist.length" class="recommend_list">
                    <div class="music_item" v-for="(item, index) in wmonthalbumlist" :key="index">
                        <Myitem :shadow="false" :imgurl="`${item.picUrl}?param=150y150`" :routemode="true"
                            :router="{ name: 'albumsdetail', params: { id: item.id } }" class="item"></Myitem>
                        <Mytitle :routemode="true" :router="{ name: 'albumsdetail', params: { id: item.id } }"
                            class="title">
                            {{ item.name }}</Mytitle>
                        <timetransform :time="item.publishTime" class="create_time" />
                    </div>
                </div>
                <el-empty v-else description="没有找到数据"></el-empty>
            </part>
        </div>
        <el-empty v-else-if="complete && !dataok" description="暂时没有数据"></el-empty>
    </el-scrollbar>
</template>

<script>
import { ref } from '@vue/reactivity'
import { ElMessage } from 'element-plus';
import { onBeforeMount } from '@vue/runtime-core';
import { reqTopalbum } from '@/api/music'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';


export default {
    name: 'Topalbum',
    setup() {
        let complete = ref(false);
        let dataok = ref(true);
        let currentarea = ref('all')
        let currenttype = ref('hot')
        let weekalbumlist = ref([])
        let monthalbumlist = ref([])
        let month = new Date().getMonth();
        let catlistarea = [{ name: '全部', id: 'ALL' }, { name: '华语', id: 'ZH' }, { name: '欧美', id: 'EA' }, { name: '韩国', id: 'KR' }, { name: '日本', id: 'JP' }]
        let catlisttype = [{ name: '推荐', id: 'hot' }, { name: '全部', id: 'new' }]
        async function gettopalbum(area, type, limit = 10, offset = 0) {
            let result = await reqTopalbum(area, type, limit, offset);
            console.log(result);
            if (result.code === 200) {
                weekalbumlist.value = result.weekData;
                monthalbumlist.value = result.monthData;
                return true;
            }
            else return Promise.reject();
        }
        onBeforeMount(async () => {
            try {
                ElMessage.warning('api返回数据过大，暂不开放')
                throw Error()
            }
            catch (err) {
                console.log(err)
                dataok.value = false;
            }
            finally {
                complete.value = true;
            }

        })
        return { month, weekalbumlist, monthalbumlist, complete, dataok, currentarea, catlistarea, catlisttype, currenttype }
    }
}
</script>

<style lang="less" scoped>
.router_container {
    height: calc(100vh - 204px);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    .group {
        margin-top: 50px;
        width: 100%;
        // background-color: green;
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

                // width: 60px;
                // border-right-style: solid;
                // border-right-color: #F2F2F2;
                // border-width: 1px;
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

    .album_list {
        .recommend_list {
            .music_item {
                margin: 5px 0;
                flex-shrink: 0;
            }

            .item {
                width: 150px;
                height: 150px;
                flex-shrink: 0;
            }

            .title {
                width: 150px;
                overflow: hidden;
                word-break: break-all;
                text-overflow: ellipsis;
                /* 文本溢出时显示省略号来代表被修剪的文本 */
                display: -webkit-box;
                /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 */
                -webkit-box-orient: vertical;
                /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
                -webkit-line-clamp: 2;
                /* 文本需要显示多少行 */
            }

            .create_time {
                font-size: 12px;
                color: #BBBBBB;
            }

            display: grid;
            grid-template-columns: repeat(5, 1fr);
        }
    }
}</style>
