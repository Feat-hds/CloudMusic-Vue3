<template>
    <div class="loading" v-if="!complete">
        <el-icon class="is-loading" ><Loading /></el-icon>
        正在加载
    </div>
  <div v-if="complete&&dataok" class="router_container">
    <el-scrollbar>
        <part title="收藏的歌手" :issub="true" :subtitle="`(${total})`">
            <div class="album_list">
            <el-table
            v-if="subartistlist.length"
                :show-header="false"
                :data="subartistlist"
                style="width:100%;cursor:default;border-top-style:solid;border-top-color:#BBBBBB;border-top-width:1px;"
                stripe
                lazy
                class="list"
            >
                <el-table-column width="80">
                  <template v-slot="{row}">
                  <Myitem :shadow="false" :routemode="true" :router="{name:'artistdetail',params:{id:row.id}}" :imgurl="`${row.picUrl}?param=60y60`" class="cover"></Myitem>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip min-width="120">
                <template v-slot="{row}">
                    <mytitle :routemode="true" :router="{name:'artistdetail',params:{id:row.id}}">{{row.name}}<span v-if="row.alias[0]" class="sub_info">({{row.alias[0]}})</span></mytitle>
                </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip min-width="80">
                  <template v-slot="{row}">
                    <span class="text_table">专辑:{{row.albumSize}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip min-width="80">
                  <template v-slot="{row}">
                    <span class="text_table">MV:{{row.mvSize}}</span>
                  </template>
                </el-table-column>
            </el-table>
            <el-empty v-else description="没有找到数据"></el-empty>
            </div>
        </part>
    </el-scrollbar>
  </div>
  <el-empty v-else-if="complete&&!dataok" description="暂时没有数据"></el-empty>
</template>

<script>
import { ref } from '@vue/reactivity';
import { computed, onBeforeMount } from '@vue/runtime-core';
import {reqSubartistlist} from '@/api/music'
import {ElMessage} from 'element-plus'
import { useStore } from 'vuex';
export default {
    name:'Artist',
    setup(){
        const store=useStore();
        let dataok=ref(true);//数据是否获取成功
        let complete=ref(false);//网络请求是否已经发送完成
        let subartistlist=computed(()=>store.state.artistlist);
        let total=computed(()=>store.state.subartisttotal)
        let isartistlist=computed(()=>store.state.isartistlist);
        async function getsubartistlist(limit,offset){
            if(!isartistlist.value){
                let result=await reqSubartistlist(limit,offset);
                // console.log(result);
                if(result.code===200){
                    store.commit('ARTISTLISTCOMPLETE')
                    store.commit('SETARTISTLIST',result.data);
                    store.commit('SUBARTISTTOTAL',result.count);
                    return true;
                }
                else return Promise.reject();         
            }
            else return true;
        }
        onBeforeMount(async ()=>{
            try{
                await getsubartistlist(500,0);
            }
            catch(err){
                console.log(err)
                ElMessage.error('网络异常，获取数据失败')
                dataok.value=false;
            }
            finally{
                complete.value=true;
            }
            
        })
        return{total,subartistlist,complete,dataok}
    }
}
</script>

<style lang="less" scoped>

.router_container{
    width: 100%;
    height: calc(100vh - 204px);
    .album_list{
        height: 100%;
        width: 100%;
        .sub_info{
            color: #BBBBBB;
            font-size: 12px;
        }
         .cover{
            width: 60px;
            height: 60px;
        }
        .text_table{
            cursor: default;
            font-size: 12px;
            color: #616162;
        }
    }
}

</style>