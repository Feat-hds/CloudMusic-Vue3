<template>
<!-- 将过大的播放次数用万，亿等单位缩短长度 -->
    <span>{{playnumber}}</span>
</template>

<script>
import { computed } from '@vue/runtime-core';
export default {
    name:'Playnumber',
    props:{
        number:{
            required:true,
        }
    },
    setup(props){
        let playnumber=computed(()=>{
            if(props.number>=100000000){
                let n=Math.floor(props.number/100000000);
                return n+'亿';
            }
            else if(props.number>=10000){
                let n=Math.floor(props.number/10000);
                return n+'万';
            }
        else return props.number;
    })
    return {playnumber}
}
}
</script>

<style>

</style>