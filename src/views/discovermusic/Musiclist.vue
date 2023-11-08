<template>
<el-scrollbar>
    <div class="loading" v-if="!complete">
        <el-icon class="is-loading" ><Loading /></el-icon>
        正在加载
    </div>
    <div  v-if="complete&&dataok" class="router_container">
        <part class="header">
            <div @click="routertohighquality" class="card banner">
                <div class="drop-shadow">
                    <el-image :src="`${highqualitylist.coverImgUrl}?param=140y140`" class="cover">
                        <template #error>
                            <div class="image-slot">
                                <el-icon><Picture /></el-icon>
                            </div>
                        </template>
                        <template #placeholder>
                            <div class="image-slot-loading">
                                <el-icon class="is-loading" ><Loading /></el-icon>
                                loading
                            </div>
                        </template>
                    </el-image>
                    <div @click="routertohighquality" class="content">
                        <span class="highquality">精品歌单</span>
                        <span class="title">{{highqualitylist.name}}</span>
                    </div>
                </div>
            </div>
        </part>
        <part class="type">
            <div class="category_container">
                <el-popover placement="bottom-start" :width="700" trigger="click">
                    <template #reference>
                        <el-button class="button" type="danger" round>{{currentsort.name}}</el-button>
                    </template>
                    <div class="all_type">
                        <span @click="handleClick({name:'全部',id:0})" class="all_type_sort_child" :class="{'is-active':currentsort.id===0}">全部分类</span>
                    </div>
                    <div class="pop_container_musiclist">
                        <div class="pop_container_musiclist_sort_container" v-for="(item,index) in allcat" :key="index" >
                            <span @click="handleClick(item)" class="pop_container_musiclist_sort_child" :class="{'is-active':item.id===currentsort.id}">{{item.name}}</span>
                        </div>
                    </div>
                </el-popover>
                <div class="hotcat_container">
                    <div  v-for="(item,index) in hotcat" :key="index" class='sort_container'>
                        <span @click="handleClick(item)" class="sort_child" :class="{'is-active':item.id===currentsort.id}">{{item.name}}</span>
                    </div>
                </div>
            </div>
        </part>
        <part class="music_list_container">
            <div class="music_list">
                <div class="item_container"  v-for="(item,index) in playlist" :key="index">
                    <Myitem :creator="item.creator" :imgurl="item.coverImgUrl" :routemode="true" :router="{name:'musiclistdetail',params:{id:item.id}}" class="item" :number="item.playCount"></Myitem>
                    <Mytitle :routemode="true" :router="{name:'musiclistdetail',params:{id:item.id}}" class="title">{{item.name}}</Mytitle>
                </div>
            </div>
            <el-pagination
            :page-size="50"
            layout="prev, pager, next"
            :pager-count="7"
            :total="total"
            :hide-on-single-page="true"
            v-model:current-page="currentpage"
            @current-change="currentchange"
            />
        </part>
    </div>
    <el-empty v-else-if="complete&&!dataok" description="暂时没有数据"></el-empty>
</el-scrollbar>
</template>

<script>
import { onBeforeMount, ref, useSlots } from '@vue/runtime-core';
import {reqHighqualityplaylist,reqHotcat,reqAllcat,reqPlaylist} from '@/api/music'
import { useRouter } from 'vue-router';
import {ElMessage} from 'element-plus';
import { useStore } from 'vuex';

export default {
    name:'Musiclist',
    setup(){
        const store=useStore()
        let currentsort=ref({})
        let hotcat=ref([]);
        let allcat=ref([]);
        const router=useRouter();
        let dataok=ref(true);//数据是否获取成功
        let complete=ref(false);//网络请求是否已经发送完成
        let highqualitylist=ref({});
        let playlist=ref([]);
        let total=ref(0);
        let currentpage=ref(1);
        async function currentchange(){
            try{
                store.commit('LOAD')
                let result=await reqPlaylist(currentsort.value.name,50,50*(currentpage.value-1));
                // console.log(result);
                if(result.code===200){
                    playlist.value=result.playlists;
                    return true;
                }
                else return Promise.reject();
            }
            catch(err){
                console.log(err)
                ElMessage.error('网络异常，获取数据失败');
            }
            finally{
                store.commit('LOADCOMPLETE')
            }
        }
        function routertohighquality(){
            router.push({name:'highqualitymusiclist',params:{cat:currentsort.value.name}})
        }
        async function handleClick(cat){
            try{
                if(currentsort.value.id!=cat.id){
                    store.commit('LOAD')
                    await gethighquality(cat.name,1);
                    await getplaylist(cat.name,50);
                    currentsort.value=cat;
                }            
            }
            catch(err){
                console.log(err)
                ElMessage.error('网络请求错误')
                dataok.value=false;
            }
            finally{
                store.commit('LOADCOMPLETE')
            }
        }
        async function gethotcat(){ //获取热门分类
            let result=await reqHotcat();
            // console.log(result);
            if(result.code===200){
                hotcat.value=result.tags;
                currentsort.value=result.tags[0];
                return true;
            }
            else return Promise.reject();
        }
        async function gethighquality(cat,number){ //获取精品歌单
            let result=await reqHighqualityplaylist(cat,number);
            // console.log(result);
            if(result.code===200){
                highqualitylist.value=result.playlists[0];
                return true;
            }
            else return Promise.reject();
        }
        async function getallcat(){//获取所有歌单分类
            let result=await reqAllcat();
            // console.log(result);
            if(result.code===200){
                allcat.value=result.tags;
                return true;
            }
            else return Promise.reject();
        }
        async function getplaylist(cat,limit){//获取分类中的热门歌单列表
            let result=await reqPlaylist(cat,limit);
            // console.log(result);
            if(result.code===200){
                playlist.value=result.playlists;
                total.value=result.total
                currentpage.value=1;
                return true;
            }
            else return Promise.reject();
        }
        onBeforeMount(async ()=>{
            try{
                await gethotcat();
                await getallcat();
                await gethighquality(currentsort.value.name,1);
                await getplaylist(currentsort.value.name,50);
            }
            catch(err){
                console.log(err.message)
                ElMessage.error('网络异常，获取数据失败')
                dataok.value=false;
            }
            finally{
                complete.value=true;
            }
            
        })
        return{handleClick,currentchange,currentpage,total,currentsort,routertohighquality,highqualitylist,playlist,allcat,hotcat,dataok,complete}
    }
}
</script>

