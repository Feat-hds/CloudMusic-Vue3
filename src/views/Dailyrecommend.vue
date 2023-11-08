<template>
<el-scrollbar>
    <div class="loading" v-if="!complete">
        <el-icon class="is-loading" ><Loading /></el-icon>
        正在加载
    </div>
    <div v-if="complete&&dataok">
    <div class="header">
      <div class="text_part">
        <div class="icon_part">
          <svg-icon class="day_icon" iconClass="bx-calendar-heart"></svg-icon>
          <span class="day">{{day}}</span>
        </div>
        <div class="title_part">
          <span class="day_title">每日歌曲推荐</span>
          <span class="day_subdesc">根据你的音乐口味生成,每日6:00更新</span>
        </div>
      </div>
      <div class="button_group">
        <el-button @click="addallandplay" type="danger"  icon="CaretRight" round>播放全部</el-button>
        <el-button @click="addall" type="info"  icon="Plus" plain round>添加全部到播放列表</el-button>
      </div>
    </div>
    <el-table
        v-if="musiclist.length"
        :data="musiclist"
        style="width:100%;cursor:default"
        stripe
        lazy
        class="list"
        @row-dblclick="addmusicandplay"
        >
        <el-table-column width="50" class="index">
            <template v-slot="{row,$index}">
              <span class="text_title" :class="{'playon':nowplaymusic&&row.id===nowplaymusic.id}">{{$index+1}}</span>
            </template>
        </el-table-column>
        <el-table-column width="80">
            <template v-slot="{row,$index}">
              <svg-icon v-if="musiclikeinfolist[$index]" iconClass="bxs-heart" class="icon like" @click="clicklikeit(row.id,false)"></svg-icon>
              <svg-icon v-else iconClass="bx-heart" class="icon" @click="clicklikeit(row.id,true)"></svg-icon>
              <svg-icon @click="addmusic(row)" style="margin-left:10px" iconClass="bx-plus" class="icon"></svg-icon>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="标题" min-width="160">
            <template v-slot="{row}">
              <span class="text_title" :class="{'playon':nowplaymusic&&row.id===nowplaymusic.id}" @click="test">{{row.name}}<span v-if="row.tns" class="sub_info">({{row.tns[0]}})</span></span><tags class="row_tag" v-if="row.fee===1">VIP</tags><tags  class="row_tag" v-if="row.fee===8||row.fee===1">SQ</tags><tags  class="row_tag" v-if="row.mvid!=0" :routemode="true" :router="{name:'videodetail',params:{id:row.mvid,type:'mv'}}">MV</tags>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="歌手" min-width="100">
            <template v-slot="{row}">
            <mytitle v-for="(artist,i) in row.ar" :class="{'playon':nowplaymusic&&row.id===nowplaymusic.id}" :routemode="true" :router="{name:'artistdetail',params:{id:artist.id}}" size="small" color="light" :key="i">{{i>0?'/':''}}{{artist.name}}</mytitle>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="专辑" min-width="60">
            <template v-slot="{row}">
            <mytitle size="small" :class="{'playon':nowplaymusic&&row.id===nowplaymusic.id}" color="light" :routemode="true" :router="{name:'albumsdetail',params:{id:row.al.id}}">{{row.al.name}}</mytitle>
            </template>
        </el-table-column>
        <el-table-column prop="time" show-overflow-tooltip min-width="40" label="时长">
            <template v-slot="{row}">
            <duration class="table_time" :class="{'playon':nowplaymusic&&row.id===nowplaymusic.id}" :time="row.dt"></duration>
            </template>
        </el-table-column>
    </el-table>
    <el-empty v-else description="没有找到数据"></el-empty>
    </div>
    <el-empty v-else-if="complete&&!dataok" description="暂时没有数据"></el-empty>
</el-scrollbar>
</template>

