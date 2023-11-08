<template>
    <el-scrollbar @scroll="scrollhandle">
        <div class="loading" v-if="!complete">
            <el-icon class="is-loading" ><Loading /></el-icon>
            正在加载
        </div>
        <div ref="container" v-if="complete&&dataok" class="router_container">
            <part title="精品歌单">
                <div class="radiotype">
                    <part class="type">
                        <div class="category_container">
                            <el-popover placement="bottom-start" :width="700" trigger="click">
                                <template #reference>
                                    <el-button class="button" type="danger" round>{{cat}}</el-button>
                                </template>
                                <div class="all_type">
                                    <span @click="handleClick('全部')" class="all_type_sort_child" :class="{'is-active':cat==='全部'}">全部分类</span>
                                </div>
                                <div class="pop_container_musiclist">
                                    <div class="pop_container_musiclist_sort_container" v-for="(item,index) in allcat" :key="index" >
                                        <span @click="handleClick(item)" class="pop_container_musiclist_sort_child" :class="{'is-active':item===cat}">{{item}}</span>
                                    </div>
                                </div>
                            </el-popover>
                        </div>
                    </part>
                    <div class="recommend">
                        <div class="item_container" v-for="(item,index) in highqualitylist" :key="index">
                            <myitem :routemode="true" :router="{name:'musiclistdetail',params:{id:item.id}}" :imgurl="`${item.coverImgUrl}?param=130y130`" class="item" ></myitem>
                            <div class="info">
                                <Mytitle class="title" :routemode="true" :router="{name:'musiclistdetail',params:{id:item.id}}" >{{item.name}}</Mytitle>
                                <Mytitle class="title" size="" color="light" :router="{name:'artistdetail',params:{id:item.creator.userId}}" :routemode="true">by:{{item.creator.nickname}}</Mytitle>
                                <div class="brief_text">{{item.copywriter}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </part>
        </div>
        <el-empty v-else-if="complete&&!dataok" description="暂时没有数据"></el-empty>
    </el-scrollbar>
</template>

<script>
import { ref } from '@vue/reactivity'
import {reqAllcat,reqHighqualityplaylist} from '@/api/music'
import { onActivated, onBeforeMount } from '@vue/runtime-core';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import {ElMessage} from 'element-plus'
import __ from 'lodash'
import {useStore} from 'vuex'

export default {
    name:'Highqualitymusiclist',
    setup(){
        let allcat=ref([]);
        let dataok=ref(true);//数据是否获取成功
        let complete=ref(false);//网络请求是否已经发送完成
        let highqualitylist=ref([])
        const route=useRoute();
        const store=useStore();
        let cat=ref(null)
        let container=ref(null)
        let more=false;
        let updatetime=0;
        async function handleClick(catt){
            try{
                if(cat.value=catt){
                    store.commit('LOAD')
                    await gethighquality(catt,20);
                    cat.value=catt;
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
        async function getmore(cat,number,updatetime){
            let result=await reqHighqualityplaylist(cat,number,updatetime);
            // console.log(result);
            if(result.code===200){
                for(let x of result.playlists){
                    highqualitylist.value.push(x);
                }
                more=result.more;
                updatetime=result.playlists[result.playlists.length-1].updateTime;
                return true;
            }
            else return Promise.reject();
        }
        async function scroll({scrollTop}){
            if(more){
                if(container.value.scrollHeight<scrollTop+container.value.clientHeight+10){
                    try{
                        store.commit('LOAD')
                        await getmore(cat.value,20,updatetime);
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
        async function getallcat(){
            let result=await reqAllcat();
            // console.log(result);
            if(result.code===200){
                for(let x of result.tags){
                    allcat.value.push(x.name)
                }
                return true;
            }
            else return Promise.reject();
        }
        async function gethighquality(cat,number){
            let result=await reqHighqualityplaylist(cat,number);
            // console.log(result);
            if(result.code===200){
                highqualitylist.value=result.playlists;
                updatetime=result.playlists[result.playlists.length-1].updateTime;
                more=result.more;
                return true;
            }
            else return Promise.reject();
        }
        onActivated(async ()=>{
            if(cat.value!=route.params.cat){
                complete.value=false;
                dataok.value=true;
                if(route.params.cat){
                    try{
                        await getallcat();
                        await gethighquality(route.params.cat,20)
                        cat.value=route.params.cat
                    }
                    catch(err){
                        console.log(err.message)
                        ElMessage.error('网络异常，获取数据失败')
                        dataok.value=false;
                    }
                    finally{
                        complete.value=true;
                    }               
                }          
            }
        })
        onBeforeRouteUpdate(async (to)=>{
            if(to.name==='highqualitymusiclist'){
                complete.value=false;
                dataok.value=true;
                try{
                    if(to.params.cat){
                    await gethighquality(to.params.cat,20)
                    cat.value=to.params.cat
                    }
                }
                catch(err){
                    console.log(err.message)
                    ElMessage.error('网络异常，获取数据失败')
                    dataok.value=false;
                }
                finally{
                    complete.value=true;
                }          
            }
        })
        // onBeforeMount(async ()=>{
        //     try{
        //         await getallcat();
        //         await gethighquality(route.params.cat,20)
        //         cat.value=route.params.cat;
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
        return{scrollhandle,cat,handleClick,container,highqualitylist,allcat,dataok,complete}
    }
}
</script>
<style lang="less" scoped>

.router_container{
    height: calc(100vh - 145px);
    .radiotype{
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
        .recommend{
            display: grid;
            grid-template-columns: repeat(2,1fr);
            .item_container{
                cursor: default;
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
                align-items: center;
                width: 450px;
                height: 130px;
                border-radius: 5px;
                // background-color: blue;
                .item{
                    flex-shrink: 0;
                    width: 130px;
                    height: 130px;
                }
                .info{
                    margin-left: 10px;
                    width: 300px;
                    height: 130px;
                    display: flex;
                    justify-content: space-around;
                    align-items: flex-start;
                    flex-direction: column;
                    .title{
                        width: 300px;
                    }
                    .brief_text{
                        word-break: break-all;
                        text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
                        display: -webkit-box; /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 */
                        -webkit-box-orient: vertical; /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
                        -webkit-line-clamp: 2; /* 文本需要显示多少行 */
                        font-size: 12px;
                        overflow: hidden;
                        color: #BBBBBB;
                    }
                }

            }
        }
    }

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