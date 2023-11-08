<template>
<!-- 底部音乐控制器 -->
<div class="container_bottom">
  <div v-if="playmode" class="footer">
    <div v-if="nowplaymusic" class="left_part" :class="{'active_player':playeropen}">
      <div  class="music">
          <svg-icon @click="openplayer" class="down" iconClass="bx-chevron-down"></svg-icon>
          <svg-icon  v-if="!like" @click="clicklikeit(nowplaymusic.id,true)" iconClass="bx-heart" class="icon-big"></svg-icon>
          <svg-icon  v-else @click="clicklikeit(nowplaymusic.id,false)" iconClass="bxs-heart" class="icon-big like"></svg-icon>
      </div>
      <div class="music">
        <myitem :icon="false"  :imgurl="nowplaymusic.al?`${nowplaymusic.al.picUrl}?param=50y50`:img" :shadow="false"  class="cover" @click="openplayer"></myitem>
        <!-- <myitem :icon="false" v-else-if="nowplaymusic&&!nowplaymusic.mytype" :imgurl="nowplaymusic.coverUrl?`${nowplaymusic.coverUrl}?param=50y50`:img" :shadow="false"  class="cover" @click="openplayer"></myitem> -->
        <div class="music_info">
          <mytitle @click="openplayer" class="music_title">{{nowplaymusic.name}}</mytitle>
          <div class="artist">
            <mytitle :routemode="true" :router="{name:'artistdetail',params:{id:ar.id}}" v-for="(ar,i) in nowplaymusic.ar" :key="i" color="light" size="small">{{i>0?'/':''}}{{ar.name}}</mytitle>
          </div>
        </div>
        <!-- <div v-else-if="nowplaymusic&&!nowplaymusic.mytype" class="music_info">
          <mytitle @click="openplayer" class="music_title">{{nowplaymusic.name}}</mytitle>
          <div class="artist">
            <mytitle :routemode="true" :router="{name:'radiodetail',params:{id:nowplaymusic.radio.id}}" color="light" size="small">{{nowplaymusic.radio.name}}</mytitle>
          </div>
        </div> -->
        <div v-if="nowplaymusic">
          <svg-icon  v-if="!like" @click="clicklikeit(nowplaymusic.id,true)" iconClass="bx-heart" class="icon"></svg-icon>
          <svg-icon  v-else @click="clicklikeit(nowplaymusic.id,false)" iconClass="bxs-heart" class="icon like"></svg-icon>
          <!-- <svg-icon  v-if="!radiolike&&mytype" iconClass="bx-like" class="icon"></svg-icon>
          <svg-icon v-else-if="radiolike&&mytype" iconClass="bxs-like"  class="icon like"></svg-icon> -->
        </div>
      </div>
    </div>
    <div v-else class="temp_part">

    </div>
    <div class="controller">
      <div class="button_group">
        <svg-icon @click="prevmusic" iconClass="bx-skip-previous" class="button around"></svg-icon>
        <div class="button center">
          <svg-icon @click="clickplayth" v-if="play" class="play" iconClass="bx-pause"></svg-icon>
          <svg-icon @click="clickplayth" v-else class="play" iconClass="bx-play"></svg-icon>
        </div>
        <svg-icon @click="nextmusic" iconClass="bx-skip-next" class="button around"></svg-icon>
      </div>
      <div class="progress_bar">
        <duration :second="true" :time="currenttime" class="current_time"/>
        <el-slider 
        v-model="currenttime"
        class="bar"
        :show-tooltip='false'
        :disabled="max===0"
        :max='dt+1'
        size="small"
        @input="holdprogress"
        >
        </el-slider>
        <duration :second="true" :time="dt" class="total_time"/>
      </div>
    </div>
    <div class="button_right">
      <svg-icon @click="changeordermode" v-if="sequence===1||sequence===null" class="button" iconClass="list"></svg-icon>
      <svg-icon @click="changeordermode" v-else-if="sequence===2" class="button" iconClass="shuffle"></svg-icon>
      <svg-icon @click="changeordermode" v-else class="button" iconClass="repeat"></svg-icon>
      <svg-icon class="button" @click="mute" v-if="volume!=0" iconClass="bx-volume-full"></svg-icon>
      <svg-icon class="button" @click="mute" v-else iconClass="bx-volume-mute"></svg-icon>
      <div class="bar_container">
        <el-slider v-model="volume" :max="100" @input="holdv" class="volume_bar"></el-slider>
      </div>
      <svg-icon v-if="playmode" class="button" @click="opendrawer" iconClass="bxs-playlist"></svg-icon>
    </div>
  </div>
  <div v-else class="footer">
    <div class="music">
      <myitem :icon="false" v-if="nowplayfm" :imgurl="nowplayfm.album?`${nowplayfm.album.picUrl}?param=50y50`:img" :shadow="false"  class="cover" @click="routetofm"></myitem>
      <div v-if="nowplayfm" class="music_info">
        <mytitle @click="routetofm" class="music_title">{{nowplayfm.name}}</mytitle>
        <div class="artist">
          <mytitle :routemode="true" :router="{name:'artistdetail',params:{id:ar.id}}" v-for="(ar,i) in nowplayfm.artists" :key="i" color="light" size="small">{{i>0?'/':''}}{{ar.name}}</mytitle>
        </div>
      </div>
      <div v-if="nowplayfm">
        <svg-icon  v-if="!like" @click="clicklikeit(nowplayfm.id,true)" iconClass="bx-heart" class="icon"></svg-icon>
        <svg-icon  v-else @click="clicklikeit(nowplayfm.id,false)" iconClass="bxs-heart" class="icon like"></svg-icon>
        <!-- <svg-icon  v-if="!radiolike&&type==='radio'" iconClass="bx-like" class="icon"></svg-icon>
        <svg-icon v-else-if="radiolike&&type==='radio'" iconClass="bxs-like"  class="icon like"></svg-icon> -->
      </div>
    </div>
    <div class="controller">
      <div class="button_group">
        <svg-icon iconClass="bx-skip-previous" class="button around"></svg-icon>
        <div class="button center">
          <svg-icon @click="clickplayth" v-if="play" class="play" iconClass="bx-pause"></svg-icon>
          <svg-icon @click="clickplayth" v-else class="play" iconClass="bx-play"></svg-icon>
        </div>
        <svg-icon @click="nextfm" iconClass="bx-skip-next" class="button around"></svg-icon>
      </div>
      <div class="progress_bar">
        <duration :second="true" :time="currenttime" class="current_time"/>
        <el-slider 
        v-model="currenttime"
        class="bar"
        :show-tooltip='false'
        :disabled="max===0"
        :max='dt+1'
        size="small"
        @input="holdprogress"
        >
        </el-slider>
        <duration :second="true" :time="dt" class="total_time"/>
      </div>
      
    </div>
    <div class="button_right">
      <svg-icon class="button" @click="mute" v-if="volume!=0" iconClass="bx-volume-full"></svg-icon>
      <svg-icon class="button" @click="mute" v-else iconClass="bx-volume-mute"></svg-icon>
      <div class="bar_container">
        <el-slider v-model="volume" :max="100" @input="holdv" class="volume_bar"></el-slider>
      </div>
      <svg-icon v-if="playmode" class="button" @click="opendrawer" iconClass="bxs-playlist"></svg-icon>
    </div>
  </div>
  <audio @playing="playing" autoplay @timeupdate="timeupdate" @ended="ended" @canplay="canplay" :src="playmode?songurl:fmurl" ref="audio_player" style="display:none"></audio>
  <div v-if="!nowplaymusic&&playmode" class="cover_warp"></div>