<script>
import { ref } from '@vue/reactivity'
import { ElMessage } from 'element-plus';
import {  computed, onBeforeMount, watch } from '@vue/runtime-core';
import {reqDailyrecommend} from '@/api/music'
import { useStore } from 'vuex';
import __ from 'lodash'
export default {

    name:'Dailyrecommend',
    setup(){
      let complete=ref(false);
      let dataok=ref(true);
      const store=useStore();
      let musiclist=ref({});
      let musiclikeinfolist=ref([])
      let date= new Date()
      let day=date.getDate();
      let likelist=computed(()=>store.state.likelist)
      let nowplaymusic=computed(()=>store.getters.nowplaymusic)
      let nextlock=computed(()=>store.state.nextlock)
      let lyriclock=computed(()=>store.state.lyriclock)
      let commentlock=computed(()=>store.state.commentlock)
      function addall(){
        if(!nextlock.value&&!lyriclock.value&&!commentlock.value){
          store.commit('LOCK')
          store.dispatch('addall',musiclist.value);
        }
      }
      function addallandplay(){
        if(!nextlock.value&&!lyriclock.value&&!commentlock.value){
          store.commit('LOCK')
          store.dispatch('addallandplay',musiclist.value)
        }
      }
      function addmusicandplay(row){
        if(!nextlock.value&&!lyriclock.value&&!commentlock.value){
          store.commit('LOCK')
          store.dispatch('addmusicandplay',row);
        }
      }
      function addmusic(row){
        if(!nextlock.value&&!lyriclock.value&&!commentlock.value){
          store.commit('LOCK')
          store.dispatch('addmusic',row)
        }
      }
      function likeit(id,like){
        store.dispatch('likeit',{id:id,like:like})
      }
      const clicklikeit=__.throttle(likeit,3000);
      watch([likelist,musiclist],()=>{
        let arr=[];
        // console.log('改变了')
        if(musiclist.value.length){
          for(let x of musiclist.value){
            if(likelist.value.some((num)=>x.id===num)){
              arr.push(true);
              // console.log('成功')
            }
            else {
              // console.log('失败')
              arr.push(false);
            }
          }
          musiclikeinfolist.value=arr;
        }
      });
      async function getdailyrecommend(){
                let result=await reqDailyrecommend();
                // console.log(result);
                if(result.code===200) {
                    musiclist.value=result.data.dailySongs;

                    // table_key.value+=1;
                    return true;
                }
                else return Promise.reject();
        }
        onBeforeMount(async ()=>{
          try{
                await getdailyrecommend();
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
      return{day,musiclikeinfolist,addall,addallandplay,addmusic,nowplaymusic,addmusicandplay,clicklikeit,complete,dataok,musiclist,likeit}
    }
}
</script>


<style lang="less" scoped>
.header{
  margin: 10px 10px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  .text_part{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: default;
    .icon_part{
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .day{
        color: #EC4141;
        font-size: 18px;
        font-weight: bold;
      }
      .day_icon{
        font-size: 100px;
        color: #EC4141;
      }
    }
    .title_part{
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      .day_subdesc{
        font-size: 12px;
        color: #BBBBBB;
        height: 30px;
        line-height: 30px;
        display: inline-block;
      }
      .day_title{
        font-size: 24px;
        font-weight: bold;
      }
    }
  }
  .button_group{
    margin-top: 10px;

  }
}
.list{
  .row_tag{
    margin-left: 5px;
    font-size: 10px;
  }
    .sub_info{
        color: #BBBBBB;
        font-size: 12px;
    }
  .table_time{
    cursor: default;
    font-size: 12px;
    color: #BBBBBB;
  }
  .icon{
    color: #BBBBBB;
    font-size: 20px;
    cursor: pointer;
    &:hover{
      color: #4A4A4A;
    }
  }
  .like{
    color: #EC4141;
    &:hover{
      color: #D73535;
    }
  }
  .text_title{
    font-size: 12px;
  }
  .playon{
    color:#EC4141;
    &:hover{
        color: #EC4141;
    }
  }
}
</style>