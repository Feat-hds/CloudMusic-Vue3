<template>
<el-scrollbar>
    <div class="loading" v-if="!complete">
        <el-icon class="is-loading" ><Loading /></el-icon>
        正在加载
    </div>
    <div v-if="complete&&dataok" class="recommend_container">
        <!-- 首页轮播图 -->
        <el-carousel :interval="5000" class="el-carousel" type="card" indicator-position="outside" trigger="click" height='200px'>
            <el-carousel-item @click="bannerclick(item)" v-for="(item,index) in banner" :key="index">
            <el-image :src="`${item.imageUrl}?param=500y200`" :alt="item.tyoeTitle">
                <template #error>
                    <div class="image-slot">
                        <el-icon><Picture /></el-icon>
                    </div>
                </template>
                <template #placeholder>
                    <div class="loading">
                        <el-icon class="is-loading" ><Loading /></el-icon>
                        loading
                    </div>
                </template>
            </el-image>
            </el-carousel-item>
        </el-carousel>
        <!-- 推荐歌单 -->
            <part title="推荐歌单" :routemode="true" :router="{path:'/discovermusic/musiclist'}">
                <div class="recommend_list">
                    <div v-if="islogin" class="music_item">
                        <Myitem :routemode="true" :router="{name:'dailyrecommend'}" :shadow="false" type="dailyrecommend" class="item"></Myitem>
                        <Mytitle :routemode="true" :router="{name:'dailyrecommend'}" class="title">每日歌曲推荐</Mytitle>
                    </div>
                    <div class="music_item"  v-for="(item,index) in personalized" :key="index">
                        <Myitem v-if="index<9||!islogin" :imgurl="`${item.picUrl}?param=150y150`" :routemode="true" :router="{name:'musiclistdetail',params:{id:item.id}}" :number="item.playCount" class="item"></Myitem>
                        <Mytitle v-if="index<9||!islogin" :routemode="true" :router="{name:'musiclistdetail',params:{id:item.id}}" class="title">{{item.name}}</Mytitle>
                    </div>
                </div>
                
            </part>
            <!-- 最新音乐部分 -->
            <part title="最新音乐" :routemode="true" :router="{name:'topsong'}">
                <div class="newest_music" >
                    <div @dblclick="addmusicandplay(item)" class="music_item"  v-for="(item,index) in personalizednewsong" :key="index">
                        <Myitem @click="addmusicandplay(item)" :shadow="false" :imgurl="`${item.picUrl}?param=50y50`" :id="item.id" class="item"></Myitem>
                        <div class="text_container">
                            <Mytitle hover="default" class="title">{{item.name}}</Mytitle>
                            <div class="sub">
                                <Mytitle v-for="(artist,index_a) in item.song.artists" :key="index_a" :routemode="true" :router="{name:'artistdetail',params:{id:artist.id}}" class="subtitle" size="small" color="light"><span class="seg" v-if="index_a>0">/</span>{{artist.name}}</Mytitle>
                            </div>
                        </div>
                       
                    </div>
                </div>
            </part>
            <!-- 热门播客部分 -->
            <part title="热门播客" :routemode="true" :router="{name:'radio'}">
                <div class="hot_player">
                    <div class="music_item" :mainTrackid="item.mainTrackId"  v-for="(item,index) in programlist" :key="index">
                        <Myitem :router="{name:'radiodetail',params:{id:item.radio.id}}"  :routemode="true" :shadow="false" :imgurl="`${item.coverUrl}?param=80y80`" class="item"></Myitem>
                        <div class="text_container">
                            <Mytitle hover="default"  class="title">{{item.name}}</Mytitle>
                            <tags class="tag" color="gray">{{item.radio.secondCategory}}</tags>
                            <div class="detail">
                                <Mytitle :router="{name:'radiodetail',params:{id:item.radio.id}}"  :routemode="true" class="artist" size="small" color="light" >{{item.radio.name}}</Mytitle>
                                <Mytitle class="number" size="small" color="light" hover="default">
                                    <svg-icon iconClass="bx-play" class="icon"></svg-icon>
                                    <Playnumber :number="item.listenerCount"></Playnumber>
                                </Mytitle>
                                <Mytitle class="number" size="small" color="light" hover="default">
                                    <svg-icon iconClass="bx-timer" class="icon"></svg-icon>
                                    <Duration :time="item.duration"></Duration>
                                </Mytitle>
                            </div>
                        </div>
                    </div>
                </div>
            </part>
            <!-- 独家放松部分 -->
            <part title="独家放松">
                <div class="exclusive_mv">
                    <div class="music_item"  v-for="(item,index) in exclusivemvlist" :key="index">
                        <Myitem :shadow="false" :imgurl="`${item.picUrl}?param=300y140`" :routemode="true" :router="{name:'videodetail',params:{type:'mv',id:item.id}}" class="item"></Myitem>
                        <Mytitle :routemode="true" :router="{name:'videodetail',params:{type:'mv',id:item.id}}" class="title">{{item.name}}</Mytitle>
                    </div>
                </div>
            </part>
            <!-- 推荐MV部分 -->
            <part title="推荐MV" :routemode="true" :router="{path:'/video/mv'}">
                <div class="recommend_mv">
                    <div class="music_item"  v-for="(item,index) in mvlist" :key="index">
                        <Myitem :routemode="true" :imgurl="`${item.picUrl}?param=300y140`" :router="{name:'videodetail',params:{type:'mv',id:item.id}}" :number="item.playCount" class="item"></Myitem>
                        <Mytitle :routemode="true" :router="{name:'videodetail',params:{type:'mv',id:item.id}}" class="title">{{item.name}}</Mytitle>
                        <Mytitle :routemode="true" :router="{name:'artistdetail',params:{id:item.artistId}}" class="title" size="small" color="light">{{item.artistName}}</Mytitle>
                    </div>
                </div>
            </part>
    </div>
    <el-empty v-else-if="complete&&!dataok" description="暂时没有数据"></el-empty>
