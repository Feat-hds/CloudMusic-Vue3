<template>
        <!-- 重新封装的图片组件 -->
        <div @click="routerto" class="myitem" @mouseenter="maskshow=true" @mouseleave="maskshow=false">
            <el-image v-if="props.type==='img'" class="img" :src="props.imgurl">
                <template #error>
                    <div class="image-slot">
                        <el-icon><Picture /></el-icon>
                    </div>
                </template>
                <template #placeholder>
                    <div v-if="props.loadingeffect" class="loading">
                        <el-icon class="is-loading" ><Loading /></el-icon>
                    </div>
                </template>
            </el-image>
            <div v-else-if="props.type==='dailyrecommend'" class="dailyrecommend"></div>
            <el-icon v-if="props.type==='dailyrecommend'" class="calendar" :size="60" color="whitesmoke"><Calendar /></el-icon>
            <div v-if="props.shadow" class="shadow"></div>
            <div v-if="props.duration" class="time_duration">
                <duration class="duration" :time="props.duration"/>
            </div>
            <div @click.stop="routertocreator" class="creator" v-if="props.creator">
                <svg-icon class="creator_icon"  iconClass="bx-user"></svg-icon>
                <span >{{props.creator.nickname}}</span>
            </div>
            <!-- <div class="content" v-else-if="props.type==='text'">
                <span class="text">{{props.text}}</span>
                <span class="subtext">{{props.subtext}}</span>
            </div> -->
            <transition-group v-if="props.hoveranim" name="fade">
                <div class="mask" v-show="maskshow" key="mask"></div>
                <el-icon v-if="props.icon" class="icon-play" color="#EC4141" v-show="maskshow" :size="50" key="icon"><VideoPlay /></el-icon>
                <el-icon v-else class="icon-play" color="whitesmoke" v-show="maskshow" :size="40" key="ic"><DCaret /></el-icon>
            </transition-group>
            <div class="icon-type" v-if="props.number">
                <el-icon :size="20" color="white"><CaretRight /></el-icon>
                <span class="number">{{number}}</span>
            </div>
        </div>
</template>

<script>
import { ref } from 'vue'
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name:'Myitem',
    props:{
        // subtext:String, 
        // text:String,
        number:Number, //右上角的播放次数
        imgurl:String, //图片url
        loadingeffect:{
            default:true,
            type:Boolean,
        },
        type:{
            type:String,
            default:'img'
        },
        icon:{
            type:Boolean,
            default:true
        }, 
        hoveranim:{ //鼠标hover的时候是否有播放按钮显示及其动画
            type:Boolean,
            default:true,
        },
        duration:{ //右下角的持续时间，传入时间戳
            default:false,
        },
        bgcolor:{ 
            type:String,
            default:'blue'
        },
        routemode:{ //是否开启路由模式，为true则点击后跳转到router对应路由
            type:Boolean,
            default:false,
        },
        router:{ //路由信息，接受一个路由对象
            type:Object,
        },
        creator:{ //左下角创建者
            type:Object,
        },
        shadow:{ //是否有上下阴影
            type:Boolean,
            default:true,
        }
    },
    setup(props){
        const router=useRouter();
        let maskshow=ref(false);
        let number=computed(()=>{
            if(props.number&&props.number>=100000000){
                let n=Math.floor(props.number/100000000);
                return n+'亿';
            }
            else if(props.number&&props.number>=10000){
                let n=Math.floor(props.number/10000);
                return n+'万';
            }
            else return props.number;
        })
        function routerto(){
            if(props.routemode){
                router.push(props.router);
            }
        }
        function routertocreator(){
            if(props.creator){
                router.push({name:'userprofile',params:{id:props.creator.userId}});
            }
        }
        return {routertocreator,maskshow,props,number,routerto}
    }
}
</script>

<style lang="less" scoped>
    .myitem{
        border-radius: 5px;
        position: relative;
        overflow:hidden;
        width: 100%;
        height: 100%;
        .calendar{
            position: absolute;
            top:0;
            left:0;
            width: 100%;
            height: 100%;
        }
        .shadow{
            width: 100%;
            height: 100%;
            position: absolute;
            top:0;
            left: 0;
            box-shadow: 0px 12px 20px -12px black inset,
                        0px -12px 20px -12px black inset;
            z-index: 1;
        }
        .time_duration{
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            color: white;
            z-index: 2;
            .duration{
                margin-right: 5px;
                font-size: 12px;
            }
        }
        .creator{
            display: flex;
            align-items: flex-end;
            justify-content: flex-start;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            color: white;
            font-size: 10px;
            z-index: 2;
            .creator_icon{
                margin-left: 5px;
            }
        }
        .content{
            display: flex;
            width: 100%;
            height: 100%;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            .text{
                font-size: 32px;
                font-weight: bold;
                color: white;
            }
            .subtext{ 
                font-size: 12px;
                color: white;
            }
            .icon{
                width: 60%;
                height: 60%;
                color: white;
            }
        }

        .icon-type{
            width: 100%;
            position: absolute;
            top:0;
            left: 0;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .number{
                font-size: 13px;
                color: white;
                margin-right: 5px;
                z-index:2;
            }
        }
        &:hover{
            cursor: pointer;
        }
        .img{
            width: 100%;
            height: 100%;
        }
        .dailyrecommend{
            background-color: blue;
            width: 100%;
            height: 100%;
        }
        .content{
            background-color: v-bind('props.bgcolor');
            width: 100%;
            height: 100%;
        }
        .icon-else{
            position: absolute;
            top:0px;
            left: 0px;
            height: 100%;
            width: 100%;
            color: whitesmoke;
        }
        .icon-play{
            position: absolute;
            top:0px;
            left: 0px;
            height: 100%;
            width: 100%;
        }
        .mask{
            width: 100%;
            height: 100%;
            background-color: black;
            opacity: 40%;
            position: absolute;
            top:0;
            left: 0;
        }
        .fade-enter-active,
        .fade-leave-active {
            transition: opacity .3s ease;
        }
        .fade-enter-from,
        .fade-leave-to {
            opacity: 0;
        }
    }
</style>