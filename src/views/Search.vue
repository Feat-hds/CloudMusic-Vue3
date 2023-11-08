<template>
    <div class="search">
        <el-scrollbar>
            <part :title="`搜索:${searchkeyword()}`">
                <div class="result">
                    <span v-if="route.query.keyword" class="secondtitle">你可能感兴趣:</span>
                    <div class="recommend">
                        <div class="item_container" @click="routerto(item)" v-for="(item, index) in multimatchlist"
                            :key="index">
                            <myitem :imgurl="coverurl(item)" class="item" />
                            <div class="info">
                                <span class="title">{{ itemtype(item.type) }}:{{ item.type != 'new_mlog' ? item.data.name :
                                    item.data.resource.mlogBaseData.text }}</span>
                                <div class="number_artist" v-if="item.type === 'playlist'">
                                    <div class="number text">歌曲:
                                        <playnumber :number="item.data.trackCount" />,播放:
                                        <playnumber :number="item.data.playCount" />
                                    </div>
                                </div>
                                <div class="number_artist" v-else-if="item.type === 'artist'">
                                    <div class="number text">粉丝数:
                                        <playnumber :number="item.data.fansSize" />,歌曲:
                                        <playnumber :number="item.data.musicSize" />
                                    </div>
                                </div>
                                <div class="number_artist" v-else-if="item.type === 'album'">
                                    <span class="number text">{{ item.data.artist.name }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <el-menu :default-active="route.name" class="el-menu" mode="horizontal" background-color="#ffffff"
                        text-color="#000000" router active-text-color="#EC4141" :ellipsis='false'>
                        <el-menu-item index="searchmusic"
                            :route="{ name: 'searchmusic', query: { keyword: route.query.keyword } }">单曲</el-menu-item>
                        <el-menu-item index="searchartist"
                            :route="{ name: 'searchartist', query: { keyword: route.query.keyword } }">歌手</el-menu-item>
                        <el-menu-item index="searchalbum"
                            :route="{ name: 'searchalbum', query: { keyword: route.query.keyword } }">专辑</el-menu-item>
                        <el-menu-item index="searchvideo"
                            :route="{ name: 'searchvideo', query: { keyword: route.query.keyword } }">视频</el-menu-item>
                        <el-menu-item index="searchmusiclist"
                            :route="{ name: 'searchmusiclist', query: { keyword: route.query.keyword } }">歌单</el-menu-item>
                        <el-menu-item index="searchradio"
                            :route="{ name: 'searchradio', query: { keyword: route.query.keyword } }">播客</el-menu-item>
                        <el-menu-item index="searchvoice"
                            :route="{ name: 'searchvoice', query: { keyword: route.query.keyword } }">声音</el-menu-item>
                        <el-menu-item index="searchuser"
                            :route="{ name: 'searchuser', query: { keyword: route.query.keyword } }">用户</el-menu-item>
                    </el-menu>
                    <router-view v-slot="{ Component }">
                        <keep-alive>
                            <component :is="Component"></component>
                        </keep-alive>
                    </router-view>
                </div>
            </part>
        </el-scrollbar>
    </div>
</template>

<script>
import { onActivated, ref } from '@vue/runtime-core';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { reqSearchmultimatch } from '@/api/music'
export default {
    name: 'Search',
    setup() {

        let route = useRoute();
        let router = useRouter();
        let multimatchlist = ref([])
        let keyword = ref(null);
        function searchkeyword() {
            if (route.query.keyword) {
                return decodeURIComponent(route.query.keyword)
            } else return ''
        }
        function coverurl(item) {
            if (item.type === 'new_mlog') {
                return `${item.data.resource.mlogBaseData.coverUrl}?param=50y50`
            }
            else if (item.type === 'playlist') {
                return `${item.data.coverImgUrl}?param=50y50`
            }
            else return `${item.data.picUrl}?param=50y50`
        }
        function routerobj(item) {
            switch (item.type) {
                case 'artist':
                    return { name: 'artistdetail', params: { id: item.data.id } }
                case 'new_mlog':
                    return { name: 'videodetail', params: { id: item.data.id, type: 'video' } }
                case 'playlist':
                    return { name: 'musiclistdetail', params: { id: item.data.id } }
                case 'album':
                    return { name: 'albumsdetail', params: { id: item.data.id } }
                default:
                    return null;
            }
        }
        function routerto(item) {
            router.push(routerobj(item))
        }
        function itemtype(type) {
            switch (type) {
                case 'artist':
                    return '歌手'
                case 'new_mlog':
                    return '视频'
                case 'playlist':
                    return '歌单'
                case 'album':
                    return '专辑'
                default:
                    return '信息错误';
            }
        }
        async function getmultisearch(keyword) {
            try {
                let result = await reqSearchmultimatch(keyword);
                if (result.code === 200) {
                    let arr = result.result.orders;
                    if (arr) {
                        let obj = [];
                        for (let x of arr) {
                            if (x === 'artist' || x === 'playlist' || x === 'album') {
                                obj.push({ type: x, data: result.result[x][0] })
                            }
                        }
                        multimatchlist.value = obj;
                    }
                    return true;
                }
                else return Promise.reject();
            } catch (err) {
                ElMessage.error('获取数据失败');
                console.log(err.message);
            }
        }
        onBeforeRouteUpdate((to) => {
            try {
                if (to.query.keyword) {
                    let temp = decodeURIComponent(to.query.keyword)
                    if (temp != keyword.value) {
                        getmultisearch(temp);
                        keyword.value = temp;
                    }
                }
                else throw Error('没有关键字')
            }
            catch (err) {
                console.log(err)
                ElMessage.error('请求发生错误')
            }
        })
        onActivated(() => {
            try {
                if (route.query.keyword) {
                    let temp = decodeURIComponent(route.query.keyword)
                    if (temp != keyword.value) {
                        getmultisearch(temp);
                        keyword.value = temp;
                    }
                }
                else throw Error('没有关键字')
            }
            catch (err) {
                console.log(err)
                ElMessage.error('请求发生错误')
            }
        })
        return { searchkeyword, coverurl, routerto, itemtype, route, multimatchlist }
    }
}
</script>

<style lang="less" scoped>
.search {
    width: 100%;
    height: 100%;

    .result {
        .secondtitle {
            color: #BBBBBB;
            font-size: 12px;
            cursor: default;
            margin-left: 10px;
        }

        .recommend {
            display: grid;
            grid-template-columns: repeat(3, 1fr);

            .item_container {
                padding: 10px 10px;
                background-color: #EAEAEA;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
                margin-right: 10px;
                align-items: center;
                width: 300px;
                border-radius: 5px;

                .item {
                    flex-shrink: 0;
                    width: 50px;
                    height: 50px;
                }

                .info {
                    width: 230px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    flex-direction: column;

                    .title {
                        width: 230px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }

                    .number_artist {
                        width: 230px;
                        display: flex;
                        justify-content: flex-start;
                        align-content: center;
                        flex-direction: row;

                        .text {
                            color: #BBBBBB;
                            font-size: 12px;
                        }

                        .number {
                            margin-right: 10px;
                        }

                        .artist {
                            margin-left: 20px;
                        }
                    }

                }

            }
        }
    }

}
</style>