<template>
    <el-scrollbar>
        <div class="loading" v-if="!complete">
            <el-icon class="is-loading" ><Loading /></el-icon>
            正在加载
        </div>
        <div v-if="complete&&dataok" class="router_container">
            <part title="官方榜">
                <div class="sort_rank_list">
                    <div class="item_container" v-for="(item,index) in toplist" :key="index">
                        <myitem :hoveranim="false" :shadow="false" :imgurl="`${item.coverImgUrl}?param=150y150`" :routemode="true" :router="{name:'musiclistdetail',params:{id:item.id}}" class="item">
                        </myitem>
                        <myranklist :id="item.id" :rank="detail[index]" class="list"></myranklist>
                    </div>
                </div>
            </part>
            <part title="全球榜">
                <div class="rank_list">
                    <div class="item_container"  v-for="(item,index) in ranklist" :key="index">
                        <Myitem :routemode="true" :router="{name:'musiclistdetail',params:{id:item.id}}" :imgurl="`${item.coverImgUrl}?param=150y150`" class="item" :number="item.playCount"></Myitem>
                        <Mytitle :routemode="true" :router="{name:'musiclistdetail',params:{id:item.id}}"  class="title">{{item.name}}</Mytitle>
                    </div>
                </div>
            </part>
        </div>
        <el-empty v-else-if="complete&&!dataok" description="暂时没有数据"></el-empty>
    </el-scrollbar>
</template>

<script>
import Myranklist from "@/components/Myranklist.vue"
import {reqToplist,reqPlaylistdetail} from '@/api/music'
import { ref } from '@vue/reactivity';
import { onBeforeMount } from '@vue/runtime-core';
import {ElMessage} from 'element-plus'
export default {
    name:'Rank',
    components:{
        Myranklist,
    },
    setup(){
        let dataok=ref(true);//数据是否获取成功
        let complete=ref(false);//网络请求是否已经发送完成
        let toplist=ref([]);
        let ranklist=ref([])
        let detail=ref([]);
        async function gettoplist(){//获得排行榜列表
            let result=await reqToplist();
            // console.log(result);
            if(result.code===200) {
                ranklist.value=result.list;
                toplist.value=ranklist.value.splice(0,4);
                return true;
            }
            else return Promise.reject();
        }
        async function getrankdetail(){//获得排行榜细节
            for( let x of toplist.value){
                let result=await reqPlaylistdetail(x.id,5);
                // console.log(result);
                if(result.code===200) {
                    detail.value.push(result.songs);
                }
                else return Promise.reject();
            }
            return true;
        }
        onBeforeMount(async ()=>{
            try{
                await gettoplist();
                await getrankdetail();
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
        return {detail,ranklist,dataok,complete,toplist}
    }
}
</script>

<style lang="less" scoped>

.router_container{
    .scroll{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
    }
    .rank_list{
        .item_container{
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            margin: 5px 0;
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
        display: grid;
        grid-template-columns:repeat(5,1fr);
    }
    .sort_rank_list{
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        // background-color: yellow;
        .item_container{
            display: flex;
            width: 100%;
            justify-content: flex-start;
            align-items: flex-start;
            // background-color: red;
            margin: 10px 0;
            .item{
                width: 150px;
                height: 150px;
                flex-shrink: 0;
            }
            .list{
                margin-left: 30px;
            }
        }
    }
    height: calc(100vh - 204px);
}
</style>