</el-scrollbar>
</template>

<script>
import {reqExclusivevideo,reqMusicdetail,reqPersonalizedmv,reqPersonalizedprogramrecommend,reqPersonalized,reqBanner, reqPersonalizednewsong} from'@/api/music'
import { useStore } from 'vuex'
import { computed, onBeforeMount, ref } from '@vue/runtime-core';
import {ElMessage} from 'element-plus'
import {useRouter} from 'vue-router'
export default {
    name:'Priviterecommend',
    setup(){
        const store=useStore();
        const router=useRouter();
        let exclusivemvlist=ref([])
        let mvlist=ref([]);
        let banner=ref([]);//轮播图列表
        let personalized=ref([]); //推荐歌单列表
        let personalizednewsong=ref([]); //最新音乐列表
        let complete=ref(false);//网络请求是否已经发送完成
        let islogin=computed(()=>store.state.islogin); //获取登录状态
        let dataok=ref(true);//数据是否获取成功
        let programlist=ref([]);//热门播客列表
        let nextlock=computed(()=>store.state.nextlock)
        let lyriclock=computed(()=>store.state.lyriclock)
        let commentlock=computed(()=>store.state.commentlock)
        function addmusicandplay(item){
            if(!nextlock.value&&!lyriclock.value&&!commentlock.value){
                store.commit('LOCK')
                let row=item.song;
                row.al=row.album;
                row.ar=row.artists;
                row.alia=row.alias;
                row.dt=row.duration;
                row.mv=row.mvid;
                store.dispatch('addmusicandplay',row)
            }
        }
        async function bannerclick(item){
            try{
                switch(item.targetType){
                    case 1:
                        try{
                            if(!nextlock.value&&!lyriclock.value&&!commentlock.value){
                                store.commit('LOCK')
                                let songresult=await reqMusicdetail(item.targetId);
                                if(songresult.code===200){
                                    store.dispatch('addmusicandplay',songresult.songs[0])
                                }
                            }
                        }
                        catch(err){
                            console.log(err)
                            store.commit('UNLOCK')
                        }
                        break;
                    case 10:
                        router.push({name:'albumsdetail',params:{id:item.targetId}})
                        break;
                    case 100:
                        router.push({name:'artistdetail',params:{id:item.targetId}})
                        break;
                    case 1000:
                        router.push({name:'musiclistdetail',params:{id:item.targetId}})
                        break;
                    case 1002:
                        router.push({name:'userprofile',params:{id:item.targetId}})
                        break;
                    case 1004:
                        router.push({name:'videodetail',params:{id:item.targetId,type:'mv'}})
                        break;
                    case 1006:
                        break;
                    case 1009:
                        router.push({name:'radiodetail',params:{id:item.targetId}})
                        break;
                    case 1014:
                        router.push({name:'avideodetail',params:{id:item.targetId,type:'video'}})
                        break;
                    case 1018:
                        break;
                    case 2000:
                        break;
                    default:
                        break;
                }
            }
            catch(er){
                console.log(err)
                ElMessage.error('网络连接异常，获取信息失败')
            }
        }
        async function getbanner(){//首页轮播图
            let result=await reqBanner();
            // console.log(result);
            if(result.code===200) {
                banner.value=result.banners;
                return true;
            }
            else return Promise.reject();
        }
        async function getpersonalized(){//获取推荐歌单列表
            let number;
            if(islogin.value){
                number=9;
            }
            else number=10;
            let result=await reqPersonalized(number);
            // console.log(result);
            if(result.code===200) {
                personalized.value=result.result;
                return true;
            }
            else return Promise.reject();
        }
         async function getpersonalizednewsong(){//获取最新音乐列表
            let result=await reqPersonalizednewsong(12);
            // console.log(result);
            if(result.code===200) {
                personalizednewsong.value=result.result;
                return true;
            }
            else return Promise.reject();
        }
        async function getpersonalizedprogramrecommend(){//获取热门播客列表
            let result=await reqPersonalizedprogramrecommend(6);
            // console.log(result);
            if(result.code===200) {
                programlist.value=result.programs;
                return true;
            }
            else return Promise.reject();
        }
        async function getpersonalizedmv(){//获取推荐MV列表
            let result=await reqPersonalizedmv(3);
            // console.log(result);
            if(result.code===200) {
                mvlist.value=result.result;
                mvlist.value=mvlist.value.slice(0,3);
                // console.log(mvlist);
                return true;
            }
            else return Promise.reject();
        }
        async function getexclusivevideo(){//获得独家放松列表
            let result=await reqExclusivevideo(3);
            // console.log(result);
            if(result.code===200) {
                exclusivemvlist.value=result.result;
                // mvlist.value=mvlist.value.slice(0,3);
                return true;
            }
            else return Promise.reject();
        }
        onBeforeMount(async ()=>{
            try{
                await getbanner();
                await getpersonalized();
                await getpersonalizednewsong();
                await getpersonalizedprogramrecommend();
                await getpersonalizedmv();
                await getexclusivevideo();
            }
            catch(err){
                ElMessage.error('网络异常，获取数据失败');
                console.log(err.message);
                dataok.value=false; 
            }
            finally{
                complete.value=true;
            }
        })
        return {exclusivemvlist,addmusicandplay,bannerclick,mvlist,programlist,personalizednewsong,dataok,islogin,banner,complete,personalized}
    }
}
</script>