</div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { useStore } from 'vuex';
import { computed, nextTick, onBeforeMount, watch } from 'vue';
import __ from 'lodash'
import { ElMessage } from 'element-plus';
import img from '@/assets/null.png'
import { useRouter,useRoute } from 'vue-router';
export default {
    name:'Musiccontrollerbottom',
    setup(){
      const router=useRouter();
      const route=useRoute();
      let type=ref('music');
      let radiolike=ref(true);
      let progress=ref(0);
      let max=ref(21)
      let sequence=computed(()=>store.state.ordermode);
      let volume=ref(50);
      let temvolume=50;
      const store=useStore();
      let like=computed(()=>store.getters.islike)
      let playmode=computed(()=>store.state.playmode);
      let playeropen=computed(()=>store.state.player);
      let draweropen=computed(()=>store.state.drawer);
      let nowplaymusic=computed(()=>store.getters.nowplaymusic)
      let play=computed(()=>store.state.play);
      let dt=computed(()=>Math.floor(store.getters.dt/1000))
      let currenttime=ref(0);
      let songurl=computed(()=>store.state.songurl);
      let audio_player=ref(null);
      let totime=computed(()=>store.state.totime)
      let nowplayfm=computed(()=>store.getters.nowplayfm)
      let fmurl=computed(()=>store.state.fmurl);
      let nextlock=computed(()=>store.state.nextlock)
      let lyriclock=computed(()=>store.state.lyriclock)
      let commentlock=computed(()=>store.state.commentlock)

      function routetofm(){
        if(route.name!='privitefm') router.push({name:'privitefm'})
      }
      function nextfm(){
        store.dispatch('nextfm')
      }
      function nextmusic(){
        if(!nextlock.value&&!commentlock.vlaue&&!lyriclock.value){
          store.commit('LOCK')
          if(sequence.value!=0){
              store.dispatch('nextmusic',false)
          }
          else {
            store.dispatch('nextmusic_btn')
          }
        }
      }
      function prevmusic(){
        if(!nextlock.value&&!commentlock.vlaue&&!lyriclock.value){
          store.dispatch('prevmusic')
        }
      }
      onBeforeMount(()=>{
        let musicvolume=Number(localStorage.getItem('musicvolume'));
        // console.log(sequence.value)
        if(musicvolume){
          volume.value=musicvolume;
        }
        else{
          volume.value=50;
          localStorage.setItem('musicvolume',50)
        }
      })
      nextTick(()=>{
        audio_player.value.volume=volume.value/100;
      })
      watch(totime,(newv,oldv)=>{
        if(newv!=null){
          audio_player.value.currentTime=newv;
          store.commit('TOTIME',null);
          audio_player.value.play();
        }
      })
      function changeordermode(){
        let num;
        if(sequence.value!=null){
          num=(sequence.value+1)%3;
        }
        else num=2;
        // console.log(num)
        switch(num){
          case 0:
            ElMessage.success('单曲循环')
            store.commit('ORDERMODE',0)
            localStorage.setItem('ordermode',num)
            break;
          case 1:
            ElMessage.success('列表循环')
            store.commit('ORDERMODE',1)
            localStorage.setItem('ordermode',num)
            break;
          case 2:
            ElMessage.success('列表随机')
            store.commit('ORDERMODE',2)
            localStorage.setItem('ordermode',num)
            break;
          default:
            ElMessage.success('列表随机')
            store.commit('ORDERMODE',2)
            localStorage.setItem('ordermode',num)
            break
        }
        
      }
      function playing(){
        store.commit('PLAYMUSIC')
      }
      function holdv(){
        audio_player.value.volume=volume.value/100;
        localStorage.setItem('musicvolume',volume.value)
      }
      function holdprogress(){
        // drag.value=true;
        audio_player.value.currentTime=currenttime.value;
        // console.log('woshi holdprogress 的 funciton')
      }
      function timeupdate(){
          currenttime.value=audio_player.value.currentTime
          store.commit('SETTIME',currenttime.value);
          // console.log(audio_player)
          // if(audio_player.value.currentTime>=audio_player.value.duration) ended()
      }
      watch(play,(newv,oldv)=>{
        if(oldv===false&&newv===true){
          audio_player.value.play();
        }
        else if(oldv===true&&newv===false){
          audio_player.value.pause();
        }
      })
      function ended(){
        if(playmode.value) store.dispatch('nextmusic',false);
        else store.dispatch('nextfm')
      }
      async function clickplay(){
        if(playmode.value){
          if(songurl.value){
            if(play.value){   
              // audio_player.value.pause();
              // console.log('32')
              store.commit('PAUSEMUSIC')
            }
            else{
            // audio_player.value.play();
            // console.log('123')
            store.commit('PLAYMUSIC')
            }
          }
          else store.dispatch('playmusic')
        }
        else{
          if(fmurl.value){
            if(play.value){   
              // audio_player.value.pause();
              // console.log('32')
              store.commit('PAUSEMUSIC')
            }
            else{
              // audio_player.value.play();
              // console.log('123')
              store.commit('PLAYMUSIC')
            }
          }
          else store.dispatch('playmusic')
          }
        }
      const clickplayth=__.throttle(clickplay,500);
      function opendrawer(){
        if(draweropen.value===true){
          store.commit('CLOSEDRAWER');
        }else{
          store.commit('OPENDRAWER');
        }
      }
      function likeit(id,like){
        store.dispatch('likeit',{id:id,like:like})
      }
      const clicklikeit=__.throttle(likeit,3000)
      function mute(){
        if (volume.value!=0) {
          temvolume=volume.value;
          volume.value=0;
          audio_player.value.muted=true;
        }
        else{
          volume.value=temvolume;
          audio_player.value.muted=false;
        }
      }
      function openplayer(){
        if(playeropen.value){
          store.commit('CLOSEPLAYER')
        }else{
          if(playmode.value) store.commit('OPENPLAYER');
        }
      }
      return {timeupdate,playeropen,nowplayfm,fmurl,nextfm,prevmusic,routetofm,nextmusic,img,changeordermode,playing,holdv,holdprogress,audio_player,ended,songurl,playmode,currenttime,dt,clicklikeit,nowplaymusic,clickplayth,openplayer,opendrawer,sequence,like,type,radiolike,progress,max,play,volume,mute}
    }
}
</script>
<style lang="less" scoped>
.container_bottom{
  position:relative;
  width: 100%;
  height: 75px;
  z-index: 1003;
}
.cover_warp{
  // z-index: 1004;
  background-color: white;
  width:100%;
  height: 100%;
  position: absolute;
  top:0;
  left:0;
  opacity: 50%;
}
.footer{
    background-color: white;

    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top-color: #E1E1E1;
    border-top-style: solid;
    border-top-width: 2px;
    overflow: hidden;
    .temp_part{
      width: 280px;
      height: 100%;
    }
    .left_part{
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      transform: translateY(-25%);
      transition: all 0.8s ease;
      width:280px;
      height:200%;
    }
    .active_player{
      transform: translateY(25%);
    }
    .music{
      // border: 1px solid #bbbbbb;
      margin-left: 15px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 280px;
      height: 50%;

      .icon-big{
        padding: 5px 5px;
        border-radius: 50px;
        font-size: 24px;
        border: 1px solid #E1E1E1;
        margin-left: 20px;
        color: #666666;
        cursor: pointer;
        &:hover{
            color: #323232;
            background-color: #F5F5F5;
        }
      }
      .down{
        font-size: 40px;
        color:#5C5C5C;
        cursor: pointer;
        &:hover{
          color: #333333;
        }
      }
      .cover{
        width: 50px;
        height: 50px;
      }
      .music_info{
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .music_title{
          width: 150px;
          overflow: hidden;
        }
        .artist{
          width: 150px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden
        }
      }
      .icon{
        font-size: 24px;
        margin-left: 10px;
        color: #676767;
        cursor: pointer;
        &:hover{
          color: #373737;
        }
      }
      .like{
        color: #EC4141;
        &:hover{
          color: #D73535;
        }
      }
    }
    .controller{
      width: 460px;
      height: 100%;
      // background-color: #373737;
      .button_group{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .button{
          color: black;
          border-radius: 20px;
          cursor: pointer;
        }
        .around{
          width: 25px;
          height: 25px;
          &:hover{
            color: #EF6767;
          }
        }
        .center{
          width: 35px;
          height: 35px;
          margin: 0 30px;
          background-color: #F4F4F4;
          &:hover{
            background-color: #E5E5E5;
          }
          .play{
            width: 35px;
            height: 35px;

          }
        }
      }
      .progress_bar{
        display: flex;
        align-items: center;
        .current_time,.total_time{
          cursor: default;
          font-size: 10px;
          color: #BBBBBB;
          margin: 0 10px;
        }
      }
    }
    .button_right{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      // background-color: red;
      height: 100%;
      width: 300px;
      .bar_container{
        width: 100px;
        margin: 0 10px;
      }
      .button{
        flex-shrink: 0;
          width: 20px;
          height: 20px;
          margin: 0 10px;
          color:#333333;
          cursor: pointer;
          &:hover{
            color: black;
          }
        }

    }
}

</style>