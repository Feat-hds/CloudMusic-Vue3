<template>
<!-- 下方升起的详细音乐播放器 -->
    <div class="musicplayer">
        <div class="loading" v-if="!complete">
            <el-icon class="is-loading" ><Loading /></el-icon>
            正在加载
        </div>
        <el-scrollbar v-if="complete&&dataok" class="scroll">
            <div class="content">   
                <div class="player">
                    <div class="left_warp">
                        <myitem :shadow="false" v-if="nowplayfm" @click="clickplay" :imgurl="nowplayfm.album?`${nowplayfm.album.picUrl}?param=300y300`:imgnull" class="cover"></myitem>
                        <div class="button_warp">
                            <svg-icon  v-if="!like" @click="clicklikeit(nowplayfm.id,true)" iconClass="bx-heart" class="icon"></svg-icon>
                            <svg-icon  v-else-if="like" @click="clicklikeit(nowplayfm.id,false)" iconClass="bxs-heart" class="icon like"></svg-icon>
                            <svg-icon @click="trashmusic" iconClass="bx-trash" class="icon" />
                            <svg-icon @click="nextfm" iconClass="bx-skip-next" class="icon"/>
                        </div>
                    </div>
                    <div  class="right_warp">
                        <span v-if="nowplayfm" class="title">{{nowplayfm.name}}</span>
                        <span v-if="nowplayfm.alias&&nowplayfm.alias[0]" class="sub_title">{{nowplayfm.alias[0]}}</span>                                                  
                        <div v-if="nowplayfm" class="info_music">
                            <div  class="artist">
                                <span v-for="(artists,i) in nowplayfm.artists" :key="i">{{i>0?'/':''}}{{artists.name}}</span>
                            </div>
                            <span v-if="nowplayfm.album" class="center">-</span>
                            <div v-if="nowplayfm.album" class="album">{{nowplayfm.album.name}}</div>
                        </div>
                        <el-scrollbar ref="lyric_ref" class="scroll_lrc">
                        <div class="lyric">
                            <span @click="moveto(index)" class="row_lrc" :class="{'current_lrc':current_lrc===index}" v-for="(lrc,index) in ms" :key="index">{{lrc.c}}</span>
                            <span v-if="ms.length===0" style="margin-top:120px" class="row_lrcs">暂无歌词</span>
                        </div>
                        </el-scrollbar>
                    </div>

                </div>
                <div v-if="nowplayfm" class="comment">
                    <part v-if="hotcomment.length" title="精彩评论">
                    <Comments :id="nowplayfm.id" :type="0" :commentslist="hotcomment"></Comments>
                    </part>
                    <part v-if="comment.length" title="最新评论">
                    <Comments :id="nowplayfm.id" :type="0" :commentslist="comment"></Comments>
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
import { ref } from '@vue/reactivity';
import { reqPersonalfm, reqSongurl } from "@/api/music";
import { useStore } from 'vuex'
import {reqMusiccomment,reqLyric} from '@/api/music'
import { computed, nextTick, onActivated, onBeforeMount, onDeactivated, watch} from '@vue/runtime-core';
import { ElMessage } from 'element-plus';
import img from '@/assets/record.png'
import imgp from '@/assets/poll.png'
import imgnull from '@/assets/null.png'
import __ from 'lodash'

