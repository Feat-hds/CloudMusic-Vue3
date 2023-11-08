<template>
<!-- 评论 -->
  <div v-for="(data,index) in props.commentslist" :key="index" class="comments_container">
      <myitem :shadow="false" :hoveranim="false" :imgurl="`${data.user.avatarUrl}?param=40y40`" :routemode="true" :router="{name:'userprofile',params:{id:data.user.userId}}" class="avater"></myitem>
      <div class="comment">
        <!-- 评论部分 -->
          <div class="com">
            <mytitle :routemode="true" :router="{name:'userprofile',params:{id:data.user.userId}}" class="username">{{data.user.nickname}}</mytitle>
            <span class="seg">:</span>
            <span class="text_table">{{data.content}}</span>   
          </div>
          <!-- 回复的评论部分 -->
          <div v-if="data.beReplied[0]" class="bereplied">
            <mytitle :routemode="true" :router="{name:'userprofile',params:{id:data.beReplied[0].user.userId}}" class="username">@{{data.beReplied[0].user.nickname}}</mytitle>
            <span class="seg">:</span>
            <span class="text_table">{{data.beReplied[0].content}}</span>
          </div>
           <timetransform :time="data.time" class="time"/>
      </div>
      <!-- 评论按钮部分 -->
      <div class="button_group">
          <svg-icon @click="unlikecomment(data.commentId,index)" v-if="data.liked" class="like icon" icon-class="bxs-like"></svg-icon>
          <svg-icon @click="likecomment(data.commentId,index)" v-else class="unlike icon" icon-class="bx-like"></svg-icon>
          <playnumber :number="data.likedCount" class="number"/>
      </div>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { useStore } from 'vuex';
import { computed } from '@vue/runtime-core';
import { ElMessage } from 'element-plus';
import {reqCommentlike} from '@/api/music';
export default {
    name:"Comments",
    props:{
        commentslist:{ //需要父组件传入的评论列表
            type:Array,
            default:[],
        },
        type:{
            type:Number,
            required:true,
        },
        id:{
            // type:Number,
            required:true,
        }
    },
    setup(props){
        const store=useStore();
        let islogin=computed(()=>store.state.islogin);
        async function likecomment(cid,i){
            try{
                if(islogin.value){
                    let result =await reqCommentlike(props.id,cid,1,props.type)
                    if(result.code===200){
                        ElMessage.success('点赞成功');
                        props.commentslist[i].liked=true;
                        props.commentslist[i].likedCount++;
                    }
                    else throw Error()
                }
                else ElMessage.warning('请先登录在进行操作')
            }
            catch(err){
                console.log(err)
                ElMessage.error('网络异常，操作失败')
            }
        }
        async function unlikecomment(cid,i){
            try{
                if(islogin.value){
                    let result =await reqCommentlike(props.id,cid,0,props.type)
                    if(result.code===200){
                        ElMessage.success('取消点赞成功');
                        props.commentslist[i].liked=false;
                        props.commentslist[i].likedCount--;
                    }
                    else throw Error()
                }
                else ElMessage.warning('请先登录在进行操作')
            }
            catch(err){
                console.log(err)
                ElMessage.error('网络异常，操作失败')
            }
        }
        return {props,likecomment,unlikecomment}
    }
}
</script>

<style lang="less" scoped>
.comments_container{
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: calc(100% - 20px);
    // height: 50px;
    // background-color: yellow;
    border-bottom-style: solid;
    border-bottom-color: #BBBBBB;
    border-bottom-width: 1px;
    padding: 10px 0;
    .avater{
        border-radius: 50px;
        width: 40px;
        height: 40px;
        flex-shrink: 0;
    }
    .comment{
        // background-color: rebeccapurple;
        padding: 0 10px;
        height: 100%;
        width: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        .com{
            flex-grow: 1;
            margin-bottom: 5px;
            font-size: 12px;
            .username{
            color: #507DAF;
            cursor: pointer;
            font-size: 12px;

            &:hover{
                color:#0B58B0
            }
            }
        }
        .bereplied{
            margin-bottom: 5px;
            width: calc(100% - 10px);
            padding: 10px 5px;
            background-color: #F4F4F4;
            border-radius: 5px;
            font-size: 12px;
            .username{
                color: #507DAF;
                cursor: pointer;
                font-size: 12px;

            &:hover{
                color:#0B58B0
            }

            }
            .text_table{
                font-size: 12px;
            }
            .seg{
                margin-right: 5px;
                font-size: 12px;
            }
        }

        .time{
            display: inline-block;
            color: #BBBBBB;
            font-size: 12px;
            cursor:default;
        }
    }
    .button_group{
        align-self: flex-end;
        // width: 100px;
        height: 20px;
        // background-color: blue;
        flex-shrink: 0;
        .icon{
            cursor: pointer;
            color: #676767;
            &:hover{
                color: #373737;
            }

        }
        .number{
            color:#676767;
            display: inline-block;
            padding-right: 3px;
            margin: 0 3px;
            // border-right: 1px solid #BBBBBB;
            cursor: default;
        }
        .like{
            color: #FF3A7A;
            &:hover{
                color: #FF3A7A;
            }
        }
    }
}


</style>

