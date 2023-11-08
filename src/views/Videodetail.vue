<template>
    <el-scrollbar>
        <div class="loading" v-if="!complete">
            <el-icon class="is-loading">
                <Loading />
            </el-icon>
            正在加载
        </div>
        <div v-if="complete && dataok" class="router_container">
            <div class="left">
                <part :title="currenttype === 'video' ? '视频详情' : 'MV详情'">
                    <video class="videoplayer" :src="videourl.url" controls width="656px" height="369px" :poster="route.params.type === 'mv' ? videodetail.cover : videodetail.coverUrl
                        ">
                    </video>
                </part>
                <part>
                    <div class="videoinfo">
                        <div v-if="currenttype === 'video'" class="creator">
                            <div class="userinfo">
                                <myitem :hoveranim="false" :shadow="false" :routemode="true"
                                    :router="{ name: 'userprofile', params: { id: videodetail.creator.userId } }"
                                    :imgurl="`${videodetail.creator.avatarUrl}?param=60y60`" class="avatar" />
                                <mytitle :routemode="true"
                                    :router="{ name: 'userprofile', params: { id: videodetail.creator.userId } }"
                                    class="user">
                                    {{ videodetail.creator.nickname }}</mytitle>
                            </div>
                            <el-button v-if="followed" @click="handlefollowvideo(videodetail.creator.userId, 0)"
                                class="button_userprofile" type="danger" round icon="CloseBold">已关注</el-button>
                            <el-button v-else @click="handlefollowvideo(videodetail.creator.userId, 1)"
                                class="button_userprofile" type="danger" round plain icon="Plus">关注</el-button>
                        </div>
                        <div v-else-if="currenttype === 'mv'" class="creator">
                            <div class="userinfo">
                                <myitem :hoveranim="false" :shadow="false" :routemode="true"
                                    :router="{ name: 'artistdetail', params: { id: videodetail.artists[0].id } }"
                                    :imgurl="`${videodetail.artists[0].img1v1Url}?param=60y60`" class="avatar" />
                                <div class="user">
                                    <mytitle v-for="(ar, i) in videodetail.artists" :key="i" :routemode="true"
                                        :router="{ name: 'artistdetail', params: { id: ar.id } }">{{ i > 0 ? '/' : '' }}{{
                                            ar.name }}
                                    </mytitle>
                                </div>
                            </div>
                        </div>
                        <div v-if="currenttype === 'video' && mvlikeinfo" class="video_main">
                            <span class="video_title">{{ videodetail.title }}</span>
                            <div class="time_number">
                                <span class="video_text">发布:
                                    <timetransform :time="videodetail.publishTime" />
                                </span>
                                <span class="video_text">播放:
                                    <playnumber :number="videodetail.playTime" />
                                </span>
                            </div>
                            <div class="tags_container">
                                <tags class="tag_item" v-for="(item, index) in videodetail.videoGroup" :key="index"
                                    color="gray">{{ item.name }}</tags>
                            </div>
                            <div v-if="videodetail.description" class="desc">
                                {{ videodetail.description }}
                            </div>
                            <div class="button_group">
                                <el-button v-if="mvlikeinfo.liked" type="danger" @click="unlikevideo" round
                                    icon="StarFilled">赞(
                                    <playnumber :number="mvlikeinfo.likedCount" />)
                                </el-button>
                                <el-button v-else type="danger" @click="likevideo" plain round icon="Star">赞(
                                    <playnumber :number="mvlikeinfo.likedCount" />)
                                </el-button>
                                <el-button type="danger" @click="uncollectvideo" v-if="subed" round
                                    icon="FolderChecked">已收藏(
                                    <playnumber :number="videodetail.subscribeCount" />)
                                </el-button>
                                <el-button type="danger" @click="collectvideo" v-else plain round icon="FolderAdd">收藏(
                                    <playnumber :number="videodetail.subscribeCount" />)
                                </el-button>
                            </div>
                        </div>
                        <div v-else-if="currenttype === 'mv' && mvlikeinfo" class="video_main">
                            <span class="video_title">{{ videodetail.name }}</span>
                            <div class="time_number">
                                <span v-if="currenttype === 'video'" class="video_text">发布:
                                    <timetransform :time="videodetail.publishTime" />
                                </span>
                                <span v-else-if="currenttype === 'mv'" class="video_text">发布:{{ videodetail.publishTime
                                }}</span>
                                <span class="video_text video_play">播放:
                                    <playnumber :number="videodetail.playCount" />
                                </span>
                            </div>
                            <div v-if="videodetail.desc" class="desc">
                                {{ videodetail.desc }}
                            </div>
                            <div class="button_group">
                                <el-button v-if="mvlikeinfo.liked" type="danger" @click="unlikemv" round
                                    icon="StarFilled">赞(
                                    <playnumber :number="mvlikeinfo.likedCount" />)
                                </el-button>
                                <el-button v-else type="danger" @click="likemv" plain round icon="Star">赞(
                                    <playnumber :number="mvlikeinfo.likedCount" />)
                                </el-button>
                                <el-button type="danger" @click="uncollectmv" v-if="subed" round icon="FolderChecked">已收藏(
                                    <playnumber :number="videodetail.subCount" />)
                                </el-button>
                                <el-button type="danger" @click="collectmv" v-else plain round icon="FolderAdd">收藏(
                                    <playnumber :number="videodetail.subCount" />)
                                </el-button>
                            </div>
                        </div>
                    </div>
                </part>
                <div class="newest_comment" v-if="currenttype === 'video'">
                    <part v-if="hotcomment.length" title="精彩评论">
                        <Comments :type="5" :id="currentid" :commentslist="hotcomment"></Comments>
                    </part>
                    <part v-if="comment.length" title="最新评论">
                        <Comments :type="5" :id="currentid" :commentslist="comment"></Comments>
                        <el-pagination :page-size="20" layout="prev, pager, next" :pager-count="7" :total="total"
                            :hide-on-single-page="true" v-model:current-page="currentpage" @current-change="currentchange"
                            class="pagination" />
                    </part>
                </div>
                <div v-else-if="currenttype === 'mv'">
                    <part v-if="hotcomment.length" title="精彩评论">
                        <Comments :type="1" :id="currentid" :commentslist="hotcomment"></Comments>
                    </part>
                    <part class="newest_comment" v-if="comment.length" title="最新评论">
                        <Comments :type="1" :id="currentid" :commentslist="comment"></Comments>
                        <el-pagination :page-size="20" layout="prev, pager, next" :pager-count="7" :total="total"
                            :hide-on-single-page="true" v-model:current-page="currentpage" @current-change="currentchange"
                            class="pagination" />
                    </part>
                </div>
                <el-empty v-if="!comment.length && !hotcomment.length" description="暂时没有评论"></el-empty>
            </div>
            <part v-if="relatedvideolist.length" title="相关推荐">
                <div v-if="currenttype === 'video'" class="recommendlist">
                    <div class="item_container" v-for="(item, index) in relatedvideolist" :key="index">
                        <myitem :number="item.playTime" :duration="item.durationms"
                            :imgurl="`${item.coverUrl}?param=130y70`" :routemode="true"
                            :router="{ name: 'videodetail', params: { type: 'video', id: item.vid } }" class="item" />
                        <div class="info">
                            <mytitle :routemode="true"
                                :router="{ name: 'videodetail', params: { type: 'video', id: item.vid } }" class="title">{{
                                    item.title }}</mytitle>
                            <mytitle :routemode="true"
                                :router="{ name: 'userprofile', params: { id: item.creator[0].userId } }" color="light"
                                size="small" class="artist">by: {{ item.creator[0].userName }}</mytitle>
                        </div>
                    </div>
                </div>
                <div v-else-if="currenttype === 'mv'" class="recommendlist">
                    <div class="item_container" v-for="(item, index) in relatedvideolist" :key="index">
                        <myitem :number="item.playCount" :duration="item.duration" :imgurl="`${item.cover}?param=130y70`"
                            :routemode="true" :router="{ name: 'videodetail', params: { type: 'mv', id: item.id } }"
                            class="item" />
                        <div class="info">
                            <mytitle :routemode="true"
                                :router="{ name: 'videodetail', params: { type: 'mv', id: item.id } }" class="title">{{
                                    item.name }}</mytitle>
                            <mytitle :routemode="true"
                                :router="{ name: 'artistdetail', params: { id: item.artists[0].id } }" color="light"
                                size="small" class="artist">by: {{ item.artists[0].name }}</mytitle>
                        </div>
                    </div>
                </div>
            </part>
        </div>
        <el-empty v-else-if="complete && !dataok" description="暂时没有数据"></el-empty>
    </el-scrollbar>
