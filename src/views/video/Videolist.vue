<template>
<el-scrollbar @scroll="scrollhandle">
    <div class="loading" v-if="!complete">
        <el-icon class="is-loading" ><Loading /></el-icon>
        正在加载
    </div>
    <div ref="container" v-if="complete&&dataok" class="router_container">
        <part class="type">
            <div class="category_container">
                <el-popover placement="bottom-start" :width="700" trigger="click">
                    <template #reference>
                        <el-button class="button" type="danger" round>{{currentsort.name}}</el-button>
                    </template>
                    <el-scrollbar class="scroll_bar_pop_container">
                    <div class="pop_container_musiclist">

                            <div class="pop_container_musiclist_sort_container" v-for="(item,index) in grouplist" :key="index" >
                                <span @click="handleClick(item)" class="pop_container_musiclist_sort_child" :class="{'is-active':item.id===currentsort.id}">{{item.name}}</span>
                            </div>
                        
                    </div>
                    </el-scrollbar>
                </el-popover>
                <div class="hotcat_container">
                    <div  v-for="(item,index) in catlist" :key="index" class='sort_container'>
                        <span @click="handleClick(item)" class="sort_child" :class="{'is-active':item.id===currentsort.id}">{{item.name}}</span>
                    </div>
                </div>
            </div>
        </part>
        <part>
            <div class="music_list">
                <div class="item_container"  v-for="(item,index) in videolist" :key="index">
                    <Myitem :duration="item.data.durationms" :routemode="true" :router="{name:'videodetail',params:{id:item.data.vid,type:'video'}}" :imgurl="`${item.data.coverUrl}?param=240y150`" class="item" :number="item.data.playTime"></Myitem>
                    <Mytitle :routemode="true" :router="{name:'videodetail',params:{id:item.data.vid,type:'video'}}" class="title">{{item.data.title}}</Mytitle>
                    <Mytitle size="small" color="light" :routemode="true" :router="{name:'userprofile',params:{id:item.data.creator.userId}}" class="atist">by {{item.data.creator.nickname}}</Mytitle>
                </div>
            </div>
        </part>
    </div>
    <el-empty v-else-if="complete&&!dataok" description="暂时没有数据"></el-empty>
</el-scrollbar>
</template>

<script>
import {ElMessage} from 'element-plus'
import { ref } from '@vue/reactivity';
import { onBeforeMount } from '@vue/runtime-core';
import {reqVideocat,reqVideolist,reqVideogrouplist} from '@/api/music'
import { useStore } from 'vuex';
import __ from 'lodash'
export default {
    name:'Videolist',
    setup(){
        const store=useStore();
        let dataok=ref(true);//数据是否获取成功
        let complete=ref(false);//网络请求是否已经发送完成
        let catlist=ref([])
        let videolist=ref([])
        let grouplist=ref([])
        let currentsort=ref({})
        let container=ref(null)
        let more=false;
        let page=3;
        async function getmore(id,offset=0){
            let result=await reqVideolist(id,offset)
            // console.log(result);
            if(result.code===200){
                for (let x of result.datas){
                    videolist.value.push(x);
                }
                more=result.hasmore;
                page++;
                return true;
            }
            else return Promise.reject();
        }
        async function scroll({scrollTop}){
            if(more){
                if(container.value.scrollHeight<scrollTop+container.value.clientHeight+10){
                    try{
                        store.commit('LOAD')
                        await getmore(currentsort.value.id,page);
                    }
                    catch(err){
                        console.log(err)
                        ElMessage.error('网络异常，数据获取失败')
                    }
                    finally{
                        store.commit('LOADCOMPLETE')
                    }
                }
            }
        }
        const scrollhandle=__.throttle(scroll,1000)
        async function handleClick(cat){
            try{
                if(cat.id!=currentsort.value.id){
                    store.commit('LOAD');
                    await getvideocatid();
                    await getvideogrouplist();
                    videolist.value=[];
                    await getvideolist(cat.id);
                    if(more)await getvideolist(cat.id,1);
                    if(more)await getvideolist(cat.id,2);
                    currentsort.value=cat;
                    
                }
            }
            catch(err){
                console.log(TypeError)
                ElMessage.error('网络异常，获取数据失败')
                dataok.value=false;
            }
            finally{
                store.commit('LOADCOMPLETE')
            }
        }
        async function getvideocatid(){
            let result=await reqVideocat()
            // console.log(result);
            if(result.code===200){
                catlist.value=result.data;
                return true;
            }
            else return Promise.reject();
        }
        async function getvideogrouplist(){
            let result=await reqVideogrouplist()
            // console.log(result);
            if(result.code===200){
                grouplist.value=result.data;

                return true;
            }
            else return Promise.reject();
        }
        async function getvideolist(id,offset=0){
            let result=await reqVideolist(id,offset)
            // console.log(result);
            if(result.code===200){
                for (let x of result.datas){
                    videolist.value.push(x);
                }
                more=result.hasmore;
                return true;
            }
            else return Promise.reject();
        }
        onBeforeMount(async ()=>{
            try{
                await getvideocatid();
                await getvideogrouplist();
                await getvideolist(catlist.value[0].id);
                if(more) await getvideolist(catlist.value[0].id,1);
                if(more) await getvideolist(catlist.value[0].id,2);
                currentsort.value=catlist.value[0];
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
        return {handleClick,scrollhandle,container,currentsort,grouplist,complete,dataok,catlist,videolist}
    }
}
</script>

<style lang="less" scoped>

.router_container{
    width: 100%;
    .type{
        .category_container{
            width: 100%;
            // background-color: yellow;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: nowrap;
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
    .music_list{
        .item_container{
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            margin: 5px 0;
            flex-shrink: 0;
            .item{
                width: 240px;
                height: 150px;
            }
            .title{
                width: 240px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden
            }
        }
        display: grid;
        grid-template-columns:repeat(3,1fr);
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
        .scroll_bar_pop_container{

    }
.pop_container_musiclist{
    display: grid;
    grid-template-columns: repeat(6,1fr);
    max-height: 400px;
    width: 100%;
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