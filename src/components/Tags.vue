<template>
<!-- 标签组件 -->
  <span class="tag" @click="routerto" :class="{'hover':props.routemode,'red':props.color==='red','gray':props.color==='gray'}"><slot></slot></span>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
    name:'Tags',
    props:{
      color:{ //预设值的颜色,red,gray
        type:String,
        default:'red',
      },
      routemode:{
        type:Boolean,
        default:false,
      },
      router:{
        type:Object,
      }
    },
    setup(props){
      const router=useRouter()
      function routerto(){
        if(props.routemode){
          router.push(props.router);
        }
      }
      return {props,routerto}
    }
}
</script>

<style lang="less" scoped>
.tag{
    margin-top: 0;
    margin-bottom: 0;
    border-style: solid;
    display: inline-block;
    border-width: 1px;
    
    font-size: 12px;
    border-radius: 3px;
    padding: 0 3px;
    cursor: default;
}
.red{
  border-color:#F28C8C;
  color: #EC4141;
}
.gray{
  color:#999999;
  border-color: #D7D7D7;
}
.hover{
  cursor: pointer;
}
</style>