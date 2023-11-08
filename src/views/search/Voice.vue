<template>
    <div class="loading" v-if="!complete">
        <el-icon class="is-loading" ><Loading /></el-icon>
        正在加载
    </div>
    <div v-if="complete&&dataok">
    <el-dialog v-model="dialogTableVisible" title="提示">
    <span style="margin-left:20px">声音相关功能暂时不可使用</span>
    <template #footer>
        <el-button type="danger" round plain @click="dialogTableVisible = false"
          >确认</el-button
        >
    </template>
  </el-dialog>
  <el-table
            v-if="voicelist"
            :show-header="false"
            :data="voicelist"
            style="width:100%;cursor:default;border-top-style:solid;border-top-color:#BBBBBB;border-top-width:1px;"
            stripe
            lazy
            class="list"
            @row-dblclick="adddjandplay"
          >
            <el-table-column width="80">
              <template v-slot="{row}">
              <Myitem @click="adddjandplay" :shadow="false" :imgurl="`${row.baseInfo.coverUrl}?param=60y60`"  class="cover"></Myitem>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="120">
              <template v-slot="{row}">
                <mytitle hover="default">{{row.baseInfo.name}}</mytitle>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="60">
              <template v-slot="{row}">
                <div class="text_table"><svg-icon iconClass="bx-play"/><playnumber :number="row.baseInfo.adjustedPlayCount"/></div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="60">
              <template v-slot="{row}">
                <duration class="text_table" :time="row.baseInfo.duration"/>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="60">
              <template v-slot="{row}">
                <mytitle size="small" color="light" :routemode="true" :router="{name:'userprofile',params:{id:row.baseInfo.userId}}" >by:{{row.baseInfo.radio.name}}</mytitle>
              </template>
            </el-table-column>


          </el-table>
          <el-empty v-else description="没有找到数据"></el-empty>
            <el-pagination
            :page-size="20"
            layout="prev, pager, next"
            :pager-count="7"
            :total="total"
            :hide-on-single-page="true"
            v-model:current-page="currentpage"
            @current-change="currentchange"
            class="pagination"
            />
          </div>
          <el-empty v-else-if="complete&&!dataok" description="暂时没有数据"></el-empty>
</template>

<script>
import { ref } from '@vue/reactivity'
import { ElMessage } from 'element-plus';

import {reqSearchbrief} from '@/api/music';
import { onActivated, onBeforeMount } from '@vue/runtime-core';
import { useRoute,onBeforeRouteUpdate } from 'vue-router';
import {useStore} from 'vuex'
export default {

    name:'Voice',
    setup(){
      const route=useRoute();
      const store=useStore();
      let complete=ref(false);
      let dataok=ref(true);
      let voicelist=ref([])
      let keyword=ref('')
      let dialogTableVisible=ref(false);
      function adddjandplay(){
        dialogTableVisible.value=true;
      }
          let total=ref(0);
          let currentpage=ref(1);
          async function currentchange(){
          try{
              store.commit('LOAD')
              let result=await reqSearchbrief(2000,keyword.value,20,(currentpage.value-1)*20);
              // console.log(result);
              if(result.code===200){
                  voicelist.value=result.data.resources;
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
      async function getsearchvoice(keyword,limit,offset){
            let result=await reqSearchbrief(2000,keyword,limit,offset);
            // console.log(result);
            if(result.code===200) {
                voicelist.value=result.data.resources;
                total.value=result.data.totalCount;
                // mvlist.value=mvlist.value.slice(0,3);
                currentpage.value=1;
                return true;
            }
            else return Promise.reject();
        }
        // onBeforeRouteUpdate(async (to)=>{
        //   if(to.name==='searchmvoice'){
        //     complete.value=false;
        //     dataok.value=true;
        //     try{
        //       if(route.query.keyword){
        //         await getsearchvoice(route.query.keyword,30,0);
        //       }
        //       else throw Error('没有关键字')
        //     }
        //     catch(err){
        //         ElMessage.error('获取数据失败');
        //         console.log(err.message);
        //         dataok.value=false; 
        //     }
        //     finally{
        //         complete.value=true;
        //     }
        //   }
        // })
        onActivated(async ()=>{
            try{
              if(route.query.keyword){
                if(route.query.keyword!=keyword.value) {
                  complete.value=false;
                  dataok.value=true;
                  await getsearchvoice(route.query.keyword,20,0);
                  keyword.value=route.query.keyword;
                }
              }
              else throw Error('没有关键字')
            }
            catch(err){
                ElMessage.error('获取数据失败');
                console.log(err.message);
                dataok.value=false; 
            }
            finally{
                complete.value=true;
            }
        })
        return { voicelist,adddjandplay,dialogTableVisible,complete,dataok,total,currentpage,currentchange}
    }
}
</script>

<style lang="less" scoped>
.pagination{
    width: 100%;
    display: flex;
    justify-content: center;
}
.list{
        .cover{
            width: 60px;
            height: 60px;
        }
        .text_table{
            cursor: default;
            color: #BBBBBB;
            font-size: 12px;
        }
    }
</style>