<template>
<!-- 排行榜 -->
  <div class="rank_list_container">
      <div @dblclick="addmusicandplay(item)" class="row" v-for="(item,index) in props.rank" :key="index">
          <div class="music_left">
                <span class="ranks">{{index+1}}</span>
                <span class="music_name">{{item.name}}<span class="sub_info" v-if="item.tns">({{item.tns[0]}})</span></span>
          </div>
          <div class="artist_container">
            <mytitle size="small" :routemode="true" :router="{name:'artistdetail',params:{id:artist.id}}" class="artist" color="light" v-for="(artist,i) in item.ar" :key="i">{{i!=0?'/':''}}{{artist.name}}</mytitle>
          </div>
          <!-- <span class="artist">artist</span> -->
      </div>
      <mytitle :routemode="true" :router="{name:'musiclistdetail',params:{id:props.id}}" size="small" color="light" class="moreof">查看全部 ></mytitle>
  </div>
</template>

<script>
import { computed } from '@vue/runtime-core';
import { useStore } from 'vuex'
export default {
    props:{
        rank:{
            type:Object,
        },
        id:{
            type:Number,
        }
    },
    name:'Myranklist',
    setup(props){
        const store=useStore();
        let nextlock=computed(()=>store.state.nextlock)
        let lyriclock=computed(()=>store.state.lyriclock)
        let commentlock=computed(()=>store.state.commentlock)
        function addmusicandplay(item){
            if(!nextlock.value&&!lyriclock.value&&!commentlock.value){
                store.commit('LOCK')
                store.dispatch('addmusicandplay',item)
            }
        }
        return {props,addmusicandplay}
    }
}
</script>

<style lang="less" scoped>
.rank_list_container{
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    .row{
        width: 100%;
        height: 30px;
        border-radius: 3px;
        display: flex;
        align-content: center;
        justify-content: space-between;
        &:nth-child(odd){
            background-color: #F9F9F9;
        }
        &:hover{
            background-color: #F4F4F4;
        }
        &:nth-child(-N+3){
                .ranks{
                    color: #EE4141;
                }
            }
        .music_left{
            display: flex;
            align-items: center;
            .ranks{
                margin-right: 30px;
                margin-left: 10px;
                cursor: default;
            }
            .music_name{
                width: 450px;
                cursor: default;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                font-size: 12px;
            }
            .sub_info{
                color: #BBBBBB;
            }
        }
        .artist_container{
            flex-grow: 1;
            word-break: break-all;
            text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
            overflow: hidden;
            white-space: nowrap;
            display: flex;
            justify-content: flex-end;
            
        }
        .artist{
            
            color: #676767;
            cursor: pointer;
            line-height: 30px;
            &:hover{
                color: #373737;
            }
        }
    }
    .moreof{
        margin-top: 10px;
    }
}

</style>