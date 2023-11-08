<template>
<!-- 用来分割不同的部分，含有标题副标题，统一没有部分的格式 -->
    <div class="common_content">
        <div class="title_container">
            <span class="main_title" v-if="props.title" @click="routerto" :class="{'routemode':props.routemode}">{{props.title}}<svg-icon class="right_icon" iconClass="bx-chevron-right" v-if="routemode"></svg-icon></span>
            <span class="subtitle" v-if="props.issub&&props.subtitle">{{props.subtitle}}</span>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
    name:"Part",
    props:{
        title:{ //标题，没有则不显示
            type:String,
        },
        routemode:{ //路由模式，和router一起使用，为true则点击标题进行路由跳转
            type:Boolean,
            default:false,
        },
        router:{ //路由信息
            type:Object,
        },
        subtitle:{ //副标题
            default:false,
        },
        issub:{ //是否有副标题
            default:false,
            type:Boolean,
        }
    },
    setup(props){
        const router=useRouter();
        function routerto(){
            if(props.routemode) router.push(props.router)
        }
        return {routerto,props}
    }
}
</script>
<style lang="less" scoped>
.common_content{
    padding: 12px 12px;
    width: calc(100% - 24px);
    // background-color: yellow;
    // width: 100%;
    .title_container{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 5px;
        .subtitle{
            color: #BBBBBB;
            font-size: 14px;
            cursor: default;
            margin-left: 10px;
        }

        .main_title{
            color: #373737;
            display: flex;
            align-items: center;
            height: 35px;
            line-height: 35px;
            font-size: 20px;
            list-style: none;
            font-weight: bold;
            cursor: default;
        }
        .right_icon{
            font-size: 33px;
        }
        .routemode{
            cursor: pointer;
            &:hover{
                color: black;
            }
        }
    }

}

</style>