</template>

<script>
import { ref } from '@vue/reactivity';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { computed, onActivated } from '@vue/runtime-core';
import { reqLiketype, reqCollectmv, reqCollectvideo, reqVideodetail, reqVideourl, reqVideolikeinfo, reqCommentvideo, reqRelatedvideo, reqMvdetail, reqMvurl, reqCommentmv, reqRelatedmv, reqMvlikeinfo } from '@/api/video';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import { reqUserfollowe } from '@/api/music';

export default {
    name: 'Videodetail',
    setup() {
        let complete = ref(false);
        let dataok = ref(true);
        const route = useRoute();
        const store = useStore();
        let currentid = ref('')
        let videodetail = ref({})
        let videourl = ref('')
        let comment = ref([])
        let hotcomment = ref([])
        let relatedvideolist = ref([])
        let currenttype = ref('')
        let mvlikeinfo = ref(null)
        let subed = ref(false);
        let total = ref(0);
        let currentpage = ref(1);
        let followed = ref(false);
        let islogin = computed(() => store.state.islogin);
        async function handlefollowvideo(id, follow) {
            try {
                if (islogin) {
                    let result = await reqUserfollowe(id, follow)
                    if (result.code === 200) {
                        if (follow === 1) {
                            followed.value = true;
                            store.commit('FOLLOWE')
                        }
                        else if (follow === 0) {
                            followed.value = false;
                            store.commit('UNFOLLOWE')
                        }
                    }
                }
                else {
                    ElMessage.warning('请先登录在进行操作')
                }
            }
            catch (err) {
                console.log(err)
                ElMessage.error('没有登录或登录环境不够安全，请使用二维码或短信验证重新登录后再尝试')
            }

        }
        async function currentchange() {
            try {
                store.commit('LOAD')
                if (currenttype.value === 'video') {
                    let result = await reqCommentvideo(currentid.value, 20, (currentpage.value - 1) * 20);
                    if (result.code === 200) {
                        comment.value = result.comments;
                        return true;
                    }
                    else return Promise.reject();
                }
                else if (currenttype.value === 'mv') {
                    let result = await reqCommentmv(currentid.value, 20, (currentpage.value - 1) * 20);
                    if (result.code === 200) {
                        comment.value = result.comments;
                        return true;
                    }
                    else return Promise.reject();
                }
            }
            catch (err) {
                console.log(err)
                ElMessage.error('网络异常，获取数据失败');
            }
            finally {
                store.commit('LOADCOMPLETE')
            }
        }
        async function collectvideo() {
            try {
                let result = await reqCollectvideo(currentid.value, 1);
                if (result.code === 200) {
                    subed.value = true;
                    videodetail.value.subscribeCount++;
                    ElMessage.success('收藏视频成功')
                    store.commit('UPDATEVIDEOLIST')
                }
                else throw Error();
            }
            catch (err) {
                console.log(err)
                ElMessage.error('网络异常，操作失败')
            }
        }
        async function uncollectvideo() {
            try {
                let result = await reqCollectvideo(currentid.value, 0);
                if (result.code === 200) {
                    subed.value = false;
                    videodetail.value.subscribeCount--;
                    ElMessage.success('取消收藏视频成功')
                    store.commit('UPDATEVIDEOLIST')
                }
                else throw Error();
            }
            catch (err) {
                console.log(err)
                ElMessage.error('网络异常，操作失败')
            }
        }
        async function collectmv() {
            try {
                let result = await reqCollectmv(currentid.value, 1);
                if (result.code === 200) {
                    subed.value = true;
                    videodetail.value.subCount++;
                    ElMessage.success('收藏MV成功')
                    store.commit('UPDATEVIDEOLIST')
                }
                else throw Error();
            }
            catch (err) {
                console.log(err)
                ElMessage.error('网络异常，操作失败')
            }
        }
        async function uncollectmv() {
            try {
                let result = await reqCollectmv(currentid.value, 0);
                if (result.code === 200) {
                    subed.value = false;
                    videodetail.value.subCount--;
                    ElMessage.success('取消收藏MV成功')
                    store.commit('UPDATEVIDEOLIST')
                }
                else throw Error();
            }
            catch (err) {
                console.log(err)
                ElMessage.error('网络异常，操作失败')
            }
        }
        async function likevideo() {
            try {
                let result = await reqLiketype(currentid.value, 5, 1);
                if (result.code === 200) {
                    mvlikeinfo.value.liked = true;
                    mvlikeinfo.value.likedCount++;
                    ElMessage.success('点赞成功')
                }
                else throw Error()
            }
            catch (err) {
                console.log(err)
                ElMessage.error('网络异常，点赞失败')
            }
        }
        async function unlikevideo() {
            try {
                let result = await reqLiketype(currentid.value, 5, 0);
                if (result.code === 200) {
                    mvlikeinfo.value.liked = false;
                    mvlikeinfo.value.likedCount--;
                    ElMessage.success('取消点赞成功')
                }
                else throw Error()
            }
            catch (err) {
                console.log(err)
                ElMessage.error('网络异常，取消点赞失败')
            }
        }
        async function likemv() {
            try {
                let result = await reqLiketype(currentid.value, 1, 1);
                if (result.code === 200) {
                    mvlikeinfo.value.liked = true;
                    mvlikeinfo.value.likedCount++;
                    ElMessage.success('点赞成功')
                }
                else throw Error()
            }
            catch (err) {
                console.log(err)
                ElMessage.error('网络异常，点赞失败')
            }
        }
        async function unlikemv() {
            try {
                let result = await reqLiketype(currentid.value, 1, 0);
                if (result.code === 200) {
                    mvlikeinfo.value.liked = false;
                    mvlikeinfo.value.likedCount--;
                    ElMessage.success('取消点赞成功')
                }
                else throw Error()
            }
            catch (err) {
                console.log(err)
                ElMessage.error('网络异常，取消点赞失败')
            }
        }
        async function getvideodetail(id) {
            let result = await reqVideodetail(id);
            if (result.code === 200) {
                videodetail.value = result.data;
                subed.value = result.subed;
                followed.value = result.data.creator.followed
                return true;
            }
            else return Promise.reject();
        }
        async function getvideourl(id) {
            let result = await reqVideourl(id);
            if (result.code === 200) {
                videourl.value = result.urls[0];
                return true;
            }
            else return Promise.reject();
        }
        async function getvideocomment(id) {
            let result = await reqCommentvideo(id);
            if (result.code === 200) {
                comment.value = result.comments;
                hotcomment.value = result.hotComments;
                total.value = result.total;
                currentpage.value = 1;
                return true;
            }
            else return Promise.reject();
        }
        async function getrelatedvideo(id) {
            let result = await reqRelatedvideo(id);
            if (result.code === 200) {
                relatedvideolist.value = result.data;
                return true;
            }
            else return Promise.reject();
        }
        async function getmvdtail(id) {
            let result = await reqMvdetail(id);
            if (result.code === 200) {
                videodetail.value = result.data;
                subed.value = result.subed;
                return true;
            }
            else return Promise.reject();
        }
        async function getmvurl(id) {
            let result = await reqMvurl(id);
            if (result.code === 200) {
                videourl.value = result.data;
                return true;
            }
            else return Promise.reject();
        }
        async function getmvcomment(id) {
            let result = await reqCommentmv(id);
            if (result.code === 200) {
                comment.value = result.comments;
                hotcomment.value = result.hotComments;
                total.value = result.total;
                currentpage.value = 1;
                return true;
            }
            else return Promise.reject();
        }
        async function getrelatedmv(id) {
            let result = await reqRelatedmv(id);
            if (result.code === 200) {
                relatedvideolist.value = result.mvs;
                return true;
            }
            else return Promise.reject();
        }
        async function getmvlikeinfo(id) {
            let result = await reqMvlikeinfo(id);
            if (result.code === 200) {
                mvlikeinfo.value = result;
                return true;
            }
            else return Promise.reject();
        }
        async function getvideolikeinfo(id) {
            let result = await reqVideolikeinfo(id);
            if (result.code === 200) {
                mvlikeinfo.value = result;
                return true;
            }
            else return Promise.reject();
        }
        onBeforeRouteUpdate(async (to) => {
            try {
                if (to.name === 'videodetail') {
                    complete.value = false;
                    dataok.value = true;
                    if (to.params.id && (to.params.type === 'video' || to.params.type === 'mv')) {
                        if (to.params.type === 'video') {
                            await getvideodetail(to.params.id);
                            await getvideourl(to.params.id);
                            await getvideocomment(to.params.id);
                            await getrelatedvideo(to.params.id);
                            await getvideolikeinfo(to.params.id);
                            currentid.value = to.params.id;
                            currenttype.value = to.params.type;
                        }
                        else if (to.params.type === 'mv') {
                            await getmvdtail(to.params.id)
                            await getmvurl(to.params.id);
                            await getmvcomment(to.params.id);
                            await getrelatedmv(to.params.id)
                            await getmvlikeinfo(to.params.id);
                            currentid.value = to.params.id;
                            currenttype.value = to.params.type;
                        }
                    }
                    else throw Error('参数错误')
                }
            }
            catch (err) {
                console.log(err)
                ElMessage.error('网络异常，网络请求失败')
                dataok.value = false;
            }
            finally {
                complete.value = true;
            }
        })
        onActivated(async () => {
            try {
                if (route.params.id != currentid.value || route.params.type != currenttype.value) {
                    complete.value = false;
                    dataok.value = true;
                    if (route.params.id && (route.params.type === 'video' || route.params.type === 'mv')) {
                        if (route.params.type === 'video') {
                            await getvideodetail(route.params.id);
                            await getvideourl(route.params.id);
                            await getvideocomment(route.params.id);
                            await getrelatedvideo(route.params.id);
                            await getvideolikeinfo(route.params.id);
                            currentid.value = route.params.id;
                            currenttype.value = route.params.type;
                        }
                        else if (route.params.type === 'mv') {

                            await getmvdtail(route.params.id)
                            await getmvurl(route.params.id);
                            await getmvcomment(route.params.id);
                            await getrelatedmv(route.params.id)
                            await getmvlikeinfo(route.params.id);
                            currentid.value = route.params.id;
                            currenttype.value = route.params.type;
                        }
                    }
                    else throw Error('参数错误')
                }
            }
            catch (err) {
                console.log(err)
                ElMessage.error('网络异常，网络请求失败')
                dataok.value = false;
            }
            finally {
                complete.value = true;
            }
        })
        return { complete, currentchange, followed, handlefollowvideo, total, currentpage, collectvideo, uncollectvideo, collectmv, uncollectmv, subed, unlikemv, likevideo, unlikevideo, likemv, likevideo, mvlikeinfo, currenttype, relatedvideolist, currentid, dataok, route, comment, hotcomment, videodetail, videourl }
    }
}
</script>

