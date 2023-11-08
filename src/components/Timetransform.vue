<template>
<!-- 接受一个时间戳，将时间戳转化为年月日格式 -->
  <span>{{time}}</span>
</template>

<script>
import { computed } from '@vue/runtime-core'
export default {
    props:{
        time:{
            type:Number,
            required:true,
        }
    },
    setup(props){
        let time=computed(()=>{
            let date = new Date(parseInt(props.time));
            let YY = date.getFullYear() + "-";
            let MM =
                (date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1)
                : date.getMonth() + 1) + "-";
            let DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            return YY + MM + DD;
        })
        return {time}
    }
}
</script>

<style lang="less" scoped>

</style>