<style lang="less" scoped>

.router_container{
    width: 100%;
    .header{
        .card{
            background-color: #373737;
            width: 100%;
            height: 170px;
            border-radius: 10px;
            cursor: pointer;
            .cover{
                // background-color: gray;
                width: 140px;
                height: 140px;
                margin-left: 15px;
                border-radius: 7px;
            }
            .content{
                height: 140px;
                margin-left: 15px;
                flex-grow: 1;
                display: flex;
                justify-content: space-around;
                flex-direction: column;
                align-items: flex-start;
                .highquality{
                    color: #E7AA5A;
                    display: block;
                    border-radius: 50px;
                    border:1px solid #E7AA5A;
                    padding: 5px 10px;
                }
                .title{
                    color: white;
                    font-size: 20px;
                }
            }
        }
        .banner{
            background-position: center ;
        }
        .drop-shadow{
            height: 100%;
            width: 100%;
            filter: drop-shadow( 0px 20px 10px
            rgba(0, 0, 0, 0.5));
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
    }
    .type{
        .category_container{
            width: 100%;
            // background-color: yellow;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .hotcat_container{
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                .sort_container{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    // width: 60px;
                    // border-right-style: solid;
                    // border-right-color: #F2F2F2;
                    // border-width: 1px;
                    .sort_child{
                        display: inline-block;
                        text-align: center;
                        font-size: 12px;
                        color: #676767;
                        cursor: pointer;
                        padding: 2px 10px;
                        &:hover{
                            color: #373737;
                        }
                    }
                    .is-active{
                        color: #EC4141;
                        background-color: #FDF5F5;
                        border-radius: 10px;
                        &:hover{
                            color: #EC4141;
                            background: #FDEDED;
                        }
                    }
                }
            }
        }
    }
    .music_list_container{
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }
    .music_list{
        width: 100%;
        .item_container{
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            margin: 5px 0;
            flex-shrink: 0;
            .item{
                width: 150px;
                height: 150px;
            }
            .title{
                width: 150px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden
            }
        }
        display: grid;
        grid-template-columns:repeat(5,1fr);
        // display: flex;
        // flex-wrap: wrap;
    }
    height: calc(100vh - 204px);
}
</style>
<style lang="less">
.all_type{
        width: 100%;
        border-bottom: 1px solid #BBBBBB;
        padding: 10px 0;
        .all_type_sort_child{
            margin-left: 26px;
            cursor: pointer;
            display: inline-block;
            text-align: center;
            font-size: 12px;
            color: #676767;
            cursor: pointer;
            padding: 2px 10px;
            &:hover{
                color: #373737;
            }
        }
        .is-active{
            color: #EC4141;
            background-color: #FDF5F5;
            border-radius: 10px;
            &:hover{
                color: #EC4141;
                background: #FDEDED;
            }
        }
    }
.pop_container_musiclist{
    display: grid;
    grid-template-columns: repeat(6,1fr);
    .pop_container_musiclist_sort_container{
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px 0;
        // width: 60px;
        // border-right-style: solid;
        // border-right-color: #F2F2F2;
        // border-width: 1px;
        .pop_container_musiclist_sort_child{
            display: inline-block;
            text-align: center;
            font-size: 12px;
            color: #676767;
            cursor: pointer;
            padding: 2px 10px;
            &:hover{
                color: #373737;
            }
        }
        .is-active{
            color: #EC4141;
            background-color: #FDF5F5;
            border-radius: 10px;
            &:hover{
                color: #EC4141;
                background: #FDEDED;
            }
        }
    }
}
</style>