<style lang="less" scoped>
.router_container {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    .left {
        display: flex;
        flex-direction: column;
        align-items: center;

        .pagination {
            width: 100%;
            display: flex;
            justify-content: center;
        }

        .videoinfo {
            cursor: default;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-direction: column;
            width: 100%;

            .button_group {
                margin-top: 10px;
            }

            .creator {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;

                .userinfo {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;

                    .avatar {
                        width: 60px;
                        height: 60px;
                        border-radius: 30px;
                    }

                    .user {
                        font-weight: bold;
                        margin-left: 10px;
                        width: 250px;
                        word-break: break-all;
                        text-overflow: ellipsis;
                        /* 文本溢出时显示省略号来代表被修剪的文本 */
                        display: -webkit-box;
                        /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 */
                        -webkit-box-orient: vertical;
                        /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
                        -webkit-line-clamp: 2;
                        /* 文本需要显示多少行 */
                        overflow: hidden;
                    }
                }
            }

            .video_main {
                margin-top: 10px;
            }

            .video_title {
                width: 570px;
                font-size: 30px;
                font-weight: bold;
                word-break: break-all;
                text-overflow: ellipsis;
                /* 文本溢出时显示省略号来代表被修剪的文本 */
                display: -webkit-box;
                /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 */
                -webkit-box-orient: vertical;
                /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
                -webkit-line-clamp: 2;
                /* 文本需要显示多少行 */
                overflow: hidden;
            }

            .time_number {
                margin-top: 10px;
                font-size: 12px;
                color: #BBBBBB;

                .video_play {
                    margin-left: 10px;
                }
            }

            .tags_container {
                margin-top: 10px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: wrap;
                width: 100%;

                .tag_item {
                    margin-right: 10px;
                }
            }

            .desc {
                margin-top: 10px;
                color: #373737;
                font-size: 12px;
                width: 100%;
                word-break: break-all;
                text-overflow: ellipsis;
                /* 文本溢出时显示省略号来代表被修剪的文本 */
                display: -webkit-box;
                /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 */
                -webkit-box-orient: vertical;
                /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
                -webkit-line-clamp: 2;
                /* 文本需要显示多少行 */
                overflow: hidden;
                margin-bottom: 10px;
            }
        }

        .videoplayer {
            height: 400px;
            width: 656px;
            background-color: black;
        }
    }

    .recommendlist {
        display: grid;
        grid-template-columns: repeat(1, 1fr);

        .item_container {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            align-items: flex-start;
            width: 300px;
            border-radius: 5px;

            .item {
                flex-shrink: 0;
                width: 130px;
                height: 70px;
            }

            .info {
                cursor: default;

                .route {
                    cursor: pointer;

                    &:hover {
                        color: #373737;
                    }
                }

                width: 150px;
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                flex-direction: column;

                .title {
                    margin-bottom: 10px;
                    width: 150px;
                    word-break: break-all;
                    text-overflow: ellipsis;
                    /* 文本溢出时显示省略号来代表被修剪的文本 */
                    display: -webkit-box;
                    /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 */
                    -webkit-box-orient: vertical;
                    /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
                    -webkit-line-clamp: 2;
                    /* 文本需要显示多少行 */
                    overflow: hidden;
                }

                .artist {
                    width: 150px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }

        }
    }

}</style>