export default {
name:'Privitefm',
setup(){
    const store=useStore();
    let dataok=ref(true);
    let complete=ref(false);
    let fmlist=computed(()=>store.state.fmlist);
    let like=computed(()=>store.getters.islike)
    let ms=ref([])
    let comment=ref([])
    let hotcomment=ref([])
    let total=ref(0);
    let play=computed(()=>store.state.play);
    let nowplayfm=computed(()=>store.getters.nowplayfm)
    let currentpage=ref(1);
    let lyric_ref=ref(null);
    let current_lrc=ref(0)
    let time=computed(()=>store.state.time)
    let playmode=computed(()=>store.state.playmode)
    let newfm=computed(()=>store.state.newfm)
    let isopen=ref(true);
    let fmurl=computed(()=>store.state.fmurl);
    let lyriclock=computed(()=>store.fmlyriclock)
    let commentlock=computed(()=>store.state.fmcommentlock);
    function likeit(id,like){
        store.dispatch('likeit',{id:id,like:like})
    }
    const clicklikeit=__.throttle(likeit,1000)
    function nextfm(){
        store.dispatch('nextfm')
    }
    function trashmusic(){
        store.dispatch('trashmusic')
    }
    watch([newfm,playmode,isopen],async ()=>{
        try{
            if(newfm.value&&!playmode.value&&nowplayfm.value&&isopen.value){
                await getmusiclistcomment(nowplayfm.value.id,20,0)
                await getlyric(nowplayfm.value.id);
                store.commit('LOADFM')
                currentpage.value=1;
                dataok.value=true;
            }
        }
        catch(err){
            dataok.value=false;
            console.log(err)
            ElMessage.error('获取歌曲信息失败，请检查网络')
        }
        finally{
            store.commit('FMCOMMENTUNLOCK')
            store.commit('FMLYRICUNLOCK')
        }
    })
    async function getfmlist(){
        let result=await reqPersonalfm()
        if(result.code===200){
            store.commit('FMLIST',result.data);
        }
    }
      async function clickplay(){
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
    async function getsongurl(id){
        let result =await reqSongurl(id)
        if(result.code===200){
            store.commit('FMURL',result.data[0].url)
        }
    }
    async function currentchange(){
        try{
            store.commit('LOAD')
            let result=await reqMusiccomment(nowplayfm.value.id,20,(currentpage.value-1)*20);
            // console.log(result);
            if(result.code===200){
                comment.value=result.comments;
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
    async function getlyric(id){
        if(!lyriclock.value){
            store.commit('FMLYRICLOCK')
            let result=await reqLyric(id);
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
                // console.log(ms.value);
                // console.log(result)
                // mvlist.value=result.data;
                }
            return true;
            }
            else return Promise.reject();
        }
    }
    function moveto(index){
        store.commit('TOTIME',ms.value[index].t)
    }
    watch(time,(newv,oldv)=>{
        if(ms.value.length&&!playmode.value&&complete.value&&dataok.value){
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
    async function getmusiclistcomment(id,limit,offset){
        if(!commentlock.vlaue){
            store.commit('FMCOMMENTLOCK')
            let result=await reqMusiccomment(id,limit,offset);
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
    onBeforeMount(async ()=>{
        try{
            await getfmlist();
            await getsongurl(fmlist.value[0].id);
            await getlyric(fmlist.value[0].id)
            await getmusiclistcomment(fmlist.value[0].id,20,0);
        }
        catch(err){
            console.log(err)
            ElMessage.error('网络异常，获取fm失败')
            dataok.value=false;
        }
        finally{
            complete.value=true;
            store.commit('FMCOMMENTUNLOCK')
            store.commit('FMLYRICUNLOCK')
        }
    })
    onDeactivated(()=>{
        isopen.value=false;
    })
    onActivated(async ()=>{
        store.commit('PLAYMODE',0)
        store.commit('CLOSEDRAWER');
        if(newfm.value){
            await getmusiclistcomment(nowplayfm.value.id,20,0)
            await getlyric(nowplayfm.value.id);
            store.commit('LOADFM')
            isopen.value=true;
            currentpage.value=1;
            dataok.value=true;
        }
    })
    // let total=ref(0);
    // let currentpage=ref(1);
    // async function currentchange(){
    // try{
    //     store.commit('LOAD')
    //     let result=await reqMusiccomment(nowplayfm.value.id,20,(currentpage.value-1)*20);
    //     // console.log(result);
    //     if(result.code===200){
    //         comment.value=result.comments;
    //         return true;
    //     }
    //     else return Promise.reject();
    // }
    // catch(err){
    //     console.log(err)
    //     ElMessage.error('网络异常，获取数据失败');
    // }
    // finally{
    //     store.commit('LOADCOMPLETE')
    // }
// }
    return{complete,nextfm,trashmusic,moveto,clicklikeit,like,clickplay,lyric_ref,current_lrc,ms,play,comment,hotcomment,nowplayfm,currentchange,currentpage,total,img,imgp,imgnull,dataok}
}
}
</script>

<style lang="less" scoped>
  .musicplayer{

        .scroll{
            width: 100%;
            height:100%;
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
        height:100%;
        background-color: white;
        // backdrop-filter: blur(200px);
        .content{
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px 10px;
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
                        }
                        .current_lrc{
                            font-weight: bold;
                            font-size: 20px;
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
                overflow: hidden;
                justify-content: space-between;
                .cover{
                    width: 300px;
                    height: 300px;
                }
                .button_warp{
                    .icon{
                        padding: 5px 5px;
                        border-radius: 50px;
                        font-size: 24px;
                        border: 1px solid #E1E1E1;
                        margin-left: 10px;
                        color: #666666;
                        cursor: pointer;
                        &:hover{
                            color: #323232;
                            background-color: #F5F5F5;
                        }
                    }
                    .like{
                        color: #EC4141;
                        &:hover{
                        color: #D73535;
                        }
                    }
                    display: flex;
                    width: 300px;
                    justify-content: space-around;
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