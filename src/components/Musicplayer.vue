<template>
<!-- 下方升起的详细音乐播放器 -->
    <div @click.stop="closedrawer" v-if="nowplaymusic" class="musicplayer">
        <div class="loading" v-if="!complete">
            <el-icon class="is-loading" ><Loading /></el-icon>
            正在加载
        </div>
        <el-scrollbar v-if="complete&&dataok" class="scroll">
            <div class="content">   
                <svg-icon @click.stop="closeplayer" class="downicon" iconClass="bxs-chevron-down"></svg-icon>
                <div v-if="nowplaymusic" class="player">
                    <div class="left_warp">
                        <div @click="clickplay" :class="{'play_poll':play}" class="poll" >
                            <el-image :src="imgp"></el-image>
                        </div>
                        <div :class="{'play_cover':play}" @click="clickplay" class="cover">
                            <el-image class="bac_img"  :src='img'></el-image>
                            <el-image v-if="nowplaymusic" :src="nowplaymusic.al?`${nowplaymusic.al.picUrl}?param=170y170`:imgnull" class="cover_img">
                                <template #error>
                                    <div class="image-slot">
                                        <el-icon><Picture /></el-icon>
                                    </div>
                                </template>
                                <template #placeholder>
                                    <div class="image-slot-loading">
                                        <el-icon class="is-loading" ><Loading /></el-icon>
                                    </div>
                                </template>
                            </el-image>
                        </div>
                    </div>
                    <div class="right_warp">
                        <span class="title">{{nowplaymusic.name}}</span>
                        <span v-if="nowplaymusic.alia&&nowplaymusic.alia[0]" class="sub_title">{{nowplaymusic.alia[0]}}</span>
                        <div class="info_music">
                            <div class="artist">
                                <span v-for="(ar,i) in nowplaymusic.ar" :key="i">{{i>0?'/':''}}{{ar.name}}</span>
                            </div>
                            <span v-if="nowplaymusic.al" class="center">-</span>
                            <span v-if="nowplaymusic.al" class="album">{{nowplaymusic.al.name}}</span>
                        </div>
                        <el-scrollbar ref="lyric_ref" class="scroll_lrc">
                        <div  class="lyric">
                            <span @click="moveto(index)" class="row_lrc" :class="{'current_lrc':current_lrc===index}" v-for="(lrc,index) in ms" :key="index">{{lrc.c}}</span>
                            <span v-if="ms.length===0" style="margin-top:120px" class="row_lrcs">暂无歌词</span>
                        </div>
                        </el-scrollbar>

                    </div>

                </div>
                <!-- <div v-else-if="nowplaymusic&&!nowplaymusic.mytype" class="radio_player">
                    <div class="titile">{{nowplaymusic.name}}</div>
                    <div class="sub_info">
                        <div>主播:<span class="dj">{{nowplaymusic.dj.nickname}}</span></div>
                        <div class="time"><svg-icon iconClass="bx-timer"/><timetransform :time="nowplaymusic.createTime"/></div>
                        <div class="playtime"><svg-icon iconClass="bx-play"/><playnumber :number="nowplaymusic.listenerCount"/></div>
                    </div>
                    <div class="main_part">
                        <el-image :src="nowplaymusic.coverUrl?`${nowplaymusic.coverUrl}?param=400y400`:imgnull" class="cover">
                            <template #error>
                                <div class="image-slot">
                                    <el-icon><Picture /></el-icon>
                                </div>
                            </template>
                            <template #placeholder>
                                <div class="loading">
                                    <el-icon class="is-loading" ><Loading /></el-icon>
                                </div>
                            </template>
                        </el-image>
                        <div class="description">
                            <div class="radio_info"></div>
                            <div class="desc">
                                {{nowplaymusic.description}}
                            </div>
                        </div>
                    </div>
                </div> -->
                <div v-if="nowplaymusic" class="comment">
                    <part v-if="hotcomment.length" title="精彩评论">
                    <Comments :id="nowplaymusic.id" :type="0" :commentslist="hotcomment"></Comments>
                    </part>
                    <part v-if="comment.length" title="最新评论">
                    <Comments :id="nowplaymusic.id" :type="0" :commentslist="comment"></Comments>
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
                    </part>
                    <el-empty v-if="!comment.length&&!hotcomment.length" description="暂时没有评论"></el-empty>
                </div>
            </div>
        </el-scrollbar>
        <el-empty v-else-if="complete&&!dataok" description="网络异常，请检查网络连接"></el-empty>
      </div>