<style lang="less" scoped>
.recommend_container{
    width: 100%;
    height: calc(100vh - 204px);
    .recommend_list{
        .music_item{
            margin: 5px 0;
            flex-shrink: 0;
        }
        .item{
            width: 150px;
            height: 150px;
            flex-shrink: 0;
        }
        .title{
            width: 150px;
            word-break: break-all;
            text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
            display: -webkit-box; /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 */
            -webkit-box-orient: vertical; /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
            -webkit-line-clamp: 2; /* 文本需要显示多少行 */
            overflow: hidden;
        }
        display: grid;
        grid-template-columns: repeat(5,1fr);    
        }
    .newest_music{
        .music_item{
            &:hover{
                background-color: #EAEAEA;
            }
            border-radius: 5px;
            display: flex;
            justify-content: flex-start;
            margin: 5px 0;
            width: 255px;
            .item{
                width: 50px;
                height: 50px;
            }
            .text_container{
                margin-left: 5px;
                width: 200px;
                height: 50px;
                display: flex;
                flex-direction: column;
                align-items: flex-star;
            }
            .title{
                width: 200px;
                overflow: hidden;
                word-break:break-all;
                flex-wrap: nowrap;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .sub{

                margin-top: 10px;
                width: 200px;
                height: 20px;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: nowrap;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                
            }
            .subtitle{
                display: flex;
                align-items: center;
                justify-content: flex-start;
                overflow: hidden;
                word-break:break-all;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .seg{
                margin: 0 2px;
            }
        }
        display: grid;
        grid-template-columns:repeat(3,1fr);
    }
    .exclusive_mv{
        .music_item{
            display: flex;
            justify-content: flex-start;
            flex-direction: column;
            margin: 5px 0;
            .item{
                width: 300px;
                height: 140px;
            }
            .title{
                word-break:break-all;
                width: 300px;
                text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
                display: -webkit-box; /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 */
                -webkit-box-orient: vertical; /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
                -webkit-line-clamp: 2; /* 文本需要显示多少行 */
                overflow: hidden;
            }
        }
        display: grid;
        grid-template-columns:repeat(3,1fr);
    }
    .recommend_mv{
        .music_item{
            display: flex;
            justify-content: flex-start;
            flex-direction: column;
            margin: 5px 0;
            .item{
                width: 300px;
                height: 140px;
            }
            .title{
                width: 300px;
                word-break:break-all;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden
            }
        }
        display: grid;
        grid-template-columns:repeat(3,1fr);
    }
    .hot_player{
        .music_item{
            &:hover{
                background-color: #EAEAEA;
            }
            border-radius: 5px;
            margin: 5px 0;
            width: 400px;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            .item{
                width: 80px;
                height: 80px;
            }
            .text_container{
                margin-left: 5px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: flex-start;
                width: 310px;
                height: 80px;
                .title{
                    width: 310px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break:break-all;
                }
                .detail{
                    width: 310px;
                    overflow: hidden;
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    flex-wrap: nowrap;
                    .artist{
                        max-width: 200px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        word-break:break-all;
                    }
                    .number{
                        margin-left: 5px;
                        display: flex;
                        align-items: center;
                    }
                }
            }

        }
        display: grid;
        grid-template-columns:repeat(2,1fr);
    }
}

</style>