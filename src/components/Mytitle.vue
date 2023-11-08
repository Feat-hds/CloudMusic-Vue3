<template>
<!-- 封装的标题组件 -->
  <span @click="routerto" class="text_title" :class="{'default':hover==='default','hover':hover==='hover','normal':size==='normal','small':size==='small','light':color==='light','deep':color==='deep'}">
    <slot></slot>
  </span>
</template>

<script>
import { useRouter } from 'vue-router';
export default {
    name:'Mytitle',
    props:{
        size:{ //大小，分为normal,small
            type:String,
            default:'normal'
        },
        color:{ //颜色，传递一个CSS中的颜色代码
            type:String,
            default:'deep'
        },
        hover:{ //是否有hover效果,若为default则没有hover效果
            type:String,
            default:'hover'
        },
        router:{ //路由对象
            type:Object,
        },
        routemode:{ //开启路由模式，和router一起使用
            default:false,
        }
    },
    setup(props){
        let size=props.size;
        let color=props.color;
        const router=useRouter();
        function routerto(){
            if(props.routemode){
                router.push(props.router);
            }
        }
        return{size,color,routerto}
    }
}
</script>
<style lang="less" scoped>
.hover{
    cursor: pointer;
}
.default{
    cursor: default;
}
.text_title{
    display: inline-block;
}
.normal{
    font-size: 14px;
}
.small{
    font-size: 12px;
}
.light{
    color: #676767;

}
.light.hover{
    &:hover{
        color: #373737;
    }
}
.deep{
    color: #373737;

}
.deep.hover{
    &:hover{
        color: black;
    }
}
</style>