</template>

<script>
import { useStore } from 'vuex'
import {reqMusiccomment,reqLyric,reqDjcomment} from '@/api/music'
import { ref } from '@vue/reactivity';
import { computed, onBeforeMount, watch} from '@vue/runtime-core';
import { ElMessage } from 'element-plus';
import img from '@/assets/record.png'
import imgp from '@/assets/poll.png'
import imgnull from '@/assets/null.png'
export default {
    name:'Musicplayer',
    setup(){
        let store=useStore();
        let comment=ref([]);
        let hotcomment=ref([]);
        let nowplaymusic=computed(()=>store.getters.nowplaymusic)
        let complete=ref(false);
        let dataok=ref(true);
        let total=ref(0);
        let currentpage=ref(1);
        let play=computed(()=>store.state.play)
        let ms=ref([])
        let songurl=computed(()=>store.state.songurl)
        let current_lrc=ref(0);
        let time=computed(()=>store.state.time)
        let lyric_ref=ref(null)
        let newmusic=computed(()=>store.state.newmusic)
        let player=computed(()=>store.state.player);
        let drawer=computed(()=>store.state.drawer)
        let playmode=computed(()=>store.state.playmode)
        let lyriclock=computed(()=>store.state.lyriclock)
        let commentlock=computed(()=>store.state.commentlock)
        function closedrawer(){
            if(drawer.value){
                store.commit('CLOSEDRAWER')
            }
        }
        watch([newmusic,player],async ()=>{
            try{
                if(newmusic.value&&player.value&&nowplaymusic.value){
                    await getmusiclistcomment(nowplaymusic.value,20,0)
                    await getlyric(nowplaymusic.value);
                    store.commit('LOADMUSIC')
                    currentpage.value=1;
                }
            }
            catch(err){
                console.log(err)
                ElMessage.error('获取歌曲信息失败，请检查网络')
            }
            finally{
                store.commit('LYRICUNLOCK')
                store.commit('COMMENTUNLOCK')
            }
        })

        function clickplay(){
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
        async function currentchange(){
        try{
            store.commit('LOAD')
            let result;
            // if(nowplaymusic.value.mytype) {
                result=await reqMusiccomment(nowplaymusic.value.id,20,(currentpage.value-1)*20);
            // }
            // else {
            //     result=await reqDjcomment(nowplaymusic.value.id,20,(currentpage.value-1)*20)
            // }
            // console.log(result);
            if(result.code===200){
                comment.value=result.comments;
                return true;
            }
            else return Promise.reject();
        }
        catch(err){
            console.log(err)
            ElMessage.error('网络异常，获取评论失败');
        }
        finally{
            store.commit('LOADCOMPLETE')
        }
    }
        async function getlyric(music){
            // if(music.mytype){
            if(!lyriclock.value){
                store.commit('LYRICLOCK')
                let result=await reqLyric(music.id);
                // console.log(result);
                if(result.code===200){
                    if(result.lrc){
                        let lyric=result.lrc.lyric;
                        ms.value=[];
                        if(lyric.length==0) return true;
                        // let lyricstxt = []; //存放歌词
                        let lrcs = lyric.split('\n');//用回车拆分成数组
                        // console.log(lrcs)
                        for(let i in lrcs) {//遍历歌词数组
                            lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
                            let t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));//取[]间的内容
                            let s = t.split(":");//分离:前后文字
                            if(!isNaN(parseInt(s[0]))) { //是数值
                                let arr = lrcs[i].match(/\[(\d+:.+?)\]/g);//提取时间字段，可能有多个
                                let start = 0;
                                for(let k in arr){
                                    start += arr[k].length; //计算歌词位置
                                }
                                let content = lrcs[i].substring(start);//获取歌词内容
                                for (let k in arr){
                                    let t = arr[k].substring(1, arr[k].length-1);//取[]间的内容
                                    let s = t.split(":");//分离:前后文字
                                    ms.value.push({//对象{t:时间,c:歌词}加入ms数组
                                    t: (parseFloat(s[0])*60+parseFloat(s[1])).toFixed(3),
                                        c: content
                                    }); 
                                }
                            }
                        }
                    }
                    // console.log(ms.value);
                    // console.log(result)
                    // mvlist.value=result.data;
                    return true;
                }
                else return Promise.reject();
            }
            // }
        }
        function moveto(index){
            if(songurl.value){
                store.commit('TOTIME',ms.value[index].t)
            }
            else store.dispatch('playmusic')
        }
        async function getmusiclistcomment(music,limit,offset){
            if(!commentlock.value){
                store.commit('COMMENTLOCK')
                let  result=await reqMusiccomment(music.id,limit,offset);
                // console.log(result);
                if(result.code===200){
                    comment.value=result.comments;
                    hotcomment.value=result.hotComments;
                    total.value=result.total;
                    // mvlist.value=result.data;
                    return true;
                }
                else return Promise.reject();
            }
        }
        watch(time,(newv,oldv)=>{
            if(ms.value.length&&player.value&&playmode.value){
                let i=ms.value.findIndex((c)=>c.t>newv)-1
                if(i===-2) i=ms.value.length-1;
                if(current_lrc.value!=i){
                    // console.log(i)
                    current_lrc.value=i;
                    let height=i*60-135;
                    if(height<0) height=0;
                    lyric_ref.value.setScrollTop(height)
                    // lyric_ref.value.scrollTo(height)
                }
            }
        })
        onBeforeMount(async ()=>{
            try{
                if(nowplaymusic.value){
                    await getmusiclistcomment(nowplaymusic.value,20,0)
                    await getlyric(nowplaymusic.value);
                }
            }
            catch(err){
                console.log(err)
                ElMessage.error('获取歌曲信息失败，请检查网络')
                // dataok.value=false;
            }
            finally{
                complete.value=true;
                store.commit('LYRICUNLOCK')
                store.commit('COMMENTUNLOCK')
            }

        })
        function closeplayer(){
            store.commit('CLOSEPLAYER');
        }
        return {closeplayer,closedrawer,moveto,lyric_ref,play,current_lrc,ms,clickplay,imgnull,img,imgp,currentpage,currentchange,total,nowplaymusic,complete,dataok,comment,hotcomment}
    }
}
</script>

