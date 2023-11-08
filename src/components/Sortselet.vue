<template>
  <div class="sort">
      <span class="sort_name" v-if="sort">{{sort}}:</span>
      <div class="sort_part">
        <div  v-for="(item,index) in list" :key="index" :class="{'sort_container':size==='normal','sort_container_small':size==='small'}">
            <span class="sort_child" :class="{'is-active':index===number}" @click="handleclick(index)">{{item}}</span>
        </div>
      </div>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity';
export default {
    name:'Sortselet',
    props:{
        sort:{
            default:false,
        },
        list:{
            type:Array,
            required:true,
        },
        size:{
            default:'normal',
        }
    },
    setup(props){
        let sort=props.sort;
        let number=ref(0);
        let size=props.size;
        const list=props.list;
        function handleclick(n){
            if(number.value!=n){
                number.value=n;
            }
        }
        return {sort,number,list,handleclick,size}
    }
}
</script>

<style lang="less" scoped>
.sort{
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    .sort_name{
        display: inline-block;
        width: 50px;
        flex-shrink: 0;
        font-size: 12px;
        color: #373737;
        cursor: default;
    }
    .sort_part{
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        .sort_container_small{
            margin-bottom: 6px;
            display: flex;
            justify-content: center;
            align-items: center;
            // width: 30px;
            // border-right-style: solid;
            // border-right-color: #F2F2F2;
            // border-width: 1px;
            .sort_child{
                display: inline-block;
                text-align: center;
                font-size: 12px;
                color: #676767;
                cursor: pointer;
                padding: 2px 10px;
                &:hover{
                    color: #373737;
                }
            }
            .is-active{
                color: #EC4141;
                background-color: #FDF5F5;
                border-radius: 10px;
                &:hover{
                    color: #EC4141;
                    background: #FDEDED;
                }
            }
        }
        .sort_container{
            margin-bottom: 6px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 80px;
            border-right-style: solid;
            border-right-color: #F2F2F2;
            border-width: 1px;
            .sort_child{
                display: inline-block;
                text-align: center;
                font-size: 12px;
                color: #676767;
                cursor: pointer;
                padding: 2px 10px;
                &:hover{
                    color: #373737;
                }
            }
            .is-active{
                color: #EC4141;
                background-color: #FDF5F5;
                border-radius: 10px;
                &:hover{
                    color: #EC4141;
                    background: #FDEDED;
                }
            }
        }
    }
}
</style>