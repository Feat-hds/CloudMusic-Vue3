<template>
<!-- 时间戳转换成持续时间格式 -->
    <span>{{duration}}</span>
</template>

<script>
import { computed } from '@vue/runtime-core';
export default {
    name:'Duration',
    props:{
        time:{ //传入时间戳
            type:Number,
            required:true,
        },
        second:{
            type:Boolean,
            default:false,
        }
    },
    setup(props){
        let duration=computed(()=>{
            if(props.second){
                let sec = Math.floor(props.time);
                let min = Math.floor(sec/60);
                let second = sec-min*60;
                if(min<10){
                    min=`0${min}`;
                }
                if(second<10){
                    second=`0${second}`;
                }
                return `${min}:${second}`
            }else{
                let sec = Math.floor(props.time/1000);
                let min = Math.floor(sec/60);
                let second = sec-min*60;
                if(min<10){
                    min=`0${min}`;
                }
                if(second<10){
                    second=`0${second}`;
                }
                return `${min}:${second}`
            }
        })
        return {duration}
    }
}
</script>

<style>

</style>