<template>

<el-scrollbar @scroll="scrollhandle">
    <div class="loading" v-if="!complete">
        <el-icon class="is-loading" ><Loading /></el-icon>
        正在加载
    </div>
    <div ref="container" v-if="complete&&dataok" class="router_container">
        <part>
            <div class="category_container">
                <div class="hotcat_container">
                    <span class="sort_title">语言:</span>
                    <div  v-for="(item,index) in catlistarea" :key="index" class='sort_container'>
                        <span @click="handleClick(item,1)" class="sort_child" :class="{'is-active':item.id===currentarea}">{{item.name}}</span>
                    </div>
                </div>
                <div class="hotcat_container">
                    <span class="sort_title">分类:</span>
                    <div  v-for="(item,index) in catlisttype" :key="index" class='sort_container'>
                        <span @click="handleClick(item,2)" class="sort_child" :class="{'is-active':item.id===currenttype}">{{item.name}}</span>
                    </div>
                </div>
                <div class="hotcat_container">
                    <span class="sort_title">筛选:</span>
                    <div  v-for="(item,index) in catlistinitial" :key="index" class='sort_container'>
                        <span @click="handleClick(item,3)" class="sort_child" :class="{'is-active':item.id===currentinitial}">{{item.name}}</span>
                    </div>
                </div>
            </div>
        </part>
        <part>
            <div class="list">
                <div v-for="(item,index) in artistlist" class="item_container" :key="index">
                    <myitem :shadow="false" :routemode="true" :router="{name:'artistdetail',params:{id:item.id}}" :imgurl="`${item.picUrl}?param=150y150`" class="item"></myitem>
                    <Mytitle :routemode="true" :router="{name:'artistdetail',params:{id:item.id}}"  class="title">{{item.name}}</Mytitle>
                </div>
            </div>
        </part>
    </div>
    <el-empty v-else-if="complete&&!dataok" description="暂时没有数据"></el-empty>
</el-scrollbar>

</template>

<script>

import {reqArtistlist} from '@/api/music'
import { ref } from '@vue/reactivity';
import {onBeforeMount } from '@vue/runtime-core';
import {ElMessage} from 'element-plus'
import { useStore } from 'vuex';
import __ from 'lodash'
export default {
    name:'Artist',
    setup(){
        let dataok=ref(true);//数据是否获取成功
        let complete=ref(false);//网络请求是否已经发送完成
        const store=useStore();
        let artistlist=ref([]);
        let container=ref(null);
        const catlistinitial=[{name:'热门',id:'-1'},{name:'A',id:'a'},{name:'B',id:'b'},{name:'C',id:'c'},{name:'D',id:'d'},{name:'E',id:'e'},{name:'F',id:'f'},{name:'G',id:'g'},{name:'H',id:'h'},{name:'I',id:'i'},{name:'J',id:'j'},{name:'K',id:'k'},{name:'L',id:'l'},{name:'M',id:'m'},{name:'N',id:'n'},{name:'O',id:'o'},{name:'P',id:'p'},{name:'Q',id:'q'},{name:'R',id:'r'},{name:'S',id:'s'},{name:'T',id:'t'},{name:'U',id:'u'},{name:'V',id:'v'},{name:'W',id:'w'},{name:'X',id:'x'},{name:'Y',id:'y'},{name:'Z',id:'z'},{name:'#',id:'0'}]
        const catlistarea=[{name:'全部',id:'-1'},{name:'华语',id:'7'},{name:'欧美',id:'96'},{name:'日本',id:'8'},{name:'韩国',id:'16'},{name:'其他',id:'0'}]
        const catlisttype=[{name:'全部',id:'-1'},{name:'男歌手',id:'1'},{name:'女歌手',id:'2'},{name:'乐队组合',id:'3'}]
        let currentarea=ref('-1')
        let currenttype=ref('-1')
        let currentinitial=ref('-1')
        let more=false;
        let page=1;
        async function getmore(area,type,initial,limit=40,offset=0){
            let result=await reqArtistlist(limit,offset,type,area,initial);
            // console.log(result);
            if(result.code===200){
                for(let x of result.artists){
                    artistlist.value.push(x);
                }
                more=result.more;
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
                        await getmore(currentarea.value,currenttype.value,currentinitial.value,40,page*40);
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
        async function handleClick(cat,n){
            try{
                if(n===1){
                    store.commit('LOAD')
                    if(currentarea.value!=cat.id){
                        await getartistlist(cat.id,currenttype.value,currentinitial.value);
                        currentarea.value=cat.id;
                    }
                }
                else if(n===2){
                    store.commit('LOAD')
                    if(currenttype.value!=cat.id){
                        await getartistlist(currentarea.value,cat.id,currentinitial.value);
                        currenttype.value=cat.id;
                    }
                    
                }
                else if(n===3){
                    store.commit('LOAD')
                    if(currentinitial.value!=cat.id){
                        await getartistlist(currentarea.value,currenttype.value,cat.id);
                        currentinitial.value=cat.id
                    }
                }
            }
            catch(err){
                console.log(err)
                ElMessage.error('网络请求失败')
                dataok.value=false;
            }
            finally{
                store.commit('LOADCOMPLETE')
            }
        }
        async function getartistlist(area,type,initial,limit=40,offset=0){
            let result=await reqArtistlist(limit,offset,type,area,initial);
            // console.log(result);
            if(result.code===200){
                artistlist.value=result.artists;
                more=result.more;
                page=1;
                return true;
            }
            else return Promise.reject();
        }
        // onBeforeRouteUpdate(async (to)=>{
        //     try{
        //         if(to.name==='artist'){
        //             complete.value=false;
        //             dataok.value=true;
        //             if(to.params.area&&to.params.initial&&to.params.type){
        //                 await getartistlist(to.params.area,to.params.type,to.params.initial);
        //                 currentarea.value=to.params.area;
        //                 currentinitial.value=to.params.initial;
        //                 currenttype.value=to.params.type;
        //             }
        //             else throw('网页参数错误')
        //         }
        //     }
        //     catch(err){
        //         console.log(err.message)
        //         ElMessage.error('网络异常，获取数据失败')
        //         dataok.value=false;
        //     }
        //     finally{
        //         complete.value=true;
        //     }


        // })
        onBeforeMount(async ()=>{
            try{
                    await getartistlist(currentarea.value,currenttype.value,currentinitial.value);
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
        return {currentarea,container,scrollhandle,currenttype,currentinitial,handleClick,artistlist,complete,dataok,catlistinitial,catlistarea,catlisttype}
    }
}
</script>
<style lang="less" scoped>

.router_container{
        .category_container{
            width: 100%;
            // background-color: yellow;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-direction: column;

            .hotcat_container{
                margin: 5px 10px;
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                .sort_title{
                    cursor: default;
                    font-size: 12px;
                    color: #676767;
                    display: inline-block;
                    text-align: center;
                    padding: 2px 0;
                    margin-right: 10px;
                }
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
                        border-radius: 10px;
                        &:hover{
                            color: #373737;
                        }
                    }
                    .is-active{
                        color: #EC4141;
                        background-color: #FDF5F5;

                        &:hover{
                            color: #EC4141;
                            background: #FDEDED;
                        }
                    }
                }
            }
        }
    .list{
        display: grid;
        grid-template-columns: repeat(5,1fr);
        .item_container{
            margin:5px 0;
            .item{
                width: 150px;
                height: 150px;
            }
            .title{
                width: 150px;
                display: inline-block;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden
            }
        }
    }
    height: calc(100vh - 204px);
}
</style>