<style lang="less" scoped>
    .musicplayer{
        .scroll{
            width: 100%;
        }
        .pagination{
            width: 100%;
            display: flex;
            justify-content: center;
        }
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1002;
        height: calc(100% - 72px);
        background-color: #E8E0E1;
        background-image: linear-gradient(#E8E0E1,40%,white);
        background-image: -o-linear-gradient(#E8E0E1,40%,white);
        background-image: -moz-linear-gradient(#E8E0E1,40%,white);
        background-image: -webkit-linear-gradient(#E8E0E1,40%,white);
        // backdrop-filter: blur(200px);
        .content{
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px 10px;
        }
        .radio_player{
            display: flex;
            justify-content: flex-start;
            flex-direction: column;
            align-items: center;
            .main_part{
                width: 800px;
                height: 400px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .cover{
                    width: 400px;
                    height: 400px;
                }
                .description{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 300px;
                    height: 400px;
                    .radio_info{

                    }
                    .desc{
                        font-size: 16px;
                        color: #BBBBBB;
                    }
                }
            }

            .title{
                font-size: 30px;
                cursor: default;
            }
            .sub_info{
                font-size: 16px;
                color: #BBBBBB;
                cursor: default;
            }
        }
        .player{
            width: 100%;
            height: 450px;
            // background-color: blue;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .right_warp{
                width: 400px;
                height: 450px;
                // background-color: yellow;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                .info_music{
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: 10px 0;
                }
                .sub_title{
                    margin-top: 5px;
                    font-size: 16px;
                    color: #BBBBBB;
                    display: block;
                }
                .title{
                    font-size: 30px;
                    cursor: default;
                }
                .artist{
                    flex-wrap: nowrap;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 16px;
                    max-width: 170px;
                    display: block;
                    color: #BBBBBB;
                    cursor: default;
                }
                .album{
                    font-size: 16px;
                    cursor: default;
                    color: #BBBBBB;
                    max-width: 200px;
                    word-break:break-all;
                    text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
                    display: -webkit-box; /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 */
                    -webkit-box-orient: vertical; /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
                    -webkit-line-clamp: 2; /* 文本需要显示多少行 */
                    overflow: hidden;
                }
                .center{
                    margin:0 10px;
                    font-size: 16px;
                    cursor: default;
                    color: #BBBBBB;
                }
                .scroll_lrc{
                    height: 350px;
                    width: 100%;
                    // border: 1px solid black;
                    // box-shadow: 0px 15px 15px -15px whitesmoke inset,
                    //     0px -15px 15px -15px whitesmoke inset;
                    .lyric{
                        width: 100%;
                        height: 100%;
                        // background-color: aqua;
                        // border: 1px solid black;
                        
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        flex-direction: column;
                        .row_lrc{
                            display: block;
                            height: 30px;
                            margin: 15px 0;
                            color: #626262;
                            cursor: pointer;
                            transition: font-size 0.3s linear;
                            &:hover{
                                font-weight: bold;
                            }
                        }
                        .row_lrcs{
                            display: block;
                            height: 30px;
                            margin: 15px 0;
                            cursor: default;
                            color: #626262;
                        }
                        .current_lrc{
                            font-weight: bold;
                            font-size: 20px;
                            color: black;
                        }
                    }
                }
                
            }
            .left_warp{
                width: 300px;
                height: 350px;
                cursor: default;
                // background-color: blue;
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
                overflow: hidden;
                .poll{
                    transform: rotate(-17deg);
                    cursor: pointer;
                    transform-origin: 10px 10px;
                    position: absolute;
                    transition:  0.4s linear;
                    // border-style: solid;
                    // border-width: 1px;
                    // border-color: black;
                    width: 120px;
                    height: 100px;
                    left: 140px;
                    top: 0px;
                    z-index: 2;
                    // animation: poll 1s linear infinite;
                }
                .play_poll{
                    transform: rotate(12deg);
                }
                .bac_img{
                    width: 100%;
                    height: 100%;

                }
                @keyframes rota {
                    100%{transform: rotate(1turn);}
                }
                .cover{
                    position:absolute;
                    top: 25px;
                    left: 0;
                    width: 300px;
                    height: 300px;
                    z-index: 1;
                    animation: rota 20s linear infinite;
                    animation-play-state: paused;
                    -webkit-user-select: none; /* Chrome / Safari */
                    -moz-user-select: none; /* Firefox */
                    -ms-user-select: none; /* IE 10+ */
                    user-select: none;
                    cursor: pointer;
                }
                .play_cover{
                    animation-play-state: running;
                }
                .cover_img{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                    border-radius: 250px;
                    width: 170px;
                    height: 170px;
                    // background-color: blue;
                }

            }
        }
        .downicon{
            font-size: 24px;
            align-self: flex-start;
            cursor: pointer;
            position: fixed;
        }
        .comment{
            width: 920px;
            display: flex;
            flex-direction: column;
            align-items: center;

        }